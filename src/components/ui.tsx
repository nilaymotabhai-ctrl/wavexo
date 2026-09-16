import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, useMotionValue, useSpring, useTransform, useReducedMotion, AnimatePresence } from "framer-motion";
import {
  Search, Code2, MessageCircle, Store, Target, Compass, TrendingUp, MessagesSquare,
  Sparkles, BarChart3, Handshake, Map, Hammer, Rocket, Gauge, Layers, ShoppingCart,
  Building2, HeartPulse, GraduationCap, Cloud, MapPin, Briefcase, Shirt, Eye, Gem,
  ArrowRight, Star, ChevronDown, Check, AlertCircle, Loader2, LucideIcon,
} from "lucide-react";
import { cn } from "../utils/cn";
import { useCMS, waLink } from "../lib/store";

/* ---------------- icon map ---------------- */

const ICONS: Record<string, LucideIcon> = {
  search: Search, code: Code2, message: MessageCircle, store: Store, target: Target,
  compass: Compass, growth: TrendingUp, messages: MessagesSquare, sparkles: Sparkles,
  chart: BarChart3, handshake: Handshake, map: Map, build: Hammer, rocket: Rocket,
  gauge: Gauge, layers: Layers, cart: ShoppingCart, building: Building2, health: HeartPulse,
  education: GraduationCap, cloud: Cloud, pin: MapPin, briefcase: Briefcase, fashion: Shirt,
  eye: Eye, gem: Gem, star: Star, check: Check, arrow: ArrowRight,
};

export const ICON_OPTIONS = Object.keys(ICONS);

/* ---------------- accent system (static classes for Tailwind) ---------------- */

export const ACCENTS: Record<string, { grad: string; glow: string; text: string; border: string; solid: string }> = {
  cyan: { grad: "from-cyan-400 to-blue-600", glow: "bg-cyan-400/25", text: "text-cyan-300", border: "hover:border-cyan-400/40", solid: "bg-cyan-400" },
  blue: { grad: "from-blue-500 to-violet-600", glow: "bg-blue-500/25", text: "text-blue-300", border: "hover:border-blue-400/40", solid: "bg-blue-500" },
  emerald: { grad: "from-emerald-400 to-cyan-600", glow: "bg-emerald-400/25", text: "text-emerald-300", border: "hover:border-emerald-400/40", solid: "bg-emerald-500" },
  violet: { grad: "from-violet-500 to-fuchsia-500", glow: "bg-violet-500/25", text: "text-violet-300", border: "hover:border-violet-400/40", solid: "bg-violet-500" },
  magenta: { grad: "from-fuchsia-500 to-blue-600", glow: "bg-fuchsia-500/25", text: "text-fuchsia-300", border: "hover:border-fuchsia-400/40", solid: "bg-fuchsia-500" },
  amber: { grad: "from-amber-400 to-orange-600", glow: "bg-amber-400/25", text: "text-amber-300", border: "hover:border-amber-400/40", solid: "bg-amber-500" },
};
export const ACCENT_OPTIONS = Object.keys(ACCENTS);
export const accentOf = (key: string) => ACCENTS[key] || ACCENTS.cyan;

export function Icon({ name, className }: { name: string; className?: string }) {
  const Cmp = ICONS[name] || Sparkles;
  return <Cmp className={className} strokeWidth={1.8} />;
}

/* ---------------- logo ---------------- */

export function Logo({ size = "md", href = "/" }: { size?: "sm" | "md" | "lg"; href?: string }) {
  const { content } = useCMS();
  const dims = size === "lg" ? "h-11 w-11" : size === "sm" ? "h-8 w-8" : "h-9 w-9";
  return (
    <Link to={href} className="group flex items-center gap-2.5" aria-label="Wavexo home">
      <span className={cn("relative grid place-items-center rounded-xl bg-gradient-to-br from-cyanx via-electric to-violetx shadow-[0_8px_30px_-8px_rgba(37,99,235,0.7)] transition-transform duration-500 group-hover:rotate-6", dims)}>
        <svg viewBox="0 0 24 24" className="w-[58%] h-[58%]" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round">
          <path d="M2 14c2.5-6 4.5-6 7 0s4.5 6 7 0 3.5-5 6-2.5" />
        </svg>
      </span>
      <span className={cn("font-display font-700 tracking-tight text-white", size === "lg" ? "text-2xl" : "text-lg")}>
        {content.settings.siteName}<span className="text-gradient">.</span>
      </span>
    </Link>
  );
}

