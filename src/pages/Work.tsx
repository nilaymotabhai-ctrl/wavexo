import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ExternalLink, Star, TrendingUp } from "lucide-react";
import { useCMS, publishedSorted } from "../lib/store";
import { useSeo } from "../lib/seo";
import { GradientButton, ArrowIcon, Reveal, EmptyState, SectionHeading, cn } from "../components/ui";
import { Section } from "../components/fx";
import { PageHero, FinalCta } from "../components/sections";

const FILTERS = [
  { id: "all", label: "All Work" },
  { id: "seo", label: "SEO" },
  { id: "web", label: "Website Development" },
  { id: "ecommerce", label: "E-commerce" },
  { id: "whatsapp", label: "WhatsApp Automation" },
  { id: "meta-ads", label: "Meta Ads" },
];

function Portfolio() {
  const { content } = useCMS();
  const items = publishedSorted(content.portfolio);
  const [filter, setFilter] = useState("all");
  const filtered = useMemo(() => filter === "all" ? items : items.filter((i) => i.category === filter), [items, filter]);

  return (
    <div>
      <Reveal>
        <div className="flex flex-wrap justify-center gap-2" role="tablist" aria-label="Portfolio filters">
          {FILTERS.map((f) => (
            <button key={f.id} role="tab" aria-selected={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "rounded-full border px-5 py-2.5 text-[13px] font-semibold transition-all duration-300",
                filter === f.id
                  ? "border-transparent bg-gradient-to-r from-electric to-violetx text-white shadow-[0_8px_28px_-8px_rgba(124,58,237,0.7)]"
                  : "border-white/10 bg-white/[0.04] text-mist hover:border-white/25 hover:text-white"
              )}>
              {f.label}
            </button>
          ))}
        </div>
      </Reveal>

      {filtered.length === 0 ? (
        <div className="mt-14">
          <EmptyState icon="layers" title="Nothing here yet"
            sub="Projects for this category are being prepared. Try another filter or check back soon." />
        </div>
      ) : (
        <motion.div layout className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((p) => (
              <motion.article key={p.id} layout
                initial={{ opacity: 0, scale: 0.94, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 12 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="card-glow group relative flex flex-col overflow-hidden rounded-[26px] border border-white/[0.08] bg-white/[0.03]">
                <div className="relative h-56 overflow-hidden">
                  {p.cover ? (
                    <img src={p.cover} alt={p.title} loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108 group-hover:scale-105" />
                  ) : (
                    <div className="grid h-full place-items-center bg-gradient-to-br from-midnight to-[#141b45]">
                      <span className="font-display text-4xl font-bold text-white/15">{p.client}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b1026] via-transparent to-transparent" />
                  <div className="absolute left-4 top-4 flex gap-2">
                    <span className="rounded-full border border-white/15 bg-space/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur">{p.industry}</span>
                    {p.featured && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-1 text-[10px] font-bold text-space">
                        <Star className="h-3 w-3 fill-space" /> Featured
                      </span>
                    )}
                  </div>
                </div>
                <div className="relative flex flex-1 flex-col p-6">
                  <p className="text-xs font-medium text-cyan-300">{p.client}</p>
                  <h3 className="font-display mt-1.5 text-lg font-bold leading-snug text-white">{p.title}</h3>
                  <p className="mt-2.5 text-[13px] leading-relaxed text-mist">{p.description}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {p.services.map((s) => (
                      <span key={s} className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[10px] font-medium text-mist">{s}</span>
                    ))}
                  </div>
                  <div className="mt-4 space-y-1.5 border-t border-white/[0.07] pt-4">
                    {p.results.slice(0, 3).map((r) => (
                      <p key={r} className="flex items-center gap-2 text-[12px] font-medium text-white/80">
                        <TrendingUp className="h-3.5 w-3.5 text-emerald-400" /> {r}
                      </p>
                    ))}
                  </div>
                  {p.url && (
                    <a href={p.url} target="_blank" rel="noreferrer"
                      className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-cyan-300 hover:text-white">
                      Visit project <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

function CaseStudies() {
  const { content } = useCMS();
  const cases = publishedSorted(content.caseStudies);
  const [open, setOpen] = useState<string | null>(cases[0]?.id ?? null);

  if (!cases.length) return null;
  return (
    <div className="mt-28">
      <SectionHeading
        eyebrow="Deep dives"
        title={<>Case Studies: <span className="text-gradient">Challenge → Result</span>.</>}
        sub="The full story behind the numbers — strategy, execution and measured outcomes."
      />
      <div className="mx-auto mt-14 max-w-5xl space-y-5">
        {cases.map((cs) => {
          const isOpen = open === cs.id;
          return (
            <Reveal key={cs.id}>
              <div className={cn("g-border overflow-hidden rounded-[28px] bg-midnight/50 backdrop-blur transition-all", isOpen && "bg-midnight/70")}>
                <button onClick={() => setOpen(isOpen ? null : cs.id)}
                  aria-expanded={isOpen}
                  className="flex w-full flex-col gap-4 p-6 text-left sm:flex-row sm:items-center sm:p-8">
                  {cs.image && <img src={cs.image} alt="" loading="lazy" className="h-20 w-28 rounded-2xl border border-white/10 object-cover" />}
                  <div className="flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-300">{cs.industry}</p>
                    <h3 className="font-display mt-1 text-xl font-bold text-white sm:text-2xl">{cs.title}</h3>
                    <p className="mt-1 text-sm text-faint">{cs.client} · {cs.services.join(" + ")}</p>
                  </div>
                  <div className="flex items-center gap-5">
                    <div className="hidden gap-4 sm:flex">
                      {cs.metrics.slice(0, 2).map((m) => (
                        <div key={m.label} className="text-right">
                          <p className="font-display text-xl font-bold text-gradient">{m.value}</p>
                          <p className="text-[10px] uppercase tracking-wide text-faint">{m.label}</p>
                        </div>
                      ))}
                    </div>
                    <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 transition-transform duration-300", isOpen && "rotate-180 border-violetx/50 bg-violetx/20")}>
                      <ChevronDown className="h-4 w-4 text-white" />
                    </span>
                  </div>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
                      <div className="grid gap-5 border-t border-white/[0.07] p-6 sm:grid-cols-3 sm:p-8">
                        {[
                          { label: "The Challenge", text: cs.challenge, tone: "text-rose-300" },
                          { label: "The Strategy", text: cs.strategy, tone: "text-cyan-300" },
                          { label: "The Solution", text: cs.solution, tone: "text-emerald-300" },
                        ].map((b) => (
                          <div key={b.label} className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5">
                            <p className={cn("text-[11px] font-bold uppercase tracking-[0.18em]", b.tone)}>{b.label}</p>
                            <p className="mt-2.5 text-[13px] leading-relaxed text-mist">{b.text}</p>
                          </div>
                        ))}
                      </div>
                      <div className="grid gap-6 px-6 pb-8 sm:grid-cols-2 sm:px-8">
                        <div className="grid grid-cols-2 gap-3">
                          {cs.metrics.map((m) => (
                            <div key={m.label} className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4 text-center">
                              <p className="font-display text-2xl font-bold text-gradient">{m.value}</p>
                              <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-faint">{m.label}</p>
                            </div>
                          ))}
                        </div>
                        <div className="flex flex-col justify-center space-y-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6">
                          {[{ label: cs.beforeLabel, v: cs.before, cls: "bg-white/15" }, { label: cs.afterLabel, v: cs.after, cls: "bg-gradient-to-r from-cyanx to-violetx" }].map((bar) => (
                            <div key={bar.label}>
                              <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${bar.v}%` }}
                                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                                  className={cn("h-full rounded-full", bar.cls)} />
                              </div>
                              <p className="mt-1 text-[10px] text-faint">{bar.label}</p>
                            </div>
                          ))}
                          {cs.quote && <p className="pt-2 text-sm italic leading-relaxed text-white/80">"{cs.quote}"</p>}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}

export default function Work() {
  const { content } = useCMS();
  useSeo("/work", "Our Work — Case Studies & Results | Wavexo");
  const hasAnything = content.portfolio.some((p) => p.published) || content.caseStudies.some((c) => c.published);

  return (
    <>
      <PageHero
        eyebrow="Our Work"
        crumb="Work"
        title={<>Work That <span className="text-gradient">Moves Numbers</span>.</>}
        sub="Explore selected projects and deep-dive case studies. Everything shown here is real client work, updated by our team."
      />
      <Section className="mt-4">
        {hasAnything ? (
          <>
            <Portfolio />
            <CaseStudies />
          </>
        ) : (
          <EmptyState icon="layers" title="Portfolio launching soon"
            sub="We're curating our best work for this page. In the meantime, book a call and we'll share relevant examples live." />
        )}
      </Section>
      <Section className="mt-28">
        <Reveal className="mb-10 text-center">
          <GradientButton to="/contact">Start your project with us <ArrowIcon /></GradientButton>
        </Reveal>
        <FinalCta title={<>Want Results Like <span className="text-gradient">These?</span></>} />
      </Section>
    </>
  );
}
