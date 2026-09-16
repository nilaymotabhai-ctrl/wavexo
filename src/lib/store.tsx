import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { CMSContent, Lead, ActivityEntry, MediaFile, AdminUser, Role, Visit } from "./types";
import { DEFAULT_CONTENT, DEFAULT_PASSWORD, AUTH_KEY, CMS_KEY, SESSION_KEY } from "./data";

/* ------------------------------------------------------------------ */
/* Wavexo CMS Store — localStorage-persisted content engine.           */
/* Public pages read from here; the Admin Panel writes to here.        */
/* Swap the persistence layer for Supabase/Firebase without touching   */
/* any UI — every component only talks to this context.                */
/* ------------------------------------------------------------------ */

type CollectionKey =
  | "services" | "whyFeatures" | "process" | "industries" | "testimonials"
  | "faqs" | "team" | "pricing" | "portfolio" | "caseStudies" | "blog" | "trustedBy";

interface Session { userId: string; email: string; name: string; role: Role; t: number }

interface CMSContextValue {
  content: CMSContent;
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
      // merge with defaults so new fields appear after updates
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
  const [user, setUser] = useState<Session | null>(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });

  useEffect(() => {
    try { localStorage.setItem(CMS_KEY, JSON.stringify(content)); } catch { /* storage full */ }
  }, [content]);

  useEffect(() => {
    try {
      if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      else localStorage.removeItem(SESSION_KEY);
    } catch { /* ignore */ }
  }, [user]);

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
    setContent((c) => ({
      ...c,
      activity: [
        { id: uid(), t: Date.now(), user: user?.name || "System", action, detail } as ActivityEntry,
        ...c.activity,
      ].slice(0, 300),
    }));
  }, [user?.name]);

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
    setContent((c) => ({
      ...c,
      leads: [full, ...c.leads],
      activity: [{ id: uid(), t: Date.now(), user: "Website", action: "New lead", detail: `${full.name} · ${full.source}${full.service ? ` · ${full.service}` : ""}` }, ...c.activity].slice(0, 300),
    }));
    return full;
  }, []);

  const updateLead = useCallback((id: string, patch: Partial<Lead>) => {
    setContent((c) => ({ ...c, leads: c.leads.map((l) => (l.id === id ? { ...l, ...patch } : l)) }));
  }, []);

  const deleteLead = useCallback((id: string) => {
    setContent((c) => ({ ...c, leads: c.leads.filter((l) => l.id !== id) }));
  }, []);

  const trackVisit = useCallback((path: string) => {
    setContent((c) => {
      const visit: Visit = {
        t: Date.now(), path,
        device: window.innerWidth < 768 ? "mobile" : "desktop",
        source: document.referrer ? new URL(document.referrer, location.href).hostname : "direct",
      };
      return { ...c, visits: [...c.visits.slice(-999), visit] };
    });
  }, []);

  const addMedia = useCallback((files: MediaFile[]) => {
    setContent((c) => ({ ...c, media: [...files, ...c.media].slice(0, 200) }));
  }, []);

  const deleteMedia = useCallback((id: string) => {
    setContent((c) => ({ ...c, media: c.media.filter((m) => m.id !== id) }));
  }, []);

  /* ---------------- auth ---------------- */

  const login = useCallback((email: string, password: string) => {
    const pwds = loadPasswords();
    const u = content.users.find((x) => x.email.toLowerCase() === email.toLowerCase());
    if (!u || pwds[u.email] !== password) return { ok: false, error: "Invalid email or password." };
    const session: Session = { userId: u.id, email: u.email, name: u.name, role: u.role, t: Date.now() };
    setUser(session);
    setContent((c) => ({
      ...c,
      users: c.users.map((x) => (x.id === u.id ? { ...x, lastActive: Date.now() } : x)),
      activity: [{ id: uid(), t: Date.now(), user: u.name, action: "Login", detail: `Signed in as ${u.email}` }, ...c.activity].slice(0, 300),
    }));
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
    const exists = content.users.some((x) => x.email.toLowerCase() === email.toLowerCase());
    if (!exists) return { ok: false, error: "No admin account found for that email." };
    pwds[content.users.find((x) => x.email.toLowerCase() === email.toLowerCase())!.email] = next;
    localStorage.setItem(AUTH_KEY, JSON.stringify(pwds));
    return { ok: true };
  }, [content.users]);

  const saveUsers = useCallback((users: AdminUser[]) => {
    setContent((c) => ({ ...c, users }));
    // ensure passwords exist for new users
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
    content, save, updateSettings, updateHero, upsert, remove, move,
    addLead, updateLead, deleteLead, log, trackVisit, addMedia, deleteMedia,
    user, login, logout, logoutAll, changePassword, resetPassword, saveUsers, can,
    resetAll, exportData, importData,
  }), [content, save, updateSettings, updateHero, upsert, remove, move, addLead, updateLead, deleteLead, log, trackVisit, addMedia, deleteMedia, user, login, logout, logoutAll, changePassword, resetPassword, saveUsers, can, resetAll, exportData, importData]);

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
