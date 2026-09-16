import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, Check, ChevronRight, TrendingUp, Zap } from "lucide-react";
import Hero3D from "../components/Hero3D";
import { useCMS, publishedSorted, sorted } from "../lib/store";
import { useSeo } from "../lib/seo";
import {
  Icon, GradientButton, ArrowIcon, SectionHeading, Reveal, Stagger, StaggerItem,
  CountUp, Marquee, Accordion, EmptyState, GlowOrb, Magnetic, Tilt, accentOf, cn,
} from "../components/ui";
import { Section } from "../components/fx";
import { ProcessTimeline, TestimonialsCarousel, AuditPanel, FinalCta } from "../components/sections";

/* ============================== HERO ============================== */

function Hero() {
  const { content } = useCMS();
  const h = content.hero;
  const reduce = useReducedMotion();

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden" aria-label="Hero">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,#14205c_0%,#070b1a_60%)]" />
      <Hero3D />

      {/* floating glass cards */}
      {!reduce && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.8 }}
            className="animate-float absolute right-[6%] top-[22%] z-10 hidden xl:block"
          >
            <div className="glass w-52 rounded-2xl p-4 shadow-2xl">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600">
                  <TrendingUp className="h-4 w-4 text-white" />
                </span>
                <p className="text-[11px] font-medium text-mist">{h.cardOneLabel}</p>
              </div>
              <p className="font-display mt-2 text-3xl font-bold text-gradient">{h.cardOneValue}</p>
              <p className="mt-1 text-[11px] text-faint">{h.cardOneSub}</p>
              <div className="mt-3 flex h-9 items-end gap-1">
                {[30, 45, 38, 55, 62, 78, 92].map((v, i) => (
                  <motion.span key={i} initial={{ height: 0 }} animate={{ height: `${v}%` }}
                    transition={{ delay: 1.3 + i * 0.08, duration: 0.5, ease: "easeOut" }}
                    className="w-full rounded-sm bg-gradient-to-t from-electric/50 to-cyanx/80" />
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.25, duration: 0.8 }}
            className="animate-float-slow absolute left-[5%] top-[56%] z-10 hidden xl:block"
          >
            <div className="glass w-48 rounded-2xl p-4 shadow-2xl">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-violetx to-magentax">
                  <Zap className="h-4 w-4 text-white" />
                </span>
                <p className="text-[11px] font-medium text-mist">{h.cardTwoLabel}</p>
              </div>
              <p className="font-display mt-2 text-3xl font-bold text-white">{h.cardTwoValue}</p>
              <p className="mt-1 text-[11px] text-faint">{h.cardTwoSub}</p>
            </div>
          </motion.div>
        </>
      )}

      <div className="relative z-20 mx-auto w-full max-w-7xl px-5 pb-28 pt-40 sm:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <span className="g-border inline-flex items-center gap-2 rounded-full bg-white/[0.04] px-5 py-2 text-xs font-semibold tracking-wide text-mist backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
              </span>
              {h.badge} — {content.settings.tagline}
            </span>
          </Reveal>

          <h1 className="font-display mt-8 text-[42px] font-bold leading-[1.06] tracking-tight text-white sm:text-6xl lg:text-[76px]">
            <Reveal delay={0.1}><span className="block">{h.headingStart}</span></Reveal>
            <Reveal delay={0.2}>
              <span className="block">
                <span className="text-gradient-cool">{h.grad1}</span> {h.headingMiddle}
              </span>
            </Reveal>
            <Reveal delay={0.32}>
              <span className="block">
                <span className="text-gradient">{h.grad2}</span>{h.headingEnd}
              </span>
            </Reveal>
          </h1>

          <Reveal delay={0.42}>
            <p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-mist sm:text-lg">{h.subtitle}</p>
          </Reveal>

          <Reveal delay={0.52}>
            <div className="mt-10 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
              <Magnetic>
                <GradientButton to="/book" className="w-full px-8 py-4 text-[15px] sm:w-auto">
                  {h.primaryCta} <ArrowIcon />
                </GradientButton>
              </Magnetic>
              <Magnetic>
                <GradientButton to="/services" variant="ghost" className="w-full px-8 py-4 text-[15px] sm:w-auto">
                  {h.secondaryCta}
                </GradientButton>
              </Magnetic>
            </div>
          </Reveal>

          <Reveal delay={0.62}>
            <p className="mt-9 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-faint">
              {h.trustItems.map((t, i) => (
                <span key={t} className="flex items-center gap-3">
                  {i > 0 && <span className="h-1 w-1 rounded-full bg-gradient-to-r from-cyanx to-magentax" />}
                  {t}
                </span>
              ))}
            </p>
          </Reveal>
        </div>
      </div>

      {/* scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
        className="absolute bottom-7 left-1/2 z-20 -translate-x-1/2"
        aria-hidden
      >
        <motion.div animate={reduce ? {} : { y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}
          className="flex flex-col items-center gap-1.5 text-faint">
          <span className="text-[10px] font-medium uppercase tracking-[0.3em]">Scroll</span>
          <ArrowDown className="h-4 w-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ============================== TRUST + STATS ============================== */

function TrustBar() {
  const { content } = useCMS();
  if (!content.trustedBy.length) return null;
  return (
    <Section className="pb-4 pt-2">
      <Reveal>
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-faint">
          Trusted by growing businesses
        </p>
      </Reveal>
      <Reveal delay={0.1}>
        <Marquee className="mt-8">
          {content.trustedBy.map((b) => (
            <span key={b.id} className="font-display flex items-center gap-2.5 whitespace-nowrap text-lg font-semibold text-white/35 transition-colors duration-300 hover:text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-cyanx to-violetx" />
              {b.name}
            </span>
          ))}
        </Marquee>
      </Reveal>
    </Section>
  );
}

function Stats() {
  const { content } = useCMS();
  if (!content.settings.showStats || !content.metrics.length) return null;
  return (
    <Section className="mt-16">
      <Reveal>
        <div className="glass relative overflow-hidden rounded-[28px] px-6 py-10 sm:px-10">
          <GlowOrb className="-left-20 -top-20 h-56 w-56 bg-electric/20" />
          <GlowOrb className="-bottom-24 -right-16 h-56 w-56 bg-violetx/20" />
          <Stagger className="relative grid grid-cols-2 gap-8 lg:grid-cols-4">
            {content.metrics.map((m) => (
              <StaggerItem key={m.label} className="text-center">
                <p className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
                  <CountUp value={m.value} suffix={m.suffix} prefix={m.prefix} className="text-gradient" />
                </p>
                <p className="mt-2 text-[13px] font-medium text-mist">{m.label}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Reveal>
    </Section>
  );
}

/* ============================== SERVICES ============================== */

function Services() {
  const { content } = useCMS();
  const services = publishedSorted(content.services);
  return (
    <Section className="mt-28">
      <SectionHeading
        eyebrow="What we do"
        title={<>Everything You Need to <span className="text-gradient">Grow Online</span>.</>}
        sub="Five specialized services. One integrated growth system. Pick one — or let us run the whole engine."
      />
      <Stagger className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => {
          const a = accentOf(s.accent);
          return (
            <StaggerItem key={s.id} className={cn(i === 4 && "md:col-span-2 lg:col-span-1")}>
              <Tilt className="h-full">
                <Link to={`/services/${s.slug}`}
                  className={cn("card-glow group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.035] p-7", a.border)}>
                  <div className={cn("pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full opacity-0 blur-[70px] transition-opacity duration-500 group-hover:opacity-100", a.glow)} />
                  <div className="relative flex items-start justify-between">
                    <span className={cn("grid h-13 w-13 h-[52px] w-[52px] place-items-center rounded-2xl bg-gradient-to-br text-white shadow-lg", a.grad)}>
                      <Icon name={s.icon} className="h-6 w-6" />
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-mist">
                      {s.category}
                    </span>
                  </div>
                  <h3 className="font-display relative mt-6 text-xl font-bold text-white transition-colors duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-300 group-hover:to-violet-400">
                    {s.title}
                  </h3>
                  <p className="relative mt-3 text-sm leading-relaxed text-mist">{s.short}</p>
                  <ul className="relative mt-5 space-y-2">
                    {s.features.slice(0, 4).map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-[13px] text-white/70">
                        <Check className={cn("h-3.5 w-3.5 shrink-0", a.text)} strokeWidth={3} /> {f}
                      </li>
                    ))}
                  </ul>
                  <span className="relative mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-white">
                    {s.ctaText}
                    <span className={cn("grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br text-white transition-transform duration-300 group-hover:translate-x-1.5", a.grad)}>
                      <ChevronRight className="h-4 w-4" />
                    </span>
                  </span>
                </Link>
              </Tilt>
            </StaggerItem>
          );
        })}
      </Stagger>
    </Section>
  );
}

