import { useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Sparkles, ArrowLeft, KeyRound, Info } from "lucide-react";
import { useCMS } from "../lib/store";
import { SUPABASE_READY } from "../lib/supabase";
import { Logo } from "../components/ui";
import { AButton, aInput } from "./ui";

export default function AdminLogin() {
  const { user, authReady, login, resetPassword, content } = useCMS();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  if (authReady && user) return <Navigate to="/admin" replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setNotice(""); setBusy(true);
    if (mode === "login") {
      const r = await login(email, password);
      setBusy(false);
      if (r.ok) navigate("/admin");
      else setError(r.error || "Login failed");
    } else {
      const r = await resetPassword(email);
      setBusy(false);
      if (r.ok) setNotice("Password reset email sent — check your inbox and follow the link.");
      else setError(r.error || "Could not send reset email");
    }
  };

  return (
    <div className="grid min-h-screen bg-space lg:grid-cols-2">
      {/* brand panel */}
      <div className="relative hidden overflow-hidden lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_30%_20%,#16235f_0%,#070b1a_65%)]" />
        <div className="bg-grid absolute inset-0" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-96 w-96 rounded-full bg-violetx/25 blur-[130px]" />
        <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-cyanx/20 blur-[120px]" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Logo size="lg" />
          <div>
            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="font-display max-w-md text-4xl font-bold leading-[1.12] tracking-tight text-white xl:text-5xl">
              Command center for your <span className="text-gradient">entire website</span>.
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="mt-5 max-w-md text-[15px] leading-relaxed text-mist">
              Secured by Supabase Auth. Every change syncs to Postgres and appears on the live site — and every other device — instantly.
            </motion.p>
            <motion.ul initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8 space-y-3">
              {["Full CMS for every page & section", "Lead CRM with pipeline statuses", "Media library backed by cloud storage", "Row-level security on every table"].map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-white/85">
                  <Sparkles className="h-4 w-4 text-cyan-300" /> {f}
                </li>
              ))}
            </motion.ul>
          </div>
          <p className="flex items-center gap-2 text-xs text-faint"><ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Supabase Auth · RLS protected · Realtime sync</p>
        </div>
      </div>

      {/* form panel */}
      <div className="relative flex items-center justify-center px-5 py-12">
        <div className="pointer-events-none absolute left-1/2 top-1/4 h-72 w-72 -translate-x-1/2 rounded-full bg-electric/10 blur-[120px] lg:hidden" />
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md">
          <div className="mb-8 lg:hidden"><Logo size="lg" href="/" /></div>
          <div className="g-border rounded-[28px] bg-midnight/60 p-8 backdrop-blur sm:p-10">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-electric to-violetx text-white shadow-lg">
              {mode === "login" ? <ShieldCheck className="h-5 w-5" /> : <KeyRound className="h-5 w-5" />}
            </span>
            <h1 className="font-display mt-5 text-2xl font-bold text-white">{mode === "login" ? "Welcome back" : "Reset password"}</h1>
            <p className="mt-1.5 text-sm text-mist">
              {mode === "login" ? `Sign in to manage ${content.settings.siteName}.` : "We'll email you a secure password-reset link."}
            </p>

            {!SUPABASE_READY && (
              <p className="mt-4 flex items-start gap-2 rounded-xl border border-amber-400/25 bg-amber-400/10 px-4 py-3 text-xs leading-relaxed text-amber-300">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                Supabase env vars are missing. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env / Vercel environment.
              </p>
            )}

            <form onSubmit={submit} className="mt-8 space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-[13px] font-medium text-white/75">Email address</span>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
                  <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required
                    placeholder="you@wavexo.agency" className={aInput + " !pl-10"} />
                </div>
              </label>

              {mode === "login" && (
                <label className="block">
                  <span className="mb-1.5 block text-[13px] font-medium text-white/75">Password</span>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
                    <input value={password} onChange={(e) => setPassword(e.target.value)} type={show ? "text" : "password"} required
                      placeholder="••••••••" className={aInput + " !pl-10 !pr-11"} />
                    <button type="button" onClick={() => setShow(!show)} aria-label="Toggle password visibility"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-faint transition hover:text-white">
                      {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </label>
              )}

              {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-rose-400/25 bg-rose-500/10 px-4 py-2.5 text-xs text-rose-300">{error}</motion.p>}
              {notice && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-emerald-400/25 bg-emerald-400/10 px-4 py-2.5 text-xs text-emerald-300">{notice}</motion.p>}

              <AButton type="submit" disabled={busy} className="w-full !py-3">
                {busy ? "Please wait…" : mode === "login" ? "Sign in securely" : "Send reset link"}
              </AButton>
            </form>

            <button onClick={() => { setMode(mode === "login" ? "forgot" : "login"); setError(""); setNotice(""); }}
              className="mt-5 w-full text-center text-xs font-semibold text-cyan-300 transition hover:text-white">
              {mode === "login" ? "Forgot your password?" : "← Back to sign in"}
            </button>
          </div>

          <div className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">First-time setup</p>
            <p className="mt-2 text-[12px] leading-relaxed text-mist">
              Create your admin account in <b className="text-white">Supabase Dashboard → Authentication → Users → Add user</b> (enable "Auto Confirm User"), then sign in with that email and password. Public signups should stay disabled.
            </p>
          </div>

          <Link to="/" className="mt-6 inline-flex items-center gap-2 text-xs font-medium text-faint transition hover:text-white">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to website
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
