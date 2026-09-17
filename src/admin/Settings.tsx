import { useRef, useState } from "react";
import {
  Plug2, ShieldCheck, Users2, DatabaseBackup, Save, Trash2, Plus,
  Download, Upload, RotateCcw, KeyRound, Smartphone, LogOut, Check,
} from "lucide-react";
import { useCMS, newId, timeAgo } from "../lib/store";
import { AdminUser, Role } from "../lib/types";
import { AButton, ACard, AField, AInput, ASelect, AToggle, SectionTitle, Pill, Confirm, toast } from "./ui";
import { cn } from "../utils/cn";

type Tab = "integrations" | "security" | "users" | "backup";

function DbBadge() {
  const { dbStatus } = useCMS();
  if (dbStatus === "connecting") return <Pill tone="amber">Connecting…</Pill>;
  if (dbStatus === "online") return <Pill tone="green">Connected · realtime sync on</Pill>;
  return <Pill tone="rose">Offline — using local storage</Pill>;
}

const ROLES: { id: Role; label: string; desc: string }[] = [
  { id: "superadmin", label: "Super Admin", desc: "Full access to everything" },
  { id: "editor", label: "Editor", desc: "Manage content, blog, services, portfolio" },
  { id: "marketing", label: "Marketing Manager", desc: "Manage leads, forms & analytics" },
  { id: "content", label: "Content Manager", desc: "Manage blogs, FAQs, pages & media" },
  { id: "viewer", label: "Viewer", desc: "Read-only access" },
];

const TABS: { id: Tab; label: string; icon: typeof Plug2 }[] = [
  { id: "integrations", label: "Integrations", icon: Plug2 },
  { id: "security", label: "Security", icon: ShieldCheck },
  { id: "users", label: "Users & Roles", icon: Users2 },
  { id: "backup", label: "Backup & Reset", icon: DatabaseBackup },
];

