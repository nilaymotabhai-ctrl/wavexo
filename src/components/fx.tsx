import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { ArrowUp, Cookie, X } from "lucide-react";
import { WhatsAppIcon, cn } from "./ui";
import { useCMS, waLink } from "../lib/store";

/* ---------------- cursor glow (desktop only) ---------------- */

export function CursorGlow() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const x = useMotionValue(-600);
  const y = useMotionValue(-600);
  const sx = useSpring(x, { stiffness: 120, damping: 24, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 120, damping: 24, mass: 0.6 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine || reduce) return;
    setEnabled(true);
    const move = (e: MouseEvent) => { x.set(e.clientX - 260); y.set(e.clientY - 260); };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [x, y, reduce]);

  if (!enabled) return null;
  return (
    <motion.div aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[3] h-[520px] w-[520px] rounded-full opacity-[0.13] mix-blend-screen"
      style={{
        x: sx, y: sy,
        background: "radial-gradient(circle, rgba(6,182,212,0.9) 0%, rgba(37,99,235,0.55) 35%, rgba(124,58,237,0.35) 55%, transparent 70%)",
      }}
    />
  );
}

/* ---------------- floating whatsapp ---------------- */

export function FloatingWhatsApp() {
  const { content } = useCMS();
  const n = content.settings.whatsapp;
  if (!n) return null;
  return (
    <motion.a
      href={waLink(n, "Hi Wavexo! I'd like to discuss growing my business.")}
      target="_blank" rel="noreferrer" aria-label="Chat with Wavexo on WhatsApp"
      initial={{ opacity: 0, scale: 0, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1.4, type: "spring", stiffness: 200, damping: 16 }}
      className="group fixed bottom-6 right-6 z-40 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-[0_12px_40px_-8px_rgba(16,185,129,0.75)] transition-transform duration-300 hover:scale-110"
    >
      <span className="animate-pulse-ring absolute inset-0 rounded-full" />
      <WhatsAppIcon className="h-6 w-6" />
      <span className="pointer-events-none absolute right-[68px] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-white/10 bg-midnight/90 px-4 py-2 text-xs font-medium text-white opacity-0 shadow-xl backdrop-blur transition-all duration-300 group-hover:opacity-100">
        Chat with us — usually replies in minutes
      </span>
    </motion.a>
  );
}

/* ---------------- scroll to top ---------------- */

export function ScrollTopButton() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 640);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.6, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 10 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll to top"
          className="glass fixed bottom-[92px] right-[30px] z-40 grid h-11 w-11 place-items-center rounded-full text-white transition-colors hover:border-violetx/50 hover:bg-violetx/20"
        >
          <ArrowUp className="h-4 w-4" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/* ---------------- cookie consent ---------------- */

export function CookieBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => {
      if (!localStorage.getItem("wavexo_cookie")) setShow(true);
    }, 2200);
    return () => clearTimeout(t);
  }, []);
  const decide = (v: string) => {
    localStorage.setItem("wavexo_cookie", v);
    setShow(false);
  };
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.96 }}
          className="g-border fixed bottom-6 left-6 z-50 w-[calc(100%-3rem)] max-w-sm rounded-3xl bg-midnight/90 p-6 shadow-2xl backdrop-blur-xl"
          role="dialog" aria-label="Cookie consent"
        >
          <div className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-electric/40 to-violetx/40 text-cyan-300">
              <Cookie className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-semibold text-white">We value your privacy</p>
              <p className="mt-1 text-xs leading-relaxed text-mist">
                We use cookies to improve your experience and analyze traffic. You can accept or decline — the site works either way.
              </p>
            </div>
            <button onClick={() => decide("dismissed")} aria-label="Close" className="text-faint transition hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={() => decide("accepted")}
              className="flex-1 rounded-full bg-gradient-to-r from-electric to-violetx px-4 py-2.5 text-xs font-semibold text-white transition hover:opacity-90">
              Accept all
            </button>
            <button onClick={() => decide("declined")}
              className="flex-1 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-semibold text-mist transition hover:bg-white/10 hover:text-white">
              Decline
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------------- loading screen ---------------- */

export function LoadingScreen() {
  const [done, setDone] = useState(false);
  const reduce = useReducedMotion();
  useEffect(() => {
    const t = setTimeout(() => setDone(true), reduce ? 200 : 1650);
    return () => clearTimeout(t);
  }, [reduce]);
  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center bg-space"
          exit={{ opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
        >
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-cyanx via-electric to-violetx shadow-[0_20px_70px_-16px_rgba(37,99,235,0.9)]"
            >
              <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
                <path className="wave-anim" d="M2 14c2.5-6 4.5-6 7 0s4.5 6 7 0 3.5-5 6-2.5" strokeDasharray="260" strokeDashoffset="260" />
              </svg>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className="font-display mt-6 text-xl font-bold tracking-tight text-white"
            >
              Wavexo<span className="text-gradient">.</span>
            </motion.p>
            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.1, delay: 0.35, ease: "easeInOut" }}
              className="mt-4 h-[3px] w-40 origin-left rounded-full bg-gradient-to-r from-cyanx via-electric to-magentax" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------------- page transition wrapper ---------------- */

export function Page({ children, className }: { children: React.ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <main className={className}>{children}</main>;
  return (
    <motion.main
      className={className}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.main>
  );
}

/* ---------------- section shell ---------------- */

export function Section({ children, className, id }: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={cn("relative mx-auto w-full max-w-7xl px-5 sm:px-8", className)}>
      {children}
    </section>
  );
}
