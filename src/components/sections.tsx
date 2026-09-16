import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useSpring, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Quote, ChevronRight, Sparkles } from "lucide-react";
import { useCMS, publishedSorted, sorted, initials, waLink } from "../lib/store";
import { Icon, GradientButton, ArrowIcon, WhatsAppIcon, SectionHeading, Reveal, Stagger, StaggerItem, Stars, Field, inputCls, SubmitButton, FormSuccess, HoneyPot, cn } from "./ui";

/* ---------------- inner page hero ---------------- */

export function PageHero({
  eyebrow, title, sub, crumb,
}: { eyebrow: string; title: React.ReactNode; sub?: string; crumb?: string }) {
  return (
    <div className="relative overflow-hidden pb-16 pt-36 sm:pb-20 sm:pt-44">
      <div className="bg-grid absolute inset-0" aria-hidden />
      <div className="pointer-events-none absolute -top-32 left-1/4 h-80 w-80 rounded-full bg-electric/20 blur-[130px]" aria-hidden />
      <div className="pointer-events-none absolute -top-20 right-1/4 h-72 w-72 rounded-full bg-violetx/20 blur-[130px]" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="flex items-center gap-2 text-xs font-medium text-faint">
            <Link to="/" className="transition-colors hover:text-white">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-mist">{crumb || eyebrow}</span>
          </p>
        </Reveal>
        <Reveal delay={0.06}>
          <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-mist">
            <Sparkles className="h-3 w-3 text-cyan-300" /> {eyebrow}
          </span>
        </Reveal>
        <Reveal delay={0.12}>
          <h1 className="font-display mt-5 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
            {title}
          </h1>
        </Reveal>
        {sub && (
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-mist sm:text-lg">{sub}</p>
          </Reveal>
        )}
      </div>
    </div>
  );
}

/* ---------------- process timeline ---------------- */