/* ---------------- buttons ---------------- */

export function GradientButton({
  children, href, to, onClick, variant = "primary", className, type,
}: {
  children: React.ReactNode; href?: string; to?: string; onClick?: () => void;
  variant?: "primary" | "ghost" | "whatsapp"; className?: string; type?: "button" | "submit";
}) {
  const base = "group relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyanx/70 focus-visible:ring-offset-2 focus-visible:ring-offset-space";
  const styles = {
    primary: "glow-btn bg-gradient-to-r from-electric via-violetx to-magentax bg-[length:160%_100%] bg-left hover:bg-right text-white",
    ghost: "glass-soft text-white hover:bg-white/10 hover:border-white/20",
    whatsapp: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-[0_10px_36px_-10px_rgba(16,185,129,0.7)] hover:shadow-[0_14px_44px_-8px_rgba(16,185,129,0.8)]",
  }[variant];
  const cls = cn(base, styles, className);
  if (to) return <Link to={to} className={cls}>{children}</Link>;
  if (href) return <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className={cls}>{children}</a>;
  return <button type={type || "button"} onClick={onClick} className={cls}>{children}</button>;
}

export function ArrowIcon() {
  return <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />;
}

/* WhatsApp brand icon (inline SVG — lucide has no brand icons) */
export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.89 1.22 3.09.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.11.57-.08 1.76-.72 2-1.41.25-.7.25-1.29.18-1.42-.08-.12-.28-.2-.57-.34M12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.85 9.85 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88a9.83 9.83 0 0 1 6.99 2.9 9.82 9.82 0 0 1 2.9 7c0 5.45-4.45 9.87-9.9 9.87m8.41-18.3A11.8 11.8 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.6 5.95L.05 24l6.3-1.65a11.9 11.9 0 0 0 5.7 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.16-3.48-8.41" />
    </svg>
  );
}

/* Social brand icons (inline SVG) */
const SOCIAL_PATHS: Record<string, string> = {
  facebook: "M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.49h-2.8V24C19.62 23.1 24 18.1 24 12.07",
  instagram: "M12 2.16c3.2 0 3.58.02 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.05 1.27.07 1.65.07 4.85s-.02 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.05-1.65.07-4.85.07s-3.58-.02-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9 3.72 3.72 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.18 15.58 2.16 15.2 2.16 12s.02-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.18 8.8 2.16 12 2.16M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.13 1.38A5.88 5.88 0 0 0 .63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.38 2.13.67.66 1.34 1.08 2.13 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.88 5.88 0 0 0 2.13-1.38 5.88 5.88 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.88 5.88 0 0 0-1.38-2.13A5.88 5.88 0 0 0 19.86.63C19.1.33 18.22.13 16.95.07 15.67.01 15.26 0 12 0m0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84M12 16a4 4 0 1 1 4-4 4 4 0 0 1-4 4m6.41-11.85a1.44 1.44 0 1 0 1.43 1.44 1.44 1.44 0 0 0-1.43-1.44",
  linkedin: "M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12M7.12 20.45H3.56V9h3.56zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.8 24 1.77 24h20.45C23.2 24 24 23.23 24 22.28V1.72C24 .77 23.2 0 22.22 0",
  twitter: "M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.66l7.73-8.84L1.25 2.25h6.83l4.71 6.23zm-1.16 17.52h1.83L7.08 4.13H5.12z",
  youtube: "M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81M9.55 15.57V8.43L15.82 12z",
};

export function SocialIcon({ name, className }: { name: keyof typeof SOCIAL_PATHS | string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d={SOCIAL_PATHS[name] || SOCIAL_PATHS.facebook} />
    </svg>
  );
}