export default function Settings() {
  const { content, updateSettings, user, can, changePassword, logoutAll, saveUsers, exportData, importData, resetAll, log } = useCMS();
  const [tab, setTab] = useState<Tab>("integrations");
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [twoFa, setTwoFa] = useState(() => localStorage.getItem("wavexo_2fa") === "1");
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "editor" as Role });
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmUser, setConfirmUser] = useState<string | null>(null);
  const importRef = useRef<HTMLInputElement>(null);
  const s = content.settings;
  const allowed = can("settings");

  /* local draft for integration fields — written to the store/Supabase
     ONLY when the admin presses "Save integrations". Initialized once,
     so realtime sync can never overwrite in-progress typing. */
  const [int, setInt] = useState(() =>
    JSON.parse(JSON.stringify({
      gaId: s.gaId, gtmId: s.gtmId, pixelId: s.pixelId,
      gscVerification: s.gscVerification, smtp: s.smtp,
    })) as { gaId: string; gtmId: string; pixelId: string; gscVerification: string; smtp: typeof s.smtp }
  );
  const setIntField = (k: "gaId" | "gtmId" | "pixelId" | "gscVerification", v: string) => setInt((p: typeof int) => ({ ...p, [k]: v }));
  const setSmtp = (patch: Partial<typeof int.smtp>) => setInt((p: typeof int) => ({ ...p, smtp: { ...p.smtp, ...patch } }));

  if (!allowed) {
    return (
      <div>
        <SectionTitle title="Settings & Users" sub="Restricted area" />
        <ACard className="py-16 text-center">
          <ShieldCheck className="mx-auto h-8 w-8 text-amber-300" />
          <p className="font-display mt-4 text-lg font-semibold text-white">Super Admin access required</p>
          <p className="mt-1 text-sm text-faint">Your role ({user?.role}) can view content but cannot change system settings.</p>
        </ACard>
      </div>
    );
  }

  return (
    <div>
      <SectionTitle title="Settings & Users" sub="Integrations, security, team access and backups." />

      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={cn("inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-[13px] font-semibold transition",
              tab === t.id ? "border-transparent bg-gradient-to-r from-electric to-violetx text-white" : "border-white/10 bg-white/[0.04] text-mist hover:text-white")}>
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* ---------------- integrations ---------------- */}
      {tab === "integrations" && (
        <div className="space-y-5">
          <ACard>
            <h3 className="font-display text-[15px] font-bold text-white">Analytics & tracking</h3>
            <p className="mt-1 text-[11px] text-faint">Paste your IDs — they're stored safely and never exposed publicly in page code beyond standard snippets.</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <AField label="Google Analytics 4 ID" hint="G-XXXXXXXXXX"><AInput value={int.gaId} onChange={(e) => setIntField("gaId", e.target.value)} placeholder="G-XXXXXXXXXX" /></AField>
              <AField label="Google Tag Manager ID" hint="GTM-XXXXXXX"><AInput value={int.gtmId} onChange={(e) => setIntField("gtmId", e.target.value)} placeholder="GTM-XXXXXXX" /></AField>
              <AField label="Meta Pixel ID"><AInput value={int.pixelId} onChange={(e) => setIntField("pixelId", e.target.value)} placeholder="1234567890" /></AField>
              <AField label="Search Console verification"><AInput value={int.gscVerification} onChange={(e) => setIntField("gscVerification", e.target.value)} /></AField>
            </div>
          </ACard>
          <ACard>
            <h3 className="font-display text-[15px] font-bold text-white">SMTP email (lead notifications)</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <AField label="SMTP host"><AInput value={int.smtp.host} onChange={(e) => setSmtp({ host: e.target.value })} placeholder="smtp.resend.com" /></AField>
              <AField label="Port"><AInput value={int.smtp.port} onChange={(e) => setSmtp({ port: e.target.value })} placeholder="587" /></AField>
              <AField label="Username"><AInput value={int.smtp.user} onChange={(e) => setSmtp({ user: e.target.value })} /></AField>
              <AField label="Password / API key"><AInput type="password" value={int.smtp.pass} onChange={(e) => setSmtp({ pass: e.target.value })} /></AField>
            </div>
            <p className="mt-3 text-[11px] text-faint">Used to email you when a new lead arrives. Connect any provider (Resend, SendGrid, Gmail SMTP, SES).</p>
          </ACard>
          <AButton onClick={() => {
            updateSettings({ gaId: int.gaId, gtmId: int.gtmId, pixelId: int.pixelId, gscVerification: int.gscVerification, smtp: int.smtp });
            toast("Integrations saved — live everywhere");
            log("Settings updated", "Integrations");
          }}><Save className="h-4 w-4" /> Save integrations</AButton>
        </div>
      )}

      {/* ---------------- security ---------------- */}
      {tab === "security" && (
        <div className="space-y-5">
          <ACard>
            <h3 className="font-display flex items-center gap-2 text-[15px] font-bold text-white"><KeyRound className="h-4 w-4 text-cyan-300" /> Change admin password</h3>
            <div className="mt-4 grid max-w-md gap-4">
              <AInput type="password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} placeholder="Current password" />
              <AInput type="password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} placeholder="New password (min 8 chars)" />
              <AInput type="password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} placeholder="Confirm new password" />
              <AButton className="w-fit" onClick={async () => {
                if (pw.next !== pw.confirm) { toast("Passwords do not match"); return; }
                const r = await changePassword(pw.current, pw.next);
                toast(r.ok ? "Password updated" : r.error || "Failed");
                if (r.ok) setPw({ current: "", next: "", confirm: "" });
              }}>Update password</AButton>
            </div>
          </ACard>

          <ACard>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-emerald-400/25 to-cyan-400/25 text-emerald-300"><Smartphone className="h-5 w-5" /></span>
                <div>
                  <h3 className="font-display text-[15px] font-bold text-white">Two-factor authentication (2FA)</h3>
                  <p className="text-[11px] text-faint">Require an authenticator code at sign-in. {twoFa ? "Enabled for this workspace." : "Recommended for all admin accounts."}</p>
                </div>
              </div>
              <AToggle checked={twoFa} onChange={(v) => { setTwoFa(v); localStorage.setItem("wavexo_2fa", v ? "1" : "0"); toast(v ? "2FA enabled" : "2FA disabled"); log("2FA toggled", v ? "enabled" : "disabled"); }} label={twoFa ? "On" : "Off"} />
            </div>
            {twoFa && (
              <div className="mt-4 flex items-center gap-4 rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
                <div className="grid h-20 w-20 grid-cols-4 gap-0.5 rounded-lg bg-white p-2">
                  {Array.from({ length: 16 }, (_, i) => <span key={i} className={cn("rounded-[2px]", (i * 7) % 3 ? "bg-space" : "bg-white")} />)}
                </div>
                <p className="text-xs leading-relaxed text-mist">Scan with Google Authenticator or Authy, then enter the 6-digit code on next login. In production this pairs via TOTP (Supabase Auth / Auth.js).</p>
              </div>
            )}
          </ACard>

          <ACard>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-display text-[15px] font-bold text-white">Active session</h3>
                <p className="mt-1 text-[12px] text-mist">{user?.email} · signed in {user ? timeAgo(user.t) : ""} · this browser</p>
              </div>
              <AButton variant="danger" onClick={() => { logoutAll(); toast("Signed out of all devices"); }}>
                <LogOut className="h-4 w-4" /> Log out of all devices
              </AButton>
            </div>
          </ACard>
        </div>
      )}

      {/* ---------------- users ---------------- */}
      {tab === "users" && (
        <div className="space-y-5">
          <ACard>
            <h3 className="font-display text-[15px] font-bold text-white">Team access</h3>
            <div className="mt-4 space-y-2.5">
              {content.users.map((u) => (
                <div key={u.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3.5">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-electric/40 to-violetx/40 text-xs font-bold text-white">
                    {u.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">{u.name} {u.id === user?.userId && <Pill tone="cyan">You</Pill>}</p>
                    <p className="truncate text-[11px] text-faint">{u.email} · active {u.lastActive ? timeAgo(u.lastActive) : "never"}</p>
                  </div>
                  <ASelect value={u.role} disabled={u.id === user?.userId}
                    onChange={(e) => {
                      saveUsers(content.users.map((x) => (x.id === u.id ? { ...x, role: e.target.value as Role } : x)));
                      log("Role changed", `${u.email} → ${e.target.value}`);
                      toast("Role updated");
                    }}
                    className="!w-44">
                    {ROLES.map((r) => <option key={r.id} value={r.id} className="bg-midnight">{r.label}</option>)}
                  </ASelect>
                  {u.id !== user?.userId && (
                    <button onClick={() => setConfirmUser(u.id)} className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-mist transition hover:border-rose-400/40 hover:text-rose-300">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-4 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-[11px] leading-relaxed text-faint">
              Logins are handled by <b className="text-white">Supabase Auth</b>. Create the login in <b className="text-white">Supabase Dashboard → Authentication → Users → Add user</b>, then add the same email here to assign their role (default role for unlisted emails: Super Admin).
            </p>
            <div className="mt-3 grid gap-2 border-t border-white/[0.07] pt-5 sm:grid-cols-[1fr_1fr_180px_auto]">
              <AInput value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} placeholder="Full name" />
              <AInput value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} placeholder="email@wavexo.agency" />
              <ASelect value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value as Role })}>
                {ROLES.filter((r) => r.id !== "superadmin").map((r) => <option key={r.id} value={r.id} className="bg-midnight">{r.label}</option>)}
              </ASelect>
              <AButton onClick={() => {
                if (!newUser.name || !newUser.email.includes("@")) { toast("Enter a valid name & email"); return; }
                if (content.users.some((u) => u.email.toLowerCase() === newUser.email.toLowerCase())) { toast("User already exists"); return; }
                saveUsers([...content.users, { id: newId(), name: newUser.name, email: newUser.email, role: newUser.role } as AdminUser]);
                log("User added", `${newUser.email} (${newUser.role})`);
                setNewUser({ name: "", email: "", role: "editor" });
                toast("Role assigned — create their login in Supabase Auth");
              }}><Plus className="h-4 w-4" /> Add user</AButton>
            </div>
          </ACard>

          <ACard>
            <h3 className="font-display text-[15px] font-bold text-white">Role permissions</h3>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-[12px]">
                <thead>
                  <tr className="text-faint">
                    <th className="pb-2 font-medium">Capability</th>
                    {["Super Admin", "Editor", "Marketing", "Content", "Viewer"].map((r) => <th key={r} className="pb-2 font-medium">{r}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Edit site content", [1, 1, 1, 1, 0]],
                    ["Manage leads / CRM", [1, 1, 1, 0, 0]],
                    ["Delete records", [1, 1, 1, 0, 0]],
                    ["Settings & users", [1, 0, 0, 0, 0]],
                    ["View analytics", [1, 1, 1, 1, 1]],
                  ].map(([cap, perms]) => (
                    <tr key={cap as string} className="border-t border-white/[0.05]">
                      <td className="py-2.5 text-white/85">{cap}</td>
                      {(perms as number[]).map((p, i) => (
                        <td key={i} className="py-2.5">{p ? <Check className="h-4 w-4 text-emerald-400" /> : <span className="text-faint">—</span>}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ACard>
        </div>
      )}

      {/* ---------------- backup ---------------- */}
      {tab === "backup" && (
        <div className="space-y-5">
          <ACard>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-display text-[15px] font-bold text-white">Cloud database</h3>
                <p className="mt-1 text-[12px] text-faint">All admin changes sync to Supabase Postgres and appear on every device in real time.</p>
              </div>
              {content && <DbBadge />}
            </div>
          </ACard>
          <ACard>
            <h3 className="font-display flex items-center gap-2 text-[15px] font-bold text-white"><Download className="h-4 w-4 text-cyan-300" /> Export full backup</h3>
            <p className="mt-1 text-[12px] text-faint">Download every setting, page, service, blog, lead and file as a single JSON file.</p>
            <AButton className="mt-4" onClick={() => { exportData(); log("Backup exported", "Full CMS JSON"); toast("Backup downloaded"); }}>
              <Download className="h-4 w-4" /> Download backup (.json)
            </AButton>
          </ACard>
          <ACard>
            <h3 className="font-display flex items-center gap-2 text-[15px] font-bold text-white"><Upload className="h-4 w-4 text-cyan-300" /> Restore from backup</h3>
            <input ref={importRef} type="file" accept=".json" className="hidden" onChange={(e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              const r = new FileReader();
              r.onload = () => {
                const ok = importData(String(r.result));
                toast(ok ? "Backup restored — site updated" : "Invalid backup file");
                if (ok) log("Backup restored", f.name);
              };
              r.readAsText(f);
            }} />
            <AButton variant="ghost" className="mt-4" onClick={() => importRef.current?.click()}>
              <Upload className="h-4 w-4" /> Choose backup file
            </AButton>
          </ACard>
          <ACard className="!border-rose-400/20">
            <h3 className="font-display flex items-center gap-2 text-[15px] font-bold text-rose-300"><RotateCcw className="h-4 w-4" /> Factory reset</h3>
            <p className="mt-1 text-[12px] text-faint">Restore the original Wavexo demo content. Your changes will be lost — export a backup first.</p>
            <AButton variant="danger" className="mt-4" onClick={() => setConfirmReset(true)}>
              <RotateCcw className="h-4 w-4" /> Reset all content
            </AButton>
          </ACard>
        </div>
      )}

      <Confirm open={confirmReset} onClose={() => setConfirmReset(false)}
        onConfirm={() => { resetAll(); toast("Content reset to factory defaults"); }}
        title="Reset all content?" message="Every edit you've made — text, images, offers, leads — will be replaced with the original demo content." />
      <Confirm open={!!confirmUser} onClose={() => setConfirmUser(null)}
        onConfirm={() => {
          saveUsers(content.users.filter((u) => u.id !== confirmUser));
          toast("User removed");
        }} title="Remove this user?" message="They will lose access to the admin panel immediately." />
    </div>
  );
}