/* ============================== WHY WAXEXO ============================== */

function WhyUs() {
  const { content } = useCMS();
  const items = sorted(content.whyFeatures);
  return (
    <Section className="mt-28">
      <div className="relative overflow-hidden rounded-[36px] border border-white/[0.07] bg-gradient-to-b from-white/[0.04] to-transparent px-6 py-16 sm:px-12">
        <GlowOrb className="left-1/3 top-0 h-64 w-64 bg-violetx/15" />
        <SectionHeading
          eyebrow="Why Wavexo"
          title={<>Why Businesses <span className="text-gradient">Choose Wavexo</span>.</>}
          sub="We're not another vendor executing tasks. We're the growth partner your competitors hope you never find."
        />
        <Stagger className="relative mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" step={0.07}>
          {items.map((f) => (
            <StaggerItem key={f.id}>
              <div className="card-glow group h-full rounded-3xl border border-white/[0.08] bg-white/[0.03] p-7">
                <span className="inline-grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-gradient-to-br from-electric/20 to-violetx/20 text-cyan-300 transition-all duration-500 group-hover:scale-110 group-hover:border-violetx/40">
                  <Icon name={f.icon} className="h-5 w-5" />
                </span>
                <h3 className="font-display mt-5 text-[17px] font-semibold text-white">{f.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-mist">{f.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}

/* ============================== PROCESS ============================== */

function Process() {
  return (
    <Section className="mt-28">
      <SectionHeading
        eyebrow="How we work"
        title={<>A Process Built for <span className="text-gradient">Predictable Growth</span>.</>}
        sub="No chaos, no guesswork. Six disciplined steps take you from first call to compounding results."
      />
      <div className="mt-16">
        <ProcessTimeline />
      </div>
      <Reveal delay={0.2} className="mt-14 text-center">
        <GradientButton to="/process" variant="ghost">See the full process <ArrowIcon /></GradientButton>
      </Reveal>
    </Section>
  );
}

/* ============================== CASE STUDIES ============================== */

function Results() {
  const { content } = useCMS();
  const cases = publishedSorted(content.caseStudies).slice(0, 2);
  return (
    <Section className="mt-28">
      <SectionHeading
        eyebrow="Proof, not promises"
        title={<>Results That <span className="text-gradient">Speak Louder</span>.</>}
        sub="Real engagements, real numbers. Every metric below is maintained transparently by our team."
      />
      {cases.length === 0 ? (
        <div className="mt-14">
          <EmptyState icon="chart" title="Case studies coming soon"
            sub="Our team is preparing detailed results stories. Meanwhile, book a call and we'll walk you through live examples." />
        </div>
      ) : (
        <div className="mt-14 space-y-6">
          {cases.map((cs, i) => (
            <Reveal key={cs.id} delay={i * 0.08}>
              <div className="card-glow group grid overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.03] lg:grid-cols-[1.1fr_1.4fr]">
                <div className="relative min-h-[260px] overflow-hidden">
                  {cs.image && (
                    <img src={cs.image} alt={cs.title} loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-midnight/60 lg:bg-gradient-to-r lg:from-transparent lg:to-[#0b1026]" />
                  <span className="absolute left-5 top-5 rounded-full border border-white/20 bg-space/60 px-3.5 py-1.5 text-[11px] font-semibold text-white backdrop-blur">
                    {cs.industry}
                  </span>
                </div>
                <div className="relative p-7 sm:p-9">
                  <div className="flex flex-wrap gap-2">
                    {cs.services.map((s) => (
                      <span key={s} className="rounded-full bg-gradient-to-r from-electric/15 to-violetx/15 px-3 py-1 text-[11px] font-semibold text-cyan-200">{s}</span>
                    ))}
                  </div>
                  <h3 className="font-display mt-4 text-2xl font-bold text-white">{cs.title}</h3>
                  <p className="mt-1 text-sm text-faint">{cs.client}</p>
                  <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {cs.metrics.slice(0, 4).map((m) => (
                      <div key={m.label} className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-3.5">
                        <p className="font-display text-lg font-bold text-gradient sm:text-xl">{m.value}</p>
                        <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-faint">{m.label}</p>
                      </div>
                    ))}
                  </div>
                  {/* before / after */}
                  <div className="mt-6 space-y-2.5">
                    {[
                      { label: cs.beforeLabel, v: cs.before, cls: "bg-white/15" },
                      { label: cs.afterLabel, v: cs.after, cls: "bg-gradient-to-r from-cyanx to-violetx" },
                    ].map((bar) => (
                      <div key={bar.label}>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
                          <motion.div
                            initial={{ width: 0 }} whileInView={{ width: `${bar.v}%` }}
                            viewport={{ once: true }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                            className={cn("h-full rounded-full", bar.cls)}
                          />
                        </div>
                        <p className="mt-1 text-[10px] text-faint">{bar.label}</p>
                      </div>
                    ))}
                  </div>
                  <Link to="/work" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 transition-colors hover:text-white">
                    View Case Study <ArrowIcon />
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </Section>
  );
}

/* ============================== INDUSTRIES ============================== */

function Industries() {
  const { content } = useCMS();
  const items = publishedSorted(content.industries);
  if (!items.length) return null;
  return (
    <Section className="mt-28">
      <SectionHeading
        eyebrow="Who we serve"
        title={<>Built for <span className="text-gradient">Ambitious Businesses</span>.</>}
        sub="Deep playbooks for the industries we know best — and a process that adapts to any market."
      />
      <Stagger className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" step={0.05}>
        {items.map((it) => (
          <StaggerItem key={it.id}>
            <div className="card-glow group flex items-start gap-4 rounded-3xl border border-white/[0.08] bg-white/[0.03] p-6">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-electric/25 to-violetx/25 text-cyan-300 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                <Icon name={it.icon} className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-[15px] font-semibold text-white">{it.name}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-mist">{it.desc}</p>
              </div>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}

/* ============================== TESTIMONIALS ============================== */

function Testimonials() {
  return (
    <Section className="mt-28">
      <SectionHeading
        eyebrow="Client love"
        title={<>Partners Who <span className="text-gradient">Trust the Process</span>.</>}
        sub="Every testimonial on this site is real, recent and managed by our team."
      />
      <TestimonialsCarousel />
    </Section>
  );
}

/* ============================== FAQ ============================== */

function Faq() {
  const { content } = useCMS();
  const faqs = publishedSorted(content.faqs).slice(0, 6);
  if (!faqs.length) return null;
  return (
    <Section className="mt-28">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr]">
        <div>
          <SectionHeading center={false}
            eyebrow="FAQs"
            title={<>Questions? <span className="text-gradient">Answered</span>.</>}
            sub="Everything founders and marketing heads usually ask us before starting. Still curious? We're one WhatsApp message away."
          />
          <Reveal delay={0.2} className="mt-8">
            <GradientButton to="/faqs" variant="ghost">View all FAQs <ArrowIcon /></GradientButton>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <Accordion items={faqs.map((f) => ({ id: f.id, q: f.q, a: f.a }))} />
        </Reveal>
      </div>
    </Section>
  );
}

/* ============================== PAGE ============================== */

export default function Home() {
  useSeo("/");
  return (
    <>
      <Hero />
      <TrustBar />
      <Stats />
      <Services />
      <WhyUs />
      <Process />
      <Results />
      <Industries />
      <Testimonials />
      <Section className="mt-28"><AuditPanel /></Section>
      <Faq />
      <Section className="mt-28"><FinalCta /></Section>
    </>
  );
}