export function WhatsAppCta({ label = "Chat on WhatsApp", className }: { label?: string; className?: string }) {
  const { content } = useCMS();
  const n = content.settings.whatsapp;
  if (!n) return null;
  return (
    <GradientButton variant="whatsapp" className={className}
      href={waLink(n, "Hi Wavexo! I'd like to discuss a project.")}>
      <WhatsAppIcon className="h-4 w-4" /> {label}
    </GradientButton>
  );
}

/* ---------------- section heading ---------------- */

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-mist">
      <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-cyanx to-magentax animate-pulse" />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow, title, sub, center = true, className,
}: { eyebrow?: string; title: React.ReactNode; sub?: string; center?: boolean; className?: string }) {
  return (
    <div className={cn("max-w-3xl", center && "mx-auto text-center", className)}>
      {eyebrow && (
        <Reveal><Eyebrow>{eyebrow}</Eyebrow></Reveal>
      )}
      <Reveal delay={0.08}>
        <h2 className="font-display mt-5 text-3xl font-bold leading-[1.12] tracking-tight text-white sm:text-4xl lg:text-[44px]">
          {title}
        </h2>
      </Reveal>
      {sub && (
        <Reveal delay={0.16}>
          <p className="mt-5 text-base leading-relaxed text-mist sm:text-lg">{sub}</p>
        </Reveal>
      )}
    </div>
  );
}

/* ---------------- reveal / stagger ---------------- */

export function Reveal({
  children, delay = 0, y = 28, className, once = true,
}: { children: React.ReactNode; delay?: number; y?: number; className?: string; once?: boolean }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({ children, className, step = 0.08 }: { children: React.ReactNode; className?: string; step?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: step } } }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={{ hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }}
    >
      {children}
    </motion.div>
  );
}

/* ---------------- count up ---------------- */

export function CountUp({ value, suffix = "", prefix = "", className }: { value: number; suffix?: string; prefix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reduce) { setDisplay(value); return; }
    const start = performance.now();
    const dur = 1600;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 4);
      setDisplay(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, reduce]);
  return <span ref={ref} className={className}>{prefix}{display.toLocaleString()}{suffix}</span>;
}

/* ---------------- magnetic ---------------- */

export function Magnetic({ children, strength = 0.3 }: { children: React.ReactNode; strength?: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 16 });
  const sy = useSpring(y, { stiffness: 200, damping: 16 });
  if (reduce) return <>{children}</>;
  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy, display: "inline-block" }}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        x.set((e.clientX - r.left - r.width / 2) * strength);
        y.set((e.clientY - r.top - r.height / 2) * strength);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
    >
      {children}
    </motion.div>
  );
}

/* ---------------- tilt card ---------------- */

export function Tilt({ children, className, max = 7 }: { children: React.ReactNode; className?: string; max?: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 180, damping: 18 });
  const sry = useSpring(ry, { stiffness: 180, damping: 18 });
  const transform = useTransform([srx, sry], ([a, b]) => `perspective(900px) rotateX(${a}deg) rotateY(${b}deg)`);
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ transform, transformStyle: "preserve-3d" }}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        ry.set(((e.clientX - r.left) / r.width - 0.5) * max);
        rx.set(-((e.clientY - r.top) / r.height - 0.5) * max);
      }}
      onMouseLeave={() => { rx.set(0); ry.set(0); }}
    >
      {children}
    </motion.div>
  );
}

/* ---------------- marquee ---------------- */

export function Marquee({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("marquee-paused mask-fade-x overflow-hidden", className)}>
      <div className="animate-marquee flex w-max items-center gap-14 pr-14">
        {children}
        {children}
      </div>
    </div>
  );
}

/* ---------------- accordion ---------------- */

