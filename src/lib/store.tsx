import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { CMSContent, Lead, ActivityEntry, MediaFile, AdminUser, Role, Visit } from "./types";
import { DEFAULT_CONTENT, DEFAULT_PASSWORD, AUTH_KEY, CMS_KEY, SESSION_KEY } from "./data";
import {
  supabase, DOC_ID, buildDoc, fetchSiteDoc, saveSiteDoc,
  fetchLeads, upsertLeadRow, deleteLeadRow,
  fetchVisits, insertVisitRow,
  fetchActivity, insertActivityRow, clearActivityRows,
} from "./supabase";

/* ------------------------------------------------------------------ */
/* Wavexo CMS Store — Supabase-backed, realtime, cross-device.         */
/* On boot it loads the shared cloud document + leads/visits/activity. */
/* Every admin edit syncs to Postgres (debounced) and other open       */
/* sessions receive updates via Supabase Realtime. If the database is  */
/* unreachable the app transparently falls back to localStorage.       */
/* ------------------------------------------------------------------ */

type CollectionKey =
  | "services" | "whyFeatures" | "process" | "industries" | "testimonials"
  | "faqs" | "team" | "pricing" | "portfolio" | "caseStudies" | "blog" | "trustedBy";

interface Session { userId: string; email: string; name: string; role: Role; t: number }

export type DbStatus = "connecting" | "online" | "local";

interface CMSContextValue {
  content: CMSContent;
  dbStatus: DbStatus;
  save: (patch: Partial<CMSContent>) => void;
  updateSettings: (patch: Partial<CMSContent["settings"]>) => void;
  updateHero: (patch: Partial<CMSContent["hero"]>) => void;
  upsert: <K extends CollectionKey>(key: K, item: CMSContent[K][number] & { id: string }) => void;
  remove: (key: CollectionKey, id: string) => void;
  move: (key: CollectionKey, id: string, dir: -1 | 1) => void;
  addLead: (lead: Omit<Lead, "id" | "createdAt" | "read" | "status" | "priority" | "tags" | "notes" | "archived"> & Partial<Lead>) => Lead;
  updateLead: (id: string, patch: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  log: (action: string, detail: string) => void;
  clearActivity: () => void;
  trackVisit: (path: string) => void;
  addMedia: (files: MediaFile[]) => void;
  deleteMedia: (id: string) => void;
  // auth
  user: Session | null;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  logoutAll: () => void;
  changePassword: (current: string, next: string) => { ok: boolean; error?: string };
  resetPassword: (email: string, next: string) => { ok: boolean; error?: string };
  saveUsers: (users: AdminUser[]) => void;
  can: (area: "content" | "leads" | "settings" | "users" | "delete") => boolean;
  resetAll: () => void;
  exportData: () => void;
  importData: (json: string) => boolean;
}

const CMSContext = createContext<CMSContextValue | null>(null);

function loadContent(): CMSContent {
  try {
    const raw = localStorage.getItem(CMS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_CONTENT, ...parsed, settings: { ...DEFAULT_CONTENT.settings, ...(parsed.settings || {}) } };
    }
  } catch { /* ignore */ }
  return DEFAULT_CONTENT;
}

function loadPasswords(): Record<string, string> {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { "admin@wavexo.agency": DEFAULT_PASSWORD };
}

const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);

