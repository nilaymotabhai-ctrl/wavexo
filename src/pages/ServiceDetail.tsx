import { useMemo, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { Check, ChevronRight, Package, Wrench, ArrowRight } from "lucide-react";
import { useCMS, publishedSorted, waLink } from "../lib/store";
import { useSeo } from "../lib/seo";
import {
  Icon, GradientButton, ArrowIcon, WhatsAppIcon, SectionHeading, Reveal, Stagger,
  StaggerItem, Accordion, EmptyState, Field, inputCls, SubmitButton, FormSuccess, HoneyPot, accentOf, cn,
} from "../components/ui";
import { Section } from "../components/fx";
import { FinalCta } from "../components/sections";

function ServiceLeadForm({ service }: { service: string }) {
  const { addLead } = useCMS();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [bot, setBot] = useState("");

  const set = (k: string, v: string) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: "" })); };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bot) return;
    const errs: Record<string, string> = {};
    if (form.name.trim().length < 2) errs.name = "Please enter your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email";
    if (form.phone.replace(/\D/g, "").length < 8) errs.phone = "Enter a valid number";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    setTimeout(() => {
      addLead({ ...form, name: form.name.trim(), service, source: "service" });
      setLoading(false);
      setDone(true);
    }, 800);
  };

  if (done) return <FormSuccess title="Request received!" message={`Our ${service} specialists will reach out within a few business hours with next steps.`} />;

  return (
    <form onSubmit={submit} noValidate className="relative space-y-4">
      <HoneyPot onChange={setBot} />
      <Field label="Full name" error={errors.name}>
        <input className={inputCls} placeholder="Your name" value={form.name} onChange={(e) => set("name", e.target.value)} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email" error={errors.email}>
          <input className={inputCls} type="email" placeholder="you@company.com" value={form.email} onChange={(e) => set("email", e.target.value)} />
        </Field>
        <Field label="Phone / WhatsApp" error={errors.phone}>
          <input className={inputCls} placeholder="+91 98765 43210" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
        </Field>
      </div>
      <Field label="Tell us about your project" optional>
        <textarea className={inputCls + " min-h-[90px] resize-none"} placeholder="Goals, timeline, current situation…" value={form.message} onChange={(e) => set("message", e.target.value)} />
      </Field>
      <SubmitButton loading={loading}>Start My Project</SubmitButton>
    </form>
  );
}

