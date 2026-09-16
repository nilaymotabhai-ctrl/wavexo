import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Users, CalendarCheck, Mail, Eye, TrendingUp, MousePointerClick,
  ArrowRight, PenSquare, Megaphone, Smartphone, Monitor,
} from "lucide-react";
import { useCMS, timeAgo, formatDate } from "../lib/store";
import { ACard, SectionTitle, Pill } from "./ui";
import { cn } from "../utils/cn";

const SOURCE_COLORS: Record<string, string> = {
  contact: "#22d3ee", audit: "#8b5cf6", consultation: "#d946ef",
  newsletter: "#34d399", whatsapp: "#4ade80", service: "#60a5fa",
  google: "#22d3ee", direct: "#8b5cf6", instagram: "#d946ef", facebook: "#60a5fa", referral: "#fbbf24",
};

function monthKey(t: number) {
  const d = new Date(t);
  return `${d.getFullYear()}-${d.getMonth()}`;
}

export default function Dashboard() {
  const { content, user } = useCMS();
  const { leads, visits, activity } = content;

  const stats = useMemo(() => {
    const active = leads.filter((l) => !l.archived);
    const fresh = active.filter((l) => !l.read).length;
    const consults = active.filter((l) => l.source === "consultation").length;
    const subscribers = active.filter((l) => l.source === "newsletter").length;
    const conv = visits.length ? Math.min(100, (active.length / visits.length) * 100) : 0;
    return { total: active.length, fresh, consults, subscribers, conv, views: visits.length };
  }, [leads, visits]);

  // leads per month (last 6)
  const monthly = useMemo(() => {
    const buckets: { label: string; count: number }[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      buckets.push({
        label: d.toLocaleDateString("en-IN", { month: "short" }),
        count: leads.filter((l) => monthKey(l.createdAt) === key).length,
      });
    }
    return buckets;
  }, [leads]);

  const sources = useMemo(() => {
    const map: Record<string, number> = {};
    leads.forEach((l) => { map[l.source] = (map[l.source] || 0) + 1; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [leads]);

  const traffic = useMemo(() => {
    const map: Record<string, number> = {};
    visits.forEach((v) => { const s = v.source || "direct"; map[s] = (map[s] || 0) + 1; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [visits]);

  const topPages = useMemo(() => {
    const map: Record<string, number> = {};
    visits.forEach((v) => { map[v.path] = (map[v.path] || 0) + 1; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [visits]);

  const devices = useMemo(() => {
    const m = visits.filter((v) => v.device === "mobile").length;
    return { mobile: m, desktop: visits.length - m };
  }, [visits]);

  const cards = [
    { label: "Total Leads", value: stats.total, icon: Users, grad: "from-cyanx to-electric", to: "/admin/leads" },
    { label: "New / Unread", value: stats.fresh, icon: Megaphone, grad: "from-electric to-violetx", to: "/admin/leads" },
    { label: "Consultations", value: stats.consults, icon: CalendarCheck, grad: "from-violetx to-magentax", to: "/admin/leads" },
    { label: "Subscribers", value: stats.subscribers, icon: Mail, grad: "from-magentax to-rose-500", to: "/admin/leads" },
    { label: "Site Visits", value: stats.views, icon: Eye, grad: "from-emerald-400 to-cyanx", to: "/admin/seo" },
    { label: "Lead Conv. Rate", value: `${stats.conv.toFixed(1)}%`, icon: MousePointerClick, grad: "from-amber-400 to-orange-500", to: "/admin/leads" },
  ];

  // area chart path
  const max = Math.max(1, ...monthly.map((m) => m.count));
  const W = 560, H = 180, PAD = 8;
  const pts = monthly.map((m, i) => ({
    x: PAD + (i / (monthly.length - 1)) * (W - PAD * 2),
    y: H - PAD - (m.count / max) * (H - PAD * 2 - 20),
  }));
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const area = `${line} L${pts[pts.length - 1].x},${H - PAD} L${pts[0].x},${H - PAD} Z`;

  // donut
  const totalSrc = Math.max(1, sources.reduce((a, [, v]) => a + v, 0));
  let acc = 0;
  const R = 15.9;

  return (
    <div>
      <SectionTitle
        title={`Welcome back, ${user?.name.split(" ")[0] || "Admin"}`}
        sub={new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        right={
          <div className="flex gap-2">
            <Link to="/admin/blog" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[13px] font-semibold text-white/80 transition hover:text-white">
              <PenSquare className="h-4 w-4" /> New blog post
            </Link>
            <Link to="/admin/leads" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-electric to-violetx px-4 py-2.5 text-[13px] font-semibold text-white transition hover:opacity-90">
              View leads <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        }
      />

      {/* stat cards */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 xl:grid-cols-6">
        {cards.map((c, i) => (
          <Link to={c.to} key={c.label}>
            <ACard className="card-glow h-full !p-4" >
              <span className={cn("grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br text-white", c.grad)}>
                <c.icon className="h-4 w-4" strokeWidth={1.9} />
              </span>
              <p className="font-display mt-3 text-2xl font-bold text-white">{typeof c.value === "number" ? c.value.toLocaleString() : c.value}</p>
              <p className="mt-0.5 text-[11px] font-medium text-faint">{c.label}</p>
              <span className="sr-only">{i}</span>
            </ACard>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        {/* leads chart */}
        <ACard className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-[15px] font-bold text-white">Leads — last 6 months</h3>
              <p className="mt-0.5 text-[11px] text-faint">All sources combined (live data from your forms)</p>
            </div>
            <Pill tone="green"><TrendingUp className="h-3 w-3" /> {stats.total} total</Pill>
          </div>
          <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 w-full" role="img" aria-label="Leads per month chart">
            <defs>
              <linearGradient id="areaG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="lineG" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="55%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#d946ef" />
              </linearGradient>
            </defs>
            {[0.25, 0.5, 0.75].map((f) => (
              <line key={f} x1={PAD} x2={W - PAD} y1={H * f} y2={H * f} stroke="rgba(255,255,255,0.05)" strokeDasharray="4 6" />
            ))}
            <path d={area} fill="url(#areaG)" />
            <path d={line} fill="none" stroke="url(#lineG)" strokeWidth="2.5" strokeLinecap="round" />
            {pts.map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r="4" fill="#0d1330" stroke="#22d3ee" strokeWidth="2" />
                <text x={p.x} y={H - 0} textAnchor="middle" fontSize="10" fill="#6b7490">{monthly[i].label}</text>
                <text x={p.x} y={p.y - 9} textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff">{monthly[i].count}</text>
              </g>
            ))}
          </svg>
        </ACard>

        {/* donut: lead sources */}
        <ACard>
          <h3 className="font-display text-[15px] font-bold text-white">Lead sources</h3>
          <div className="mt-4 flex items-center gap-5">
            <svg viewBox="0 0 42 42" className="h-32 w-32 shrink-0 -rotate-90" role="img" aria-label="Lead sources donut">
              <circle cx="21" cy="21" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
              {sources.map(([s, v]) => {
                const frac = v / totalSrc;
                const dash = `${frac * 100} ${100 - frac * 100}`;
                const el = (
                  <circle key={s} cx="21" cy="21" r={R} fill="none"
                    stroke={SOURCE_COLORS[s] || "#64748b"} strokeWidth="5"
                    strokeDasharray={dash} strokeDashoffset={-acc * 100} strokeLinecap="butt" />
                );
                acc += frac;
                return el;
              })}
            </svg>
            <div className="min-w-0 flex-1 space-y-2">
              {sources.map(([s, v]) => (
                <div key={s} className="flex items-center gap-2 text-[12px]">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ background: SOURCE_COLORS[s] || "#64748b" }} />
                  <span className="capitalize text-mist">{s.replace("-", " ")}</span>
                  <span className="ml-auto font-semibold text-white">{v}</span>
                </div>
              ))}
              {sources.length === 0 && <p className="text-xs text-faint">No leads yet.</p>}
            </div>
          </div>
          <div className="mt-5 border-t border-white/[0.07] pt-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-faint">Devices</p>
            <div className="mt-3 space-y-2.5">
              {[
                { label: "Mobile", v: devices.mobile, icon: Smartphone, color: "from-cyanx to-electric" },
                { label: "Desktop", v: devices.desktop, icon: Monitor, color: "from-violetx to-magentax" },
              ].map((d) => {
                const pct = visits.length ? Math.round((d.v / visits.length) * 100) : 0;
                return (
                  <div key={d.label}>
                    <div className="flex items-center justify-between text-[11px] text-mist">
                      <span className="flex items-center gap-1.5"><d.icon className="h-3.5 w-3.5" />{d.label}</span>
                      <span className="font-semibold text-white">{pct}%</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                      <div className={cn("h-full rounded-full bg-gradient-to-r", d.color)} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ACard>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        {/* recent leads */}
        <ACard className="lg:col-span-1">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-[15px] font-bold text-white">Recent leads</h3>
            <Link to="/admin/leads" className="text-[11px] font-semibold text-cyan-300 hover:text-white">View all →</Link>
          </div>
          <div className="mt-4 space-y-2.5">
            {leads.slice(0, 5).map((l) => (
              <div key={l.id} className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-electric/40 to-violetx/40 text-[10px] font-bold text-white">
                  {l.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] font-semibold text-white">{l.name}</p>
                  <p className="truncate text-[10px] text-faint">{l.service || l.source} · {timeAgo(l.createdAt)}</p>
                </div>
                {!l.read && <span className="h-2 w-2 rounded-full bg-cyan-400" />}
              </div>
            ))}
            {leads.length === 0 && <p className="py-6 text-center text-xs text-faint">No leads yet — share your site!</p>}
          </div>
        </ACard>

        {/* traffic sources + top pages */}
        <ACard>
          <h3 className="font-display text-[15px] font-bold text-white">Traffic sources & top pages</h3>
          <div className="mt-4 space-y-2.5">
            {traffic.map(([s, v]) => {
              const pct = visits.length ? Math.round((v / visits.length) * 100) : 0;
              return (
                <div key={s}>
                  <div className="flex justify-between text-[11px] text-mist">
                    <span className="capitalize">{s}</span><span className="font-semibold text-white">{pct}%</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                    <div className="h-full rounded-full bg-gradient-to-r from-cyanx to-violetx" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 border-t border-white/[0.07] pt-3">
            {topPages.map(([p, v]) => (
              <div key={p} className="flex items-center justify-between py-1 text-[11px]">
                <span className="truncate font-mono text-mist">{p}</span>
                <span className="font-semibold text-white">{v}</span>
              </div>
            ))}
          </div>
        </ACard>

        {/* activity feed */}
        <ACard>
          <div className="flex items-center justify-between">
            <h3 className="font-display text-[15px] font-bold text-white">Recent activity</h3>
            <Link to="/admin/activity" className="text-[11px] font-semibold text-cyan-300 hover:text-white">Full log →</Link>
          </div>
          <div className="mt-4 space-y-3">
            {activity.slice(0, 6).map((a) => (
              <div key={a.id} className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-cyanx to-magentax" />
                <div>
                  <p className="text-[12px] font-medium text-white">{a.action} <span className="text-faint">— {a.user}</span></p>
                  <p className="text-[11px] text-faint">{a.detail}</p>
                  <p className="mt-0.5 text-[10px] text-faint/70">{timeAgo(a.t)} · {formatDate(a.t)}</p>
                </div>
              </div>
            ))}
            {activity.length === 0 && <p className="py-6 text-center text-xs text-faint">No activity yet.</p>}
          </div>
        </ACard>
      </div>
    </div>
  );
}