export function Accordion({ items }: { items: { id: string; q: string; a: string }[] }) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);
  return (
    <div className="space-y-3">
      {items.map((item) => {
        const isOpen = open === item.id;
        return (
          <div key={item.id} className={cn("glass-soft overflow-hidden rounded-2xl transition-colors duration-300", isOpen && "border-violetx/40 bg-white/[0.06]")}>
            <button
              onClick={() => setOpen(isOpen ? null : item.id)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-cyanx/60 focus-visible:ring-inset"
            >
              <span className={cn("text-[15px] font-semibold transition-colors", isOpen ? "text-white" : "text-white/85")}>{item.q}</span>
              <span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 transition-transform duration-300", isOpen && "rotate-180 border-violetx/50 bg-violetx/20")}>
                <ChevronDown className="h-4 w-4 text-mist" />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="px-6 pb-6 text-[15px] leading-relaxed text-mist">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

/* ---------------- forms ---------------- */

export function Field({ label, error, children, optional }: { label: string; error?: string; optional?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between text-[13px] font-medium text-white/80">
        {label}
        {optional && <span className="text-[11px] text-faint">Optional</span>}
      </span>
      {children}
      <AnimatePresence>
        {error && (
          <motion.span initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mt-1.5 flex items-center gap-1 text-xs text-rose-400">
            <AlertCircle className="h-3 w-3" /> {error}
          </motion.span>
        )}
      </AnimatePresence>
    </label>
  );
}

export const inputCls =
  "w-full rounded-xl border border-white/10 bg-white/[0.045] px-4 py-3 text-sm text-white placeholder:text-faint transition-all duration-300 focus:border-cyanx/60 focus:bg-white/[0.07] focus:outline-none focus:ring-4 focus:ring-cyanx/10";

export function SubmitButton({ loading, children }: { loading: boolean; children: React.ReactNode }) {
  return (
    <button type="submit" disabled={loading}
      className="glow-btn group relative inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-electric via-violetx to-magentax bg-[length:160%_100%] bg-left px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-right disabled:opacity-60">
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {children}
      {!loading && <ArrowIcon />}
    </button>
  );
}

export function FormSuccess({ title, message }: { title: string; message: string }) {
  const { content } = useCMS();
  return (
    <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center rounded-3xl border border-emerald-400/25 bg-emerald-400/[0.06] px-8 py-12 text-center">
      <motion.span
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.15, type: "spring", stiffness: 220, damping: 14 }}
        className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 shadow-[0_12px_40px_-10px_rgba(16,185,129,0.8)]">
        <Check className="h-8 w-8 text-white" strokeWidth={2.5} />
      </motion.span>
      <h3 className="font-display mt-6 text-2xl font-bold text-white">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-mist">{message}</p>
      {content.settings.whatsapp && (
        <a href={waLink(content.settings.whatsapp, "Hi Wavexo! I just submitted a form on your website.")}
          target="_blank" rel="noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-5 py-2.5 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-400/20">
          <WhatsAppIcon className="h-4 w-4" /> Continue on WhatsApp
        </a>
      )}
    </motion.div>
  );
}

/* honeypot spam trap — invisible to humans */
export function HoneyPot({ onChange }: { onChange: (v: string) => void }) {
  return (
    <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true"
      onChange={(e) => onChange(e.target.value)}
      className="pointer-events-none absolute -left-[9999px] h-0 w-0 opacity-0" name="company_website_fax" />
  );
}

/* ---------------- empty state ---------------- */

export function EmptyState({ icon = "sparkles", title, sub }: { icon?: string; title: string; sub: string }) {
  return (
    <div className="glass-soft mx-auto max-w-lg rounded-3xl px-8 py-14 text-center">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-electric/30 to-violetx/30 text-cyan-300">
        <Icon name={icon} className="h-6 w-6" />
      </span>
      <h3 className="font-display mt-5 text-xl font-bold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-mist">{sub}</p>
    </div>
  );
}

/* ---------------- misc ---------------- */

export function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-1" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={cn("h-4 w-4", i < n ? "fill-amber-400 text-amber-400" : "text-white/20")} />
      ))}
    </div>
  );
}

export function GlowOrb({ className }: { className?: string }) {
  return <div aria-hidden className={cn("pointer-events-none absolute rounded-full blur-[110px]", className)} />;
}

export { cn };