export function CMSProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<CMSContent>(loadContent);
  const [dbStatus, setDbStatus] = useState<DbStatus>("connecting");
  const [user, setUser] = useState<Session | null>(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });

  const dbStatusRef = useRef<DbStatus>("connecting");
  const lastSavedDoc = useRef<string>("");
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => { dbStatusRef.current = dbStatus; }, [dbStatus]);

  /* -------- local cache (instant paint + offline resilience) -------- */
  useEffect(() => {
    try { localStorage.setItem(CMS_KEY, JSON.stringify(content)); } catch { /* full */ }
  }, [content]);

  /* -------- debounced cloud sync of the content document -------- */
  useEffect(() => {
    if (dbStatus !== "online") return;
    const doc = buildDoc(content);
    const str = JSON.stringify(doc);
    if (str === lastSavedDoc.current) return;
    const t = setTimeout(() => {
      lastSavedDoc.current = str;
      saveSiteDoc(doc).catch(() => setDbStatus("local"));
    }, 900);
    return () => clearTimeout(t);
  }, [content, dbStatus]);

  /* -------- bootstrap: pull cloud state + subscribe realtime -------- */
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const row = await fetchSiteDoc();
        const [leads, visits, activity] = await Promise.all([fetchLeads().catch(() => [] as Lead[]), fetchVisits().catch(() => [] as Visit[]), fetchActivity().catch(() => [] as ActivityEntry[])]);
        if (cancelled) return;

        if (row?.data && Object.keys(row.data).length > 5) {
          // cloud already seeded — remote is the shared source of truth
          const doc = row.data;
          lastSavedDoc.current = JSON.stringify(doc);
          setContent(() => ({
            ...DEFAULT_CONTENT, ...doc,
            settings: { ...DEFAULT_CONTENT.settings, ...(doc.settings || {}) },
            leads, visits, activity,
          } as CMSContent));
        } else {
          // first connection: push existing content (defaults or local edits) up to the cloud
          setContent((c) => {
            const doc = buildDoc(c);
            lastSavedDoc.current = JSON.stringify(doc);
            void saveSiteDoc(doc).catch(() => undefined);
            // seed the side tables too so every device sees the same data
            c.leads.forEach((l) => void upsertLeadRow(l).catch(() => undefined));
            c.activity.forEach((a) => void insertActivityRow(a).catch(() => undefined));
            return { ...c, leads: c.leads.length ? c.leads : leads, visits: c.visits.length ? c.visits : visits, activity: c.activity.length ? c.activity : activity };
          });
        }
        if (cancelled) return;
        setDbStatus("online");

        /* realtime — receive edits made on other devices */
        channelRef.current = supabase
          .channel("wavexo-cms-sync")
          .on("postgres_changes", { event: "*", schema: "public", table: "site_content" }, (payload) => {
            const incoming = (payload.new as { id?: string; data?: Partial<CMSContent> })?.data;
            if (!incoming || (payload.new as { id?: string }).id !== DOC_ID) return;
            const str = JSON.stringify(incoming);
            if (str === lastSavedDoc.current) return; // our own write echo
            lastSavedDoc.current = str;
            setContent((prev) => ({
              ...prev, ...incoming,
              settings: { ...prev.settings, ...(incoming.settings || {}) },
            } as CMSContent));
          })
          .on("postgres_changes", { event: "INSERT", schema: "public", table: "leads" }, (payload) => {
            const lead = (payload.new as { payload?: Lead })?.payload;
            if (!lead?.id) return;
            setContent((prev) => prev.leads.some((l) => l.id === lead.id) ? prev : { ...prev, leads: [lead, ...prev.leads] });
          })
          .on("postgres_changes", { event: "UPDATE", schema: "public", table: "leads" }, (payload) => {
            const lead = (payload.new as { payload?: Lead })?.payload;
            if (!lead?.id) return;
            setContent((prev) => ({ ...prev, leads: prev.leads.map((l) => (l.id === lead.id ? lead : l)) }));
          })
          .on("postgres_changes", { event: "DELETE", schema: "public", table: "leads" }, (payload) => {
            const id = (payload.old as { id?: string })?.id;
            if (!id) return;
            setContent((prev) => ({ ...prev, leads: prev.leads.filter((l) => l.id !== id) }));
          })
          .on("postgres_changes", { event: "INSERT", schema: "public", table: "activity" }, (payload) => {
            const r = payload.new as { id: string; t: number; user_name: string; action: string; detail: string };
            if (!r?.id) return;
            setContent((prev) => prev.activity.some((a) => a.id === r.id) ? prev : {
              ...prev,
              activity: [{ id: r.id, t: Number(r.t), user: r.user_name, action: r.action, detail: r.detail }, ...prev.activity].slice(0, 300),
            });
          })
          .subscribe((status) => {
            if (status === "CHANNEL_ERROR") setDbStatus((s) => (s === "online" ? "local" : s));
          });
      } catch {
        if (!cancelled) setDbStatus("local");
      }
    })();

    return () => {
      cancelled = true;
      if (channelRef.current) void supabase.removeChannel(channelRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      else localStorage.removeItem(SESSION_KEY);
    } catch { /* ignore */ }
  }, [user]);

  /* ---------------- mutations ---------------- */

  const save = useCallback((patch: Partial<CMSContent>) => {
    setContent((c) => ({ ...c, ...patch }));
  }, []);

  const updateSettings = useCallback((patch: Partial<CMSContent["settings"]>) => {
    setContent((c) => ({ ...c, settings: { ...c.settings, ...patch } }));
  }, []);

  const updateHero = useCallback((patch: Partial<CMSContent["hero"]>) => {
    setContent((c) => ({ ...c, hero: { ...c.hero, ...patch } }));
  }, []);

  const log = useCallback((action: string, detail: string) => {
    const entry: ActivityEntry = { id: uid(), t: Date.now(), user: user?.name || "System", action, detail };
    setContent((c) => ({ ...c, activity: [entry, ...c.activity].slice(0, 300) }));
    if (dbStatusRef.current === "online") void insertActivityRow(entry).catch(() => undefined);
  }, [user?.name]);

  const clearActivity = useCallback(() => {
    setContent((c) => ({ ...c, activity: [] }));
    if (dbStatusRef.current === "online") void clearActivityRows().catch(() => undefined);
  }, []);

  const upsert = useCallback(<K extends CollectionKey>(key: K, item: CMSContent[K][number] & { id: string }) => {
    setContent((c) => {
      const list = c[key] as { id: string }[];
      const exists = list.some((x) => x.id === item.id);
      const next = exists ? list.map((x) => (x.id === item.id ? item : x)) : [...list, item];
      return { ...c, [key]: next } as CMSContent;
    });
  }, []);

  const remove = useCallback((key: CollectionKey, id: string) => {
    setContent((c) => ({ ...c, [key]: (c[key] as { id: string }[]).filter((x) => x.id !== id) } as CMSContent));
  }, []);

  const move = useCallback((key: CollectionKey, id: string, dir: -1 | 1) => {
    setContent((c) => {
      const list = [...(c[key] as { id: string; order?: number }[])];
      const i = list.findIndex((x) => x.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= list.length) return c;
      [list[i], list[j]] = [list[j], list[i]];
      return { ...c, [key]: list.map((x, idx) => ({ ...x, order: idx })) } as CMSContent;
    });
  }, []);

  const addLead = useCallback<CMSContextValue["addLead"]>((lead) => {
    const full: Lead = {
      id: uid(), createdAt: Date.now(), read: false, status: "new",
      priority: "medium", tags: [], notes: [], archived: false, ...lead,
    };
    const entry: ActivityEntry = { id: uid(), t: Date.now(), user: "Website", action: "New lead", detail: `${full.name} · ${full.source}${full.service ? ` · ${full.service}` : ""}` };
    setContent((c) => ({ ...c, leads: [full, ...c.leads], activity: [entry, ...c.activity].slice(0, 300) }));
    if (dbStatusRef.current === "online") {
      void upsertLeadRow(full).catch(() => undefined);
      void insertActivityRow(entry).catch(() => undefined);
    }
    return full;
  }, []);

  const updateLead = useCallback((id: string, patch: Partial<Lead>) => {
    setContent((c) => {
      const updated = c.leads.map((l) => (l.id === id ? { ...l, ...patch } : l));
      const full = updated.find((l) => l.id === id);
      if (full && dbStatusRef.current === "online") void upsertLeadRow(full).catch(() => undefined);
      return { ...c, leads: updated };
    });
  }, []);

  const deleteLead = useCallback((id: string) => {
    setContent((c) => ({ ...c, leads: c.leads.filter((l) => l.id !== id) }));
    if (dbStatusRef.current === "online") void deleteLeadRow(id).catch(() => undefined);
  }, []);

  const trackVisit = useCallback((path: string) => {
    const visit: Visit = {
      t: Date.now(), path,
      device: window.innerWidth < 768 ? "mobile" : "desktop",
      source: document.referrer ? new URL(document.referrer, location.href).hostname : "direct",
    };
    setContent((c) => ({ ...c, visits: [...c.visits.slice(-999), visit] }));
    if (dbStatusRef.current === "online") void insertVisitRow(visit).catch(() => undefined);
  }, []);

  const addMedia = useCallback((files: MediaFile[]) => {
    setContent((c) => ({ ...c, media: [...files, ...c.media].slice(0, 200) }));
  }, []);

  const deleteMedia = useCallback((id: string) => {
    setContent((c) => ({ ...c, media: c.media.filter((m) => m.id !== id) }));
  }, []);

  /* ---------------- auth (client-side workspace credentials) ---------------- */

  const login = useCallback((email: string, password: string) => {
    const pwds = loadPasswords();
    const u = content.users.find((x) => x.email.toLowerCase() === email.toLowerCase());
    if (!u || pwds[u.email] !== password) return { ok: false, error: "Invalid email or password." };
    const session: Session = { userId: u.id, email: u.email, name: u.name, role: u.role, t: Date.now() };
    setUser(session);
    const entry: ActivityEntry = { id: uid(), t: Date.now(), user: u.name, action: "Login", detail: `Signed in as ${u.email}` };
    setContent((c) => ({
      ...c,
      users: c.users.map((x) => (x.id === u.id ? { ...x, lastActive: Date.now() } : x)),
      activity: [entry, ...c.activity].slice(0, 300),
    }));
    if (dbStatusRef.current === "online") void insertActivityRow(entry).catch(() => undefined);
    return { ok: true };
  }, [content.users]);

  const logout = useCallback(() => setUser(null), []);
  const logoutAll = useCallback(() => setUser(null), []);

  const changePassword = useCallback((current: string, next: string) => {
    if (!user) return { ok: false, error: "Not signed in." };
    const pwds = loadPasswords();
    if (pwds[user.email] !== current) return { ok: false, error: "Current password is incorrect." };
    if (next.length < 8) return { ok: false, error: "Password must be at least 8 characters." };
    pwds[user.email] = next;
    localStorage.setItem(AUTH_KEY, JSON.stringify(pwds));
    log("Password changed", user.email);
    return { ok: true };
  }, [user, log]);

  const resetPassword = useCallback((email: string, next: string) => {
    const pwds = loadPasswords();
    const target = content.users.find((x) => x.email.toLowerCase() === email.toLowerCase());
    if (!target) return { ok: false, error: "No admin account found for that email." };
    pwds[target.email] = next;
    localStorage.setItem(AUTH_KEY, JSON.stringify(pwds));
    return { ok: true };
  }, [content.users]);

  const saveUsers = useCallback((users: AdminUser[]) => {
    setContent((c) => ({ ...c, users }));
    const pwds = loadPasswords();
    users.forEach((u) => { if (!pwds[u.email]) pwds[u.email] = DEFAULT_PASSWORD; });
    localStorage.setItem(AUTH_KEY, JSON.stringify(pwds));
  }, []);

  const can = useCallback((area: "content" | "leads" | "settings" | "users" | "delete") => {
    if (!user) return false;
    const r = user.role;
    if (r === "superadmin") return true;
    if (r === "viewer") return false;
    if (area === "settings" || area === "users") return false;
    if (area === "leads") return r === "marketing" || r === "editor";
    if (area === "content") return r === "editor" || r === "content" || r === "marketing";
    if (area === "delete") return r === "editor" || r === "marketing";
    return true;
  }, [user]);

  const resetAll = useCallback(() => {
    localStorage.removeItem(CMS_KEY);
    setContent(DEFAULT_CONTENT);
    if (dbStatusRef.current === "online") {
      const c = DEFAULT_CONTENT;
      void saveSiteDoc(buildDoc(c)).catch(() => undefined);
      void (async () => {
        try {
          await supabase.from("leads").delete().neq("id", "");
          await Promise.all(c.leads.map((l) => upsertLeadRow(l).catch(() => undefined)));
          await supabase.from("visits").delete().gt("id", 0);
          await supabase.from("activity").delete().neq("id", "");
          await Promise.all(c.activity.map((a) => insertActivityRow(a).catch(() => undefined)));
        } catch { /* cloud wipe best-effort */ }
      })();
    }
  }, []);

  const exportData = useCallback(() => {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `wavexo-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  }, [content]);

  const importData = useCallback((json: string) => {
    try {
      const parsed = JSON.parse(json);
      if (!parsed.settings || !parsed.services) return false;
      setContent({ ...DEFAULT_CONTENT, ...parsed });
      return true;
    } catch { return false; }
  }, []);

  const value = useMemo<CMSContextValue>(() => ({
    content, dbStatus, save, updateSettings, updateHero, upsert, remove, move,
    addLead, updateLead, deleteLead, log, clearActivity, trackVisit, addMedia, deleteMedia,
    user, login, logout, logoutAll, changePassword, resetPassword, saveUsers, can,
    resetAll, exportData, importData,
  }), [content, dbStatus, save, updateSettings, updateHero, upsert, remove, move, addLead, updateLead, deleteLead, log, clearActivity, trackVisit, addMedia, deleteMedia, user, login, logout, logoutAll, changePassword, resetPassword, saveUsers, can, resetAll, exportData, importData]);

  return <CMSContext.Provider value={value}>{children}</CMSContext.Provider>;
}

export function useCMS() {
  const ctx = useContext(CMSContext);
  if (!ctx) throw new Error("useCMS must be used inside CMSProvider");
  return ctx;
}

/* ---------------- helpers ---------------- */

export const sorted = <T extends { order?: number; published?: boolean }>(list: T[]) =>
  [...list].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

export const publishedSorted = <T extends { order?: number; published?: boolean }>(list: T[]) =>
  sorted(list.filter((x) => x.published !== false));

export const newId = uid;

export function formatDate(t: number | string) {
  const d = typeof t === "string" ? new Date(t) : new Date(t);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function timeAgo(t: number) {
  const s = Math.floor((Date.now() - t) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 86400 * 30) return `${Math.floor(s / 86400)}d ago`;
  return formatDate(t);
}

export const waLink = (number: string, text?: string) =>
  `https://wa.me/${number.replace(/\D/g, "")}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export const initials = (name: string) =>
  name.split(" ").map((w) => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
