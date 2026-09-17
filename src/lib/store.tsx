import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { CMSContent, Lead, ActivityEntry, MediaFile, AdminUser, Role, Visit } from "./types";
import { DEFAULT_CONTENT, CMS_KEY } from "./data";
import {
  supabase, SUPABASE_READY, DOC_ID, buildDoc, fetchSiteDoc, saveSiteDoc,
  fetchLeads, upsertLeadRow, deleteLeadRow,
  fetchVisits, insertVisitRow,
  fetchActivity, insertActivityRow, clearActivityRows,
} from "./supabase";

/* ------------------------------------------------------------------ */
/* Wavexo CMS Store — PRODUCTION                                       */
/*                                                                     */
/* Source of truth: Supabase Postgres (site_content doc + leads /      */
/* visits / activity tables). localStorage is ONLY a render cache.     */
/*                                                                     */
/* Auth: Supabase Auth (email + password). Only authenticated admins   */
/* can read leads/visits/activity or write ANY content — Row Level     */
/* Security enforces it server-side; the client mirrors the same       */
/* rules so the UI behaves cleanly. Public visitors get: site_content  */
/* SELECT, leads/visits/activity INSERT, realtime content updates.     */
/* ------------------------------------------------------------------ */

type CollectionKey =
  | "services" | "whyFeatures" | "process" | "industries" | "testimonials"
  | "faqs" | "team" | "pricing" | "portfolio" | "caseStudies" | "blog" | "trustedBy";

interface Session { userId: string; email: string; name: string; role: Role; t: number }

export type DbStatus = "connecting" | "online" | "local";

interface CMSContextValue {
  content: CMSContent;
  dbStatus: DbStatus;
  authReady: boolean;
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
  // auth (Supabase Auth)
  user: Session | null;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  changePassword: (current: string, next: string) => Promise<{ ok: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ ok: boolean; error?: string }>;
  saveUsers: (users: AdminUser[]) => void;
  can: (area: "content" | "leads" | "settings" | "users" | "delete") => boolean;
  resetAll: () => void;
  exportData: () => void;
  importData: (json: string) => boolean;
}

const CMSContext = createContext<CMSContextValue | null>(null);

/* localStorage is a CACHE for instant first paint only — cloud wins online */
function loadCache(): CMSContent {
  try {
    const raw = localStorage.getItem(CMS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_CONTENT, ...parsed, settings: { ...DEFAULT_CONTENT.settings, ...(parsed.settings || {}) } };
    }
  } catch { /* ignore */ }
  return DEFAULT_CONTENT;
}

const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);