export function ProcessTimeline() {
  const { content } = useCMS();
  const steps = sorted(content.process);
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const lineX = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  return (
    <div ref={ref} className="relative">
      {/* desktop line */}
      <div className="absolute left-0 right-0 top-[26px] hidden h-px bg-white/[0.08] lg:block" aria-hidden />
      {!reduce && (
        <motion.div style={{ scaleX: lineX }} aria-hidden
          className="absolute left-0 right-0 top-[26px] hidden h-px origin-left bg-gradient-to-r from-cyanx via-electric to-magentax lg:block" />
      )}
      {/* mobile line */}
      <div className="absolute bottom-8 left-[26px] top-8 w-px bg-gradient-to-b from-cyanx/50 via-electric/30 to-magentax/40 lg:hidden" aria-hidden />

      <Stagger className="grid gap-10 sm:grid-cols-2 lg:grid-cols-6 lg:gap-4">
        {steps.map((step, i) => (
          <StaggerItem key={step.id} className="relative">
            <div className="flex gap-5 lg:flex-col lg:gap-0">
              <div className="relative z-10 flex flex-col items-center">
                <span className={cn(
                  "grid h-[52px] w-[52px] shrink-0 place-items-center rounded-2xl border text-sm font-bold transition-all duration-500",
                  "border-white/10 bg-midnight font-display text-white shadow-[0_0_0_6px_rgba(7,11,26,1)]"
                )}>
                  <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-electric/15 to-violetx/15" />
                  <span className="relative text-gradient">{String(i + 1).padStart(2, "0")}</span>
                </span>
              </div>
              <div className="lg:mt-6 lg:text-left">
                <div className="flex items-center gap-2">
                  <Icon name={step.icon} className="h-4 w-4 text-cyan-300" />
                  <h3 className="font-display text-lg font-semibold text-white">{step.title}</h3>
                </div>
                <p className="mt-2 text-[13px] leading-relaxed text-mist">{step.desc}</p>
              </div>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}

/* ---------------- testimonials carousel ---------------- */

export function TestimonialsCarousel() {
  const { content } = useCMS();
  const items = publishedSorted(content.testimonials);
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const reduce = useReducedMotion();
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback((d: number) => {
    if (!items.length) return;
    setDir(d);
    setIdx((i) => (i + d + items.length) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (reduce || items.length < 2) return;
    timer.current = setInterval(() => go(1), 6500);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [go, reduce, items.length]);

  if (!items.length) return null;
  const t = items[idx];

  return (
    <div className="relative mx-auto mt-14 max-w-4xl"
      onMouseEnter={() => { if (timer.current) clearInterval(timer.current); }}>
      <div className="g-border relative overflow-hidden rounded-[28px] bg-midnight/50 p-8 backdrop-blur-xl sm:p-12">
        <Quote className="absolute right-8 top-8 h-16 w-16 text-white/[0.05]" aria-hidden />
        <AnimatePresence mode="wait" custom={dir}>
          <motion.figure
            key={t.id}
            custom={dir}
            initial={{ opacity: 0, x: reduce ? 0 : 42 * dir, filter: "blur(4px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: reduce ? 0 : -42 * dir, filter: "blur(4px)" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <Stars n={t.rating} />
            <blockquote className="font-display mt-6 text-xl font-medium leading-relaxed text-white sm:text-2xl">
              "{t.text}"
            </blockquote>
            <figcaption className="mt-8 flex items-center gap-4">
              {t.image ? (
                <img src={t.image} alt={t.name} loading="lazy" className="h-13 w-13 h-[52px] w-[52px] rounded-full border border-white/15 object-cover" />
              ) : (
                <span className="grid h-[52px] w-[52px] place-items-center rounded-full bg-gradient-to-br from-electric to-violetx text-sm font-bold text-white">
                  {initials(t.name)}
                </span>
              )}
              <div>
                <p className="text-sm font-semibold text-white">{t.name}</p>
                <p className="text-xs text-mist">{t.role} · {t.company}</p>
              </div>
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex gap-2">
          {items.map((_, i) => (
            <button key={i} onClick={() => { setDir(i > idx ? 1 : -1); setIdx(i); }}
              aria-label={`Go to testimonial ${i + 1}`}
              className={cn("h-1.5 rounded-full transition-all duration-400", i === idx ? "w-8 bg-gradient-to-r from-cyanx to-violetx" : "w-3 bg-white/15 hover:bg-white/30")} />
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={() => go(-1)} aria-label="Previous testimonial"
            className="glass-soft grid h-11 w-11 place-items-center rounded-full text-white transition hover:border-violetx/50 hover:bg-violetx/20">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button onClick={() => go(1)} aria-label="Next testimonial"
            className="glass-soft grid h-11 w-11 place-items-center rounded-full text-white transition hover:border-violetx/50 hover:bg-violetx/20">
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- free audit panel ---------------- */

export function AuditPanel() {
  const { content, addLead } = useCMS();
  const services = publishedSorted(content.services);
  const [form, setForm] = useState({ name: "", email: "", phone: "", website: "", service: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [bot, setBot] = useState("");
  const [fail, setFail] = useState("");

  const set = (k: string, v: string) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: "" })); };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bot) return; // spam trap
    const errs: Record<string, string> = {};
    if (form.name.trim().length < 2) errs.name = "Please enter your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email";
    if (form.phone.replace(/\D/g, "").length < 8) errs.phone = "Enter a valid phone / WhatsApp number";
    if (!form.service) errs.service = "Select a service";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    setFail("");
    try {
      setTimeout(() => {
        addLead({ name: form.name.trim(), email: form.email, phone: form.phone, website: form.website, service: form.service, message: form.message, source: "audit" });
        setLoading(false);
        setDone(true);
      }, 900);
    } catch {
      setLoading(false);
      setFail("Something went wrong. Please try again or reach us on WhatsApp.");
    }
  };

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-midnight via-[#121a45] to-[#1a0f3c] p-1">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-electric/30 blur-[100px]" aria-hidden />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-magentax/25 blur-[100px]" aria-hidden />
      <div className="bg-grid absolute inset-0 opacity-60" aria-hidden />
      <div className="relative grid gap-10 rounded-[30px] p-8 sm:p-12 lg:grid-cols-2 lg:gap-14">
        <div className="flex flex-col justify-center">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-cyanx/30 bg-cyanx/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200">
            Free · No strings attached
          </span>
          <h2 className="font-display mt-5 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
            Get Your Free <span className="text-gradient">Digital Growth Audit</span>
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-mist">
            Discover what is limiting your online growth and get clear, actionable recommendations from the Wavexo team — delivered within 48 hours.
          </p>
          <ul className="mt-7 space-y-3.5">
            {[
              "Full-funnel review of your website, SEO and ads",
              "Competitor benchmark for your industry",
              "3 prioritized quick wins you can apply immediately",
              "A custom growth roadmap — yours to keep",
            ].map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm text-white/85">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gradient-to-br from-cyanx to-electric text-[10px] font-bold text-white">✓</span>
                {point}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex items-center gap-3 text-xs text-faint">
            <span className="h-px flex-1 bg-white/10" />
            Trusted by 90+ growing businesses
            <span className="h-px flex-1 bg-white/10" />
          </div>
        </div>

        <div className="glass rounded-3xl p-6 sm:p-8">
          {done ? (
            <FormSuccess title="Audit request received!" message="Our strategists are on it. Expect your personalized growth audit within 48 hours — we'll reach out on email and WhatsApp." />
          ) : (
            <form onSubmit={submit} noValidate className="relative space-y-4">
              <HoneyPot onChange={setBot} />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" error={errors.name}>
                  <input className={inputCls} placeholder="Aarav Mehta" value={form.name} onChange={(e) => set("name", e.target.value)} />
                </Field>
                <Field label="Email" error={errors.email}>
                  <input className={inputCls} type="email" placeholder="you@company.com" value={form.email} onChange={(e) => set("email", e.target.value)} />
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Phone / WhatsApp" error={errors.phone}>
                  <input className={inputCls} placeholder="+91 98765 43210" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
                </Field>
                <Field label="Website URL" optional>
                  <input className={inputCls} placeholder="https://yoursite.com" value={form.website} onChange={(e) => set("website", e.target.value)} />
                </Field>
              </div>
              <Field label="Service you're interested in" error={errors.service}>
                <select className={inputCls + " appearance-none"} value={form.service} onChange={(e) => set("service", e.target.value)}>
                  <option value="" className="bg-midnight">Select a service…</option>
                  {services.map((s) => <option key={s.id} value={s.title} className="bg-midnight">{s.title}</option>)}
                  <option value="Complete Growth Audit" className="bg-midnight">Not sure — audit everything</option>
                </select>
              </Field>
              <Field label="What is your biggest growth challenge?" optional>
                <textarea className={inputCls + " min-h-[90px] resize-none"} placeholder="Tell us briefly…" value={form.message} onChange={(e) => set("message", e.target.value)} />
              </Field>
              {fail && <p className="text-xs text-rose-400">{fail}</p>}
              <SubmitButton loading={loading}>Request My Free Audit</SubmitButton>
              <p className="text-center text-[11px] text-faint">Spam-free. Your details stay private — see our <Link to="/privacy" className="underline hover:text-white">privacy policy</Link>.</p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- final CTA ---------------- */

export function FinalCta({ title, sub }: { title?: React.ReactNode; sub?: string }) {
  const { content } = useCMS();
  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-midnight/60 px-6 py-16 text-center sm:px-12 sm:py-20">
      <div className="bg-grid absolute inset-0" aria-hidden />
      <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-cyanx/20 blur-[110px]" aria-hidden />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-magentax/20 blur-[120px]" aria-hidden />
      <div aria-hidden className="animate-spin-slow absolute -top-24 left-1/2 h-48 w-[36rem] -translate-x-1/2 rounded-[100%] bg-gradient-to-r from-transparent via-violetx/25 to-transparent blur-2xl" />
      <div className="relative">
        <Reveal>
          <h2 className="font-display mx-auto max-w-2xl text-3xl font-bold leading-[1.12] tracking-tight text-white sm:text-4xl lg:text-5xl">
            {title || <>Ready to Build Your Next <span className="text-gradient">Growth Story?</span></>}
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-mist">
            {sub || "Book a free 30-minute strategy call. Zero pitch, zero pressure — just a clear plan for your digital growth."}
          </p>
        </Reveal>
        <Reveal delay={0.18}>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <GradientButton to="/book" className="w-full sm:w-auto">Book a Free Consultation <ArrowIcon /></GradientButton>
            {content.settings.whatsapp && (
              <GradientButton variant="whatsapp" href={waLink(content.settings.whatsapp, "Hi Wavexo! I want to grow my business.")} className="w-full sm:w-auto">
                <WhatsAppIcon className="h-4 w-4" /> Chat on WhatsApp
              </GradientButton>
            )}
          </div>
        </Reveal>
        <Reveal delay={0.24}>
          <p className="mt-7 text-[11px] uppercase tracking-[0.22em] text-faint">No contracts · Transparent pricing · Cancel anytime</p>
        </Reveal>
      </div>
    </div>
  );
}

export { SectionHeading };