export default function ServiceDetail() {
  const { slug } = useParams();
  const { content } = useCMS();
  const service = content.services.find((s) => s.slug === slug && s.published);
  const relatedCases = useMemo(
    () => publishedSorted(content.caseStudies).filter((c) => service && c.services.some((s) => service.title.toLowerCase().includes(s.split(" ")[0].toLowerCase()) || s.toLowerCase().includes(service.title.split(" ")[0].toLowerCase()))).slice(0, 1),
    [content.caseStudies, service]
  );

  const faqSchema = useMemo(() => service && service.faqs.length ? {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: service.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  } : undefined, [service]);

  useSeo("", service?.seo.title, faqSchema);

  if (!service) return <Navigate to="/services" replace />;
  const a = accentOf(service.accent);
  const others = publishedSorted(content.services).filter((s) => s.id !== service.id).slice(0, 3);

  return (
    <>
      {/* hero */}
      <section className="relative overflow-hidden pb-16 pt-36 sm:pt-44">
        <div className="bg-grid absolute inset-0" aria-hidden />
        <div className={cn("pointer-events-none absolute -top-24 left-1/3 h-96 w-96 rounded-full blur-[140px]", a.glow)} aria-hidden />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <p className="flex flex-wrap items-center gap-2 text-xs font-medium text-faint">
              <Link to="/" className="hover:text-white">Home</Link> <ChevronRight className="h-3 w-3" />
              <Link to="/services" className="hover:text-white">Services</Link> <ChevronRight className="h-3 w-3" />
              <span className="text-mist">{service.title}</span>
            </p>
          </Reveal>
          <div className="mt-10 grid items-center gap-12 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <Reveal delay={0.05}>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-mist">
                  {service.category}
                </span>
              </Reveal>
              <Reveal delay={0.12}>
                <h1 className="font-display mt-5 text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
                  {service.title}
                </h1>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="mt-6 max-w-xl text-base leading-relaxed text-mist sm:text-lg">{service.description}</p>
              </Reveal>
              <Reveal delay={0.28}>
                <div className="mt-9 flex flex-wrap gap-3">
                  <GradientButton to="/book">Book a Free Consultation <ArrowIcon /></GradientButton>
                  {content.settings.whatsapp && (
                    <GradientButton variant="whatsapp" href={waLink(content.settings.whatsapp, `Hi Wavexo! I'm interested in your ${service.title}.`)}>
                      <WhatsAppIcon className="h-4 w-4" /> WhatsApp Us
                    </GradientButton>
                  )}
                </div>
              </Reveal>
            </div>
            <Reveal delay={0.2} className="hidden lg:block">
              <div className="g-border relative mx-auto grid h-64 w-64 place-items-center rounded-[36px] bg-white/[0.03] backdrop-blur">
                <div className={cn("absolute inset-0 rounded-[36px] opacity-30 blur-2xl", a.glow)} />
                <span className={cn("relative grid h-28 w-28 place-items-center rounded-[28px] bg-gradient-to-br text-white shadow-2xl", a.grad)}>
                  <Icon name={service.icon} className="h-14 w-14" />
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* problem */}
      <Section className="mt-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[32px] border border-rose-400/15 bg-gradient-to-br from-rose-500/[0.07] to-transparent p-9 sm:p-12">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-rose-300/80">The problem we solve</p>
            <p className="font-display mt-4 max-w-3xl text-xl font-medium leading-relaxed text-white/90 sm:text-2xl">
              {service.problem}
            </p>
          </div>
        </Reveal>
      </Section>

      {/* benefits + features */}
      <Section className="mt-20">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading center={false} eyebrow="Outcomes"
              title={<>What You <span className="text-gradient">Actually Get</span>.</>} />
            <Stagger className="mt-9 space-y-4">
              {service.benefits.map((b) => (
                <StaggerItem key={b}>
                  <div className="flex items-start gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
                    <span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br text-white", a.grad)}>
                      <Check className="h-4 w-4" strokeWidth={3} />
                    </span>
                    <p className="text-[15px] font-medium text-white/90">{b}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
          <div>
            <SectionHeading center={false} eyebrow="Scope"
              title={<>Everything <span className="text-gradient">Included</span>.</>} />
            <Stagger className="mt-9 grid gap-3 sm:grid-cols-2">
              {service.features.map((f) => (
                <StaggerItem key={f}>
                  <div className="flex h-full items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5 text-[13px] text-white/85">
                    <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", a.solid)} /> {f}
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </Section>

      {/* process + deliverables + tools */}
      <Section className="mt-20">
        <div className="grid gap-6 lg:grid-cols-3">
          <Reveal className="lg:col-span-1">
            <div className="card-glow h-full rounded-3xl border border-white/[0.08] bg-white/[0.03] p-8">
              <h3 className="font-display flex items-center gap-3 text-lg font-bold text-white">
                <span className={cn("grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br text-white", a.grad)}><ChevronRight className="h-4 w-4" /></span>
                How it runs
              </h3>
              <ol className="mt-6 space-y-4">
                {service.process.map((p, i) => (
                  <li key={p} className="flex items-center gap-3.5">
                    <span className="font-display grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/15 text-[11px] font-bold text-cyan-300">{i + 1}</span>
                    <span className="text-sm text-white/85">{p}</span>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
          <Reveal delay={0.08} className="lg:col-span-1">
            <div className="card-glow h-full rounded-3xl border border-white/[0.08] bg-white/[0.03] p-8">
              <h3 className="font-display flex items-center gap-3 text-lg font-bold text-white">
                <span className={cn("grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br text-white", a.grad)}><Package className="h-4 w-4" /></span>
                Deliverables
              </h3>
              <ul className="mt-6 space-y-3.5">
                {service.deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-3 text-sm text-white/85">
                    <Check className={cn("mt-0.5 h-4 w-4 shrink-0", a.text)} strokeWidth={3} /> {d}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.16} className="lg:col-span-1">
            <div className="card-glow h-full rounded-3xl border border-white/[0.08] bg-white/[0.03] p-8">
              <h3 className="font-display flex items-center gap-3 text-lg font-bold text-white">
                <span className={cn("grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br text-white", a.grad)}><Wrench className="h-4 w-4" /></span>
                Tools & platforms
              </h3>
              <div className="mt-6 flex flex-wrap gap-2.5">
                {service.tools.map((t) => (
                  <span key={t} className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-mist">{t}</span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* case study + form */}
      <Section className="mt-20">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            {relatedCases.length > 0 ? relatedCases.map((cs) => (
              <Reveal key={cs.id}>
                <Link to="/work" className="card-glow group block overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.03]">
                  {cs.image && (
                    <div className="relative h-52 overflow-hidden">
                      <img src={cs.image} alt={cs.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-midnight to-transparent" />
                      <span className="absolute bottom-4 left-5 rounded-full bg-space/70 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur">Related case study</span>
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="font-display text-lg font-bold text-white">{cs.title}</h3>
                    <p className="mt-1 text-xs text-faint">{cs.client} · {cs.industry}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {cs.metrics.slice(0, 3).map((m) => (
                        <span key={m.label} className="rounded-full bg-gradient-to-r from-electric/15 to-violetx/15 px-3 py-1.5 text-[11px] font-semibold text-cyan-200">
                          {m.value} {m.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </Reveal>
            )) : (
              <Reveal>
                <EmptyState icon="chart" title="Results in progress" sub="We're documenting fresh results for this service. Ask us on a call — we'll share live dashboards." />
              </Reveal>
            )}
            <Reveal delay={0.1}>
              <div className="glass rounded-3xl p-7">
                <p className="font-display text-lg font-semibold text-white">Typical timeline</p>
                <p className="mt-2 text-sm leading-relaxed text-mist">Kickoff within 3 business days. First deliverables inside week one. Momentum from there — measured weekly.</p>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.12}>
            <div className="g-border h-full rounded-3xl bg-midnight/50 p-7 backdrop-blur sm:p-9">
              <h3 className="font-display text-2xl font-bold text-white">Get a custom {service.title.toLowerCase()} plan</h3>
              <p className="mt-2 text-sm text-mist">Tell us where you are — we'll reply with a practical plan and honest quote.</p>
              <div className="mt-7">
                <ServiceLeadForm service={service.title} />
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* faqs */}
      {service.faqs.length > 0 && (
        <Section className="mt-20">
          <div className="mx-auto max-w-3xl">
            <SectionHeading eyebrow={`${service.title} FAQs`} title={<>Good Questions, <span className="text-gradient">Honest Answers</span>.</>} />
            <Reveal delay={0.1} className="mt-12">
              <Accordion items={service.faqs.map((f, i) => ({ id: `${service.id}-faq-${i}`, q: f.q, a: f.a }))} />
            </Reveal>
          </div>
        </Section>
      )}

      {/* other services */}
      <Section className="mt-20">
        <Reveal>
          <h2 className="font-display text-2xl font-bold text-white">Explore more services</h2>
        </Reveal>
        <Stagger className="mt-8 grid gap-4 md:grid-cols-3">
          {others.map((s) => {
            const oa = accentOf(s.accent);
            return (
              <StaggerItem key={s.id}>
                <Link to={`/services/${s.slug}`} className={cn("card-glow group flex h-full flex-col rounded-3xl border border-white/[0.08] bg-white/[0.03] p-6", oa.border)}>
                  <span className={cn("grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br text-white", oa.grad)}>
                    <Icon name={s.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="font-display mt-4 text-[16px] font-semibold text-white">{s.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-mist">{s.short}</p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[13px] font-semibold text-cyan-300">
                    Learn more <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Section>

      <Section className="mt-24"><FinalCta title={<>Ready to Scale With <span className="text-gradient">{service.title.split(" ")[0]}</span>?</>} sub={service.ctaText + " — start with a free, zero-pressure strategy call."} /></Section>
    </>
  );
}
