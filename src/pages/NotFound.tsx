import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Compass } from "lucide-react";
import { useSeo } from "../lib/seo";
import { GradientButton, ArrowIcon, WhatsAppCta } from "../components/ui";

export default function NotFound() {
  useSeo("", "Page Not Found | Wavexo");
  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-5">
      <div className="bg-grid absolute inset-0" aria-hidden />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violetx/15 blur-[140px]" aria-hidden />

      <div className="relative text-center">
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="font-display bg-gradient-to-br from-cyan-300 via-electric to-magentax bg-clip-text text-[26vw] font-bold leading-none text-transparent sm:text-[180px]"
        >
          404
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-mist">
            <Compass className="h-3.5 w-3.5 text-cyan-300" /> Lost in digital space
          </span>
          <h1 className="font-display mt-6 text-2xl font-bold text-white sm:text-3xl">This page drifted off the growth map.</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-mist">
            The link may be old, typed wrong, or the page moved. Let's get you back to something useful.
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <GradientButton to="/">Back to Home <ArrowIcon /></GradientButton>
          <GradientButton to="/services" variant="ghost">Explore Services</GradientButton>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} className="mt-6">
          <WhatsAppCta label="Ask us on WhatsApp" />
        </motion.div>
        <motion.nav initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
          className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-medium text-faint" aria-label="Helpful links">
          {[["/work", "Our Work"], ["/pricing", "Pricing"], ["/blog", "Blog"], ["/contact", "Contact"]].map(([to, l]) => (
            <Link key={to} to={to} className="transition-colors hover:text-white">{l}</Link>
          ))}
        </motion.nav>
      </div>
    </section>
  );
}