export function CMSProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<CMSContent>(loadCache);
  const [dbStatus, setDbStatus] = useState<DbStatus>(SUPABASE_READY ? "connecting" : "local");
  const [user, setUser] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(!SUPABASE_READY);

  const dbStatusRef = useRef<DbStatus>(dbStatus);
  const contentRef = useRef(content);
  const lastSavedDoc = useRef<string>("");
  const docEmptyRef = useRef(false);
  const publicChannel = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const adminChannel = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const adminInitRef = useRef(false);

  useEffect(() => { dbStatusRef.current = dbStatus; }, [dbStatus]);
  useEffect(() => { contentRef.current = content; }, [content]);

  const isAuthed = useCallback(() => user !== null, [user]);
  const canWriteCloud = useCallback(() => dbStatusRef.current === "online" && isAuthed(), [isAuthed]);

  /* -------- cache only (NOT the source of truth) -------- */
  useEffect(() => {
    try { localStorage.setItem(CMS_KEY, JSON.stringify(content)); } catch { /* full */ }
  }, [content]);

  /* -------- admin-only write: debounced UPSERT of full content doc -------- */
  useEffect(() => {
    if (!canWriteCloud()) return;
    const doc = buildDoc(content);
    const str = JSON.stringify(doc);
    if (str === lastSavedDoc.current) return;
    const t = setTimeout(() => {
      lastSavedDoc.current = str;
      saveSiteDoc(doc).catch(() => undefined);
    }, 900);
    return () => clearTimeout(t);
  }, [content, canWriteCloud]);

  /* -------- public bootstrap: fetch 'main' doc + live content stream -------- */
  useEffect(() => {
    if (!SUPABASE_READY) return;
    let cancelled = false;

    (async () => {
      try {
        const row = await fetchSiteDoc();
        if (cancelled) return;
        if (row?.data && Object.keys(row.data).length > 5) {
          const doc = row.data;
          lastSavedDoc.current = JSON.stringify(doc);
          setContent({
            ...DEFAULT_CONTENT, ...doc,
            settings: { ...DEFAULT_CONTENT.settings, ...(doc.settings || {}) },
            // protected collections stay empty until an admin signs in
            leads: [], visits: [], activity: [],
          } as CMSContent);
        } else {
          docEmptyRef.current = true; // first run — an admin sign-in will seed the cloud
        }
        setDbStatus("online");

        /* realtime: public pages update live the moment an admin saves */
        publicChannel.current = supabase
          .channel("wavexo-public-content")
          .on("postgres_changes", { event: "*", schema: "public", table: "site_content" }, (payload) => {
            const row2 = payload.new as { id?: string; data?: Partial<CMSContent> };
            if (!row2?.data || row2.id !== DOC_ID) return;
            const str = JSON.stringify(row2.data);
            if (str === lastSavedDoc.current) return;
            lastSavedDoc.current = str;
            setContent((prev) => ({
              ...prev, ...row2.data!,
              settings: { ...prev.settings, ...(row2.data!.settings || {}) },
            } as CMSContent));
          })
          .subscribe();
      } catch {
        if (!cancelled) setDbStatus("local");
      }
    })();

    return () => {
      cancelled = true;
      if (publicChannel.current) void supabase.removeChannel(publicChannel.current);
      if (adminChannel.current) void supabase.removeChannel(adminChannel.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* -------- admin init: after auth, load protected data + admin stream -------- */
  const initAdminData = useCallback(async () => {
    try {
      const [leads, visits, activity] = await Promise.all([
        fetchLeads().catch(() => [] as Lead[]),
        fetchVisits().catch(() => [] as Visit[]),
        fetchActivity().catch(() => [] as ActivityEntry[]),
      ]);
      setContent((c) => ({ ...c, leads: leads.length ? leads : c.leads, visits: visits.length ? visits : c.visits, activity }));
      if (adminChannel.current) void supabase.removeChannel(adminChannel.current);
      adminChannel.current = supabase
        .channel("wavexo-admin-feed")
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
          if (id) setContent((prev) => ({ ...prev, leads: prev.leads.filter((l) => l.id !== id) }));
        })
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "activity" }, (payload) => {
          const r = payload.new as { id: string; t: number; user_name: string; action: string; detail: string };
          if (!r?.id) return;
          setContent((prev) => prev.activity.some((a) => a.id === r.id) ? prev : {
            ...prev,
            activity: [{ id: r.id, t: Number(r.t), user: r.user_name, action: r.action, detail: r.detail }, ...prev.activity].slice(0, 300),
          });
        })
        .subscribe();
    } catch { /* stays usable */ }
  }, []);

  /* -------- Supabase Auth session handling -------- */
  useEffect(() => {
    if (!SUPABASE_READY) { setAuthReady(true); return; }

    const resolveSession = async (authUser: { id: string; email?: string } | null) => {
      if (authUser?.email) {
        const email = authUser.email;
        const match = contentRef.current.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
        const role: Role = match?.role ?? "superadmin"; // only Supabase-Auth users can sign in at all
        setUser({ userId: authUser.id, email, name: match?.name || email.split("@")[0], role, t: Date.now() });
        setContent((c) => ({
          ...c,
          users: match ? c.users.map((u) => (u.id === match.id ? { ...u, lastActive: Date.now() } : u)) : c.users,
        }));
        if (!adminInitRef.current) {
          adminInitRef.current = true;
          await initAdminData();
        }
        // first-ever run: seed the cloud document now that writes are allowed
        if (docEmptyRef.current) {
          docEmptyRef.current = false;
          const doc = buildDoc(contentRef.current);
          lastSavedDoc.current = JSON.stringify(doc);
          void saveSiteDoc(doc).catch(() => undefined);
        }
      } else {
        setUser(null);
        adminInitRef.current = false;
        if (adminChannel.current) { void supabase.removeChannel(adminChannel.current); adminChannel.current = null; }
        // privacy: drop protected collections for signed-out/public viewers
        setContent((c) => ({ ...c, leads: [], visits: [], activity: [] }));
      }
      setAuthReady(true);
    };

    void supabase.auth.getSession().then(({ data }) => resolveSession(data.session?.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      void resolveSession(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------- content mutations (UI unchanged) ---------------- */

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
    if (canWriteCloud()) void clearActivityRows().catch(() => undefined);
  }, [canWriteCloud]);

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

  /* -------- leads: public INSERT, admin reads/updates (RLS enforced) -------- */

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
      if (full && canWriteCloud()) void upsertLeadRow(full).catch(() => undefined);
      return { ...c, leads: updated };
    });
  }, [canWriteCloud]);

  const deleteLead = useCallback((id: string) => {
    setContent((c) => ({ ...c, leads: c.leads.filter((l) => l.id !== id) }));
    if (canWriteCloud()) void deleteLeadRow(id).catch(() => undefined);
  }, [canWriteCloud]);

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

  /* ---------------- Supabase Auth ---------------- */

  const login = useCallback(async (email: string, password: string) => {
    if (!SUPABASE_READY) return { ok: false, error: "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY." };
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) return { ok: false, error: error.message === "Invalid login credentials" ? "Invalid email or password." : error.message };
    const entry: ActivityEntry = { id: uid(), t: Date.now(), user: email.split("@")[0], action: "Login", detail: `Signed in as ${email}` };
    void insertActivityRow(entry).catch(() => undefined);
    return { ok: true };
  }, []);

  const logout = useCallback(async () => {
    if (SUPABASE_READY) await supabase.auth.signOut();
    setUser(null);
  }, []);

  const logoutAll = useCallback(async () => {
    if (SUPABASE_READY) await supabase.auth.signOut({ scope: "global" });
    setUser(null);
  }, []);

  const changePassword = useCallback(async (current: string, next: string) => {
    if (!user) return { ok: false, error: "Not signed in." };
    if (next.length < 8) return { ok: false, error: "Password must be at least 8 characters." };
    // verify current password first
    const check = await supabase.auth.signInWithPassword({ email: user.email, password: current });
    if (check.error) return { ok: false, error: "Current password is incorrect." };
    const { error } = await supabase.auth.updateUser({ password: next });
    if (error) return { ok: false, error: error.message };
    log("Password changed", user.email);
    return { ok: true };
  }, [user, log]);

  const resetPassword = useCallback(async (email: string) => {
    if (!SUPABASE_READY) return { ok: false, error: "Supabase is not configured." };
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/admin/login`,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  }, []);

  const saveUsers = useCallback((users: AdminUser[]) => {
    setContent((c) => ({ ...c, users }));
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
    if (canWriteCloud()) {
      const c = DEFAULT_CONTENT;
      void saveSiteDoc(buildDoc(c)).catch(() => undefined);
      void (async () => {
        try {
          await supabase.from("leads").delete().neq("id", "");
          await Promise.all(c.leads.map((l) => upsertLeadRow(l).catch(() => undefined)));
          await supabase.from("visits").delete().gt("id", 0);
          await supabase.from("activity").delete().neq("id", "");
          await Promise.all(c.activity.map((a) => insertActivityRow(a).catch(() => undefined)));
        } catch { /* best effort */ }
      })();
    }
  }, [canWriteCloud]);

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
    content, dbStatus, authReady, save, updateSettings, updateHero, upsert, remove, move,
    addLead, updateLead, deleteLead, log, clearActivity, trackVisit, addMedia, deleteMedia,
    user, login, logout, logoutAll, changePassword, resetPassword, saveUsers, can,
    resetAll, exportData, importData,
  }), [content, dbStatus, authReady, save, updateSettings, updateHero, upsert, remove, move, addLead, updateLead, deleteLead, log, clearActivity, trackVisit, addMedia, deleteMedia, user, login, logout, logoutAll, changePassword, resetPassword, saveUsers, can, resetAll, exportData, importData]);

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
