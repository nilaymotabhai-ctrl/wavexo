import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, Clock, SendHorizontal, Check, ShieldCheck } from "lucide-react";
import { useCMS, publishedSorted, waLink } from "../lib/store";
import { Logo, WhatsAppIcon, SocialIcon, inputCls } from "./ui";

const socialIcons = [
  { key: "facebook", label: "Facebook" },
  { key: "instagram", label: "Instagram" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "twitter", label: "X / Twitter" },
  { key: "youtube", label: "YouTube" },
] as const;

export default function Footer() {
  const { content, addLead } = useCMS();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  const s = content.settings;
  const services = publishedSorted(content.services);

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setErr("Enter a valid email address"); return; }
    addLead({ name: "Newsletter Subscriber", email, phone: "", source: "newsletter", message: "Subscribed via footer" });
    setDone(true);
    setEmail("");
    setTimeout(() => setDone(false), 4000);
  };

  return (
    <footer className="relative mt-28 overflow-hidden border-t border-white/[0.07] bg-[#050814]">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[42rem] -translate-x-1/2 rounded-full bg-violetx/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
          {/* brand */}
          <div>
            <Logo size="lg" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-mist">{s.footerText}</p>
            <div className="mt-6 flex gap-2.5">
              {socialIcons.map(({ key, label }) =>
                s.socials[key] ? (
                  <a key={key} href={s.socials[key]} target="_blank" rel="noreferrer" aria-label={label}
                    className="glass-soft grid h-10 w-10 place-items-center rounded-xl text-mist transition-all duration-300 hover:-translate-y-1 hover:border-violetx/50 hover:text-white">
                    <SocialIcon name={key} className="h-4 w-4" />
                  </a>
                ) : null
              )}
              {s.whatsapp && (
                <a href={waLink(s.whatsapp)} target="_blank" rel="noreferrer" aria-label="WhatsApp"
                  className="glass-soft grid h-10 w-10 place-items-center rounded-xl text-mist transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/50 hover:text-emerald-300">
                  <WhatsAppIcon className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* services */}
          <nav aria-label="Services">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-faint">Services</h4>
            <ul className="mt-5 space-y-3">
              {services.map((sv) => (
                <li key={sv.id}>
                  <Link to={`/services/${sv.slug}`} className="text-sm text-mist transition-colors hover:text-white">{sv.title}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* company */}
          <nav aria-label="Company">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-faint">Company</h4>
            <ul className="mt-5 space-y-3">
              {[
                ["/about", "About Us"], ["/work", "Our Work"], ["/process", "Our Process"],
                ["/pricing", "Pricing"], ["/blog", "Blog & Resources"], ["/faqs", "FAQs"],
                ["/book", "Book Consultation"], ["/contact", "Contact"],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-mist transition-colors hover:text-white">{label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* contact + newsletter */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-faint">Get in touch</h4>
            <ul className="mt-5 space-y-3 text-sm text-mist">
              <li><a href={`mailto:${s.email}`} className="flex items-center gap-2.5 transition-colors hover:text-white"><Mail className="h-4 w-4 shrink-0 text-cyan-400" />{s.email}</a></li>
              <li><a href={`tel:${s.phone.replace(/\s/g, "")}`} className="flex items-center gap-2.5 transition-colors hover:text-white"><Phone className="h-4 w-4 shrink-0 text-cyan-400" />{s.phone}</a></li>
              <li className="flex items-start gap-2.5"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />{s.address}</li>
              <li className="flex items-center gap-2.5"><Clock className="h-4 w-4 shrink-0 text-cyan-400" />{s.hours}</li>
            </ul>

            <form onSubmit={subscribe} className="mt-6" noValidate>
              <label className="text-xs font-medium text-white/80">Growth tips in your inbox</label>
              <div className="mt-2 flex gap-2">
                <input value={email} onChange={(e) => { setEmail(e.target.value); setErr(""); }}
                  type="email" placeholder="you@company.com" aria-label="Email for newsletter"
                  className={inputCls + " !rounded-full !py-2.5 text-[13px]"} />
                <button type="submit" aria-label="Subscribe"
                  className="grid h-10 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-r from-electric to-violetx text-white transition hover:opacity-90">
                  {done ? <Check className="h-4 w-4" /> : <SendHorizontal className="h-4 w-4" />}
                </button>
              </div>
              <AnimatePresence>
                {err && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-1.5 text-xs text-rose-400">{err}</motion.p>}
                {done && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-1.5 text-xs text-emerald-400">You're in. Welcome aboard!</motion.p>}
              </AnimatePresence>
            </form>
          </div>
        </div>

        {/* bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/[0.07] pt-7 sm:flex-row">
          <p className="text-xs text-faint">© {new Date().getFullYear()} {s.siteName}. {s.tagline}</p>
          <div className="flex items-center gap-5 text-xs text-faint">
            <Link to="/privacy" className="transition-colors hover:text-white">Privacy Policy</Link>
            <Link to="/terms" className="transition-colors hover:text-white">Terms</Link>
            <Link to="/refund" className="transition-colors hover:text-white">Refunds</Link>
            <Link to="/admin" className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1 transition-colors hover:border-violetx/50 hover:text-white">
              <ShieldCheck className="h-3 w-3" /> Admin
            </Link>
          </div>
        </div>
      </div>

      {/* watermark */}
      <div aria-hidden className="pointer-events-none select-none overflow-hidden pb-2">
        <p className="font-display bg-gradient-to-b from-white/[0.045] to-transparent bg-clip-text text-center text-[19vw] font-bold leading-[0.85] tracking-tighter text-transparent">
          WAVEXO
        </p>
      </div>
    </footer>
  );
}
