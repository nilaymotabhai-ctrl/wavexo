import { CheckCircle2, FileText, LayoutDashboard, Workflow } from "lucide-react";
import { useCMS, sorted } from "../lib/store";
import { useSeo } from "../lib/seo";
import { Icon, Reveal, Stagger, StaggerItem, cn } from "../components/ui";
import { Section } from "../components/fx";
import { PageHero, ProcessTimeline, FinalCta } from "../components/sections";

const EXTRAS: { title: string; desc: string; icon: typeof FileText }[] = [
  { title: "Weekly updates", desc: "A short loom or call every week — what shipped, what we learned, what's next.", icon: FileText },
  { title: "Live dashboards", desc: "Your metrics, always on. Leads, spend, revenue — no waiting for monthly PDFs.", icon: LayoutDashboard },
  { title: "Documented playbooks", desc: "Everything we build is documented, so your team can run and scale it too.", icon: Workflow },
];

export default function Process() {
  const { content } = useCMS();
  const steps = sorted(content.process);
  useSeo("/process", "Our Process — Discover to Scale | Wavexo");

  return (
    <>
      <PageHero
        eyebrow="Our Process"
        crumb="Process"
        title={<>From First Call to <span className="text-gradient">Compounding Growth</span>.</>}
        sub="A transparent six-step operating system refined across 150+ projects. You'll always know what's happening, why, and what comes next."
      />

      <Section className="mt-4">
        <ProcessTimeline />
      </Section>

      {/* step detail cards */}
      <Section className="mt-24">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, i) => (
            <Reveal key={step.id} delay={i * 0.05}>
              <div className="card-glow group relative h-full overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.03] p-8">
                <span className="font-display absolute -right-3 -top-6 text-[88px] font-bold leading-none text-white/[0.045] transition-colors duration-500 group-hover:text-violetx/10">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-electric/25 to-violetx/25 text-cyan-300">
                  <Icon name={step.icon} className="h-5 w-5" />
                </span>
                <h3 className="font-display mt-5 text-xl font-bold text-white">
                  <span className="text-gradient mr-2">{String(i + 1).padStart(2, "0")}</span>{step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-mist">{step.desc}</p>
                <div className={cn("mt-6 h-1 w-12 rounded-full bg-gradient-to-r transition-all duration-500 group-hover:w-20", i % 2 ? "from-violetx to-magentax" : "from-cyanx to-electric")} />
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* how we keep you informed */}
      <Section className="mt-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-[36px] border border-white/[0.07] bg-gradient-to-b from-white/[0.04] to-transparent px-6 py-14 sm:px-12">
            <h2 className="font-display text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Radical <span className="text-gradient">Transparency</span>, Built In
            </h2>
            <Stagger className="mt-12 grid gap-5 md:grid-cols-3">
              {EXTRAS.map((x) => (
                <StaggerItem key={x.title}>
                  <div className="h-full rounded-3xl border border-white/[0.08] bg-white/[0.03] p-7 text-center">
                    <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-electric/25 to-violetx/25 text-cyan-300">
                      <x.icon className="h-5 w-5" strokeWidth={1.8} />
                    </span>
                    <h3 className="font-display mt-4 text-lg font-semibold text-white">{x.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-mist">{x.desc}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              {["No lock-in contracts", "You own everything we build", "Plain-language reporting"].map((t) => (
                <span key={t} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-mist">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> {t}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </Section>

      <Section className="mt-24"><FinalCta /></Section>
    </>
  );
}
