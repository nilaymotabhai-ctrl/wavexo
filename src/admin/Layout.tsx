import { useMemo, useState } from "react";
import { NavLink, Outlet, Navigate, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, PanelsTopLeft, LayoutGrid, Layers, FolderKanban, TrendingUp, PenSquare,
  Quote, CircleHelp, UsersRound, Tag, Images, Globe, ScrollText, Settings, LogOut,
  Bell, ExternalLink, Menu, X, CheckCheck,
} from "lucide-react";
import { useCMS, timeAgo } from "../lib/store";
import { cn } from "../utils/cn";

const NAV: { group: string; items: { to: string; label: string; icon: typeof LayoutDashboard; end?: boolean }[] }[] = [
  {
    group: "Overview",
    items: [
      { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
      { to: "/admin/activity", label: "Activity Log", icon: ScrollText },
    ],
  },
  {
    group: "CRM",
    items: [{ to: "/admin/leads", label: "Leads & Inquiries", icon: Users }],
  },
  {
    group: "Content",
    items: [
      { to: "/admin/content", label: "Site Content & Offers", icon: PanelsTopLeft },
      { to: "/admin/sections", label: "Homepage Sections", icon: LayoutGrid },
      { to: "/admin/services", label: "Services", icon: Layers },
      { to: "/admin/portfolio", label: "Portfolio", icon: FolderKanban },
      { to: "/admin/case-studies", label: "Case Studies", icon: TrendingUp },
      { to: "/admin/blog", label: "Blog & Resources", icon: PenSquare },
      { to: "/admin/testimonials", label: "Testimonials", icon: Quote },
      { to: "/admin/faqs", label: "FAQs", icon: CircleHelp },
      { to: "/admin/team", label: "Team", icon: UsersRound },
      { to: "/admin/pricing", label: "Pricing & Plans", icon: Tag },
    ],
  },
  {
    group: "Library & SEO",
    items: [
      { to: "/admin/media", label: "Media Library", icon: Images },
      { to: "/admin/seo", label: "SEO Manager", icon: Globe },
    ],
  },
  {
    group: "System",
    items: [{ to: "/admin/settings", label: "Settings & Users", icon: Settings }],
  },
];

const ROLE_LABEL: Record<string, string> = {
  superadmin: "Super Admin", editor: "Editor", marketing: "Marketing Manager", content: "Content Manager", viewer: "Viewer",
};

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { content } = useCMS();
  const unread = content.leads.filter((l) => !l.read && !l.archived).length;
  return (
    <div className="flex h-full flex-col">
      <Link to="/admin" onClick={onNavigate} className="flex items-center gap-2.5 px-5 pb-6 pt-6">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyanx via-electric to-violetx shadow-lg">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round">
            <path d="M2 14c2.5-6 4.5-6 7 0s4.5 6 7 0 3.5-5 6-2.5" />
          </svg>
        </span>
        <div>
          <p className="font-display text-[15px] font-bold leading-none text-white">Wavexo<span className="text-gradient">.</span></p>
          <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-faint">Admin Panel</p>
        </div>
      </Link>
      <nav className="flex-1 space-y-5 overflow-y-auto px-3 pb-6" aria-label="Admin navigation">
        {NAV.map((g) => (
          <div key={g.group}>
            <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-faint/70">{g.group}</p>
            <div className="space-y-0.5">
              {g.items.map((it) => (
                <NavLink key={it.to} to={it.to} end={it.end} onClick={onNavigate}
                  className={({ isActive }) => cn(
                    "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200",
                    isActive ? "bg-gradient-to-r from-electric/25 to-violetx/20 text-white" : "text-mist hover:bg-white/[0.05] hover:text-white"
                  )}>
                  {({ isActive }) => (
                    <>
                      {isActive && <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-gradient-to-b from-cyanx to-magentax" />}
                      <it.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-cyan-300" : "text-faint group-hover:text-mist")} strokeWidth={1.9} />
                      {it.label}
                      {it.to === "/admin/leads" && unread > 0 && (
                        <span className="ml-auto rounded-full bg-gradient-to-r from-electric to-violetx px-2 py-0.5 text-[10px] font-bold text-white">{unread}</span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
      <div className="border-t border-white/[0.07] p-3">
        <Link to="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-mist transition hover:bg-white/[0.05] hover:text-white">
          <ExternalLink className="h-4 w-4 text-faint" /> View live website
        </Link>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const { user, authReady, content, logout, updateLead } = useCMS();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const navigate = useNavigate();

  const notifications = useMemo(
    () => content.leads.filter((l) => !l.read && !l.archived).slice(0, 6),
    [content.leads]
  );

  /* wait for Supabase session hydration before deciding access */
  if (!authReady) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#060912]">
        <div className="flex flex-col items-center gap-4">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-cyanx via-electric to-violetx shadow-[0_16px_50px_-12px_rgba(37,99,235,0.9)]">
            <svg viewBox="0 0 24 24" className="h-7 w-7 animate-pulse" fill="none" stroke="white" strokeWidth="2.3" strokeLinecap="round">
              <path d="M2 14c2.5-6 4.5-6 7 0s4.5 6 7 0 3.5-5 6-2.5" />
            </svg>
          </span>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-faint">Verifying session…</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/admin/login" replace />;

  const markAllRead = () => {
    notifications.forEach((l) => updateLead(l.id, { read: true }));
    setBellOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#060912]">
      {/* desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] border-r border-white/[0.07] bg-[#080d1e] lg:block">
        <Sidebar />
      </aside>

      {/* mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)} className="fixed inset-0 z-[70] bg-space/70 backdrop-blur-sm lg:hidden" />
            <motion.aside initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              className="fixed inset-y-0 left-0 z-[75] w-[270px] border-r border-white/10 bg-[#080d1e] lg:hidden">
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu"
                className="absolute right-3 top-4 grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-mist">
                <X className="h-4 w-4" />
              </button>
              <Sidebar onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* main */}
      <div className="lg:pl-[248px]">
        {/* topbar */}
        <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#060912]/85 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-7">
            <div className="flex items-center gap-3">
              <button onClick={() => setMobileOpen(true)} aria-label="Open menu"
                className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-white lg:hidden">
                <Menu className="h-4 w-4" />
              </button>
              <p className="hidden text-[13px] text-faint sm:block">
                Managing <span className="font-semibold text-white">{content.settings.siteName}</span> — changes go live instantly on this browser's site data.
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              {/* notifications */}
              <div className="relative">
                <button onClick={() => setBellOpen(!bellOpen)} aria-label="Notifications"
                  className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-mist transition hover:text-white">
                  <Bell className="h-4 w-4" />
                  {notifications.length > 0 && (
                    <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-gradient-to-r from-electric to-magentax text-[10px] font-bold text-white">
                      {notifications.length}
                    </span>
                  )}
                </button>
                <AnimatePresence>
                  {bellOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setBellOpen(false)} />
                      <motion.div initial={{ opacity: 0, y: 8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-white/10 bg-midnight shadow-2xl">
                        <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3">
                          <p className="text-[13px] font-semibold text-white">Notifications</p>
                          <button onClick={markAllRead} className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-300 hover:text-white">
                            <CheckCheck className="h-3.5 w-3.5" /> Mark all read
                          </button>
                        </div>
                        <div className="max-h-72 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <p className="px-4 py-8 text-center text-xs text-faint">All caught up. New leads and form submissions appear here.</p>
                          ) : (
                            notifications.map((n) => (
                              <button key={n.id} onClick={() => { updateLead(n.id, { read: true }); setBellOpen(false); navigate("/admin/leads"); }}
                                className="flex w-full items-start gap-3 border-b border-white/[0.05] px-4 py-3 text-left transition hover:bg-white/[0.04]">
                                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gradient-to-r from-cyanx to-magentax" />
                                <span>
                                  <span className="block text-[13px] font-medium text-white">New {n.source} inquiry — {n.name}</span>
                                  <span className="mt-0.5 block text-[11px] text-faint">{n.service || n.email} · {timeAgo(n.createdAt)}</span>
                                </span>
                              </button>
                            ))
                          )}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* user */}
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 py-1.5 pl-1.5 pr-3">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-electric to-violetx text-[11px] font-bold text-white">
                  {user.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
                </span>
                <div className="hidden sm:block">
                  <p className="text-[12px] font-semibold leading-none text-white">{user.name}</p>
                  <p className="mt-1 text-[10px] leading-none text-cyan-300">{ROLE_LABEL[user.role]}</p>
                </div>
              </div>
              <button onClick={logout} aria-label="Sign out" title="Sign out"
                className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-mist transition hover:border-rose-400/40 hover:text-rose-300">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
