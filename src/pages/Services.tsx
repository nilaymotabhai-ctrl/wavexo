import { Link } from "react-router-dom";
import { Check, ChevronRight } from "lucide-react";
import { useCMS, publishedSorted } from "../lib/store";
import { useSeo } from "../lib/seo";
import { Icon, Reveal, Tilt, accentOf, cn } from "../components/ui";
import { Section } from "../components/fx";
import { PageHero, FinalCta } from "../components/sections";

export default function Services() {
  const { content } = useCMS();
  const services = publishedSorted(content.services);
  useSeo("/services", "Services — SEO, Web Development, WhatsApp Automation, E-commerce & Meta Ads");

  return (
    <>
      <PageHero
        eyebrow="Services"
        crumb="Services"
        title={<>One Team. <span className="text-gradient">Every Growth Service</span> You Need.</>}
        sub="Stop stitching together freelancers and agencies. SEO, websites, automation, e-commerce and Meta ads — engineered to work as one system."
      />

      <Section className="mt-4 space-y-8">
        {services.map((s, i) => {
          const a = accentOf(s.accent);
          const flip = i % 2 === 1;
          return (
            <Reveal key={s.id}>
              <div className={cn(
                "card-glow group relative grid items-center gap-8 overflow-hidden rounded-[32px] border border-white/[0.08] bg-white/[0.03] p-8 sm:p-10 lg:grid-cols-[1.2fr_1fr] lg:gap-12",
              )}>
                <div className={cn("pointer-events-none absolute -top-24 h-64 w-64 rounded-full opacity-40 blur-[110px]", a.glow, flip ? "-right-16" : "-left-16")} />
                <div className={cn("relative", flip && "lg:order-2")}>
                  <div className="flex items-center gap-4">
                    <span className={cn("grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-xl", a.grad)}>
                      <Icon name={s.icon} className="h-7 w-7" />
                    </span>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-faint">{s.category}</p>
                      <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">{s.title}</h2>
                    </div>
                  </div>
                  <p className="mt-5 text-[15px] leading-relaxed text-mist">{s.description}</p>
                  <div className="mt-7 flex flex-wrap items-center gap-3">
                    <Link to={`/services/${s.slug}`}
                      className={cn("group/btn inline-flex items-center gap-2 rounded-full bg-gradient-to-r px-6 py-3 text-sm font-semibold text-white shadow-lg transition-transform duration-300 hover:scale-[1.03]", a.grad)}>
                      {s.ctaText}
                      <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </Link>
                    <Link to="/book" className="text-sm font-semibold text-mist transition-colors hover:text-white">
                      or book a free strategy call →
                    </Link>
                  </div>
                </div>
                <Tilt className={cn("relative", flip && "lg:order-1")}>
                  <div className="glass rounded-3xl p-6">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-faint">What's included</p>
                    <ul className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                      {s.features.slice(0, 6).map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-[13px] text-white/80">
                          <Check className={cn("mt-0.5 h-3.5 w-3.5 shrink-0", a.text)} strokeWidth={3} /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Tilt>
              </div>
            </Reveal>
          );
        })}
      </Section>

      {/* comparison hint */}
      <Section className="mt-24">
        <Reveal>
          <div className="glass flex flex-col items-center justify-between gap-6 rounded-[28px] px-8 py-9 sm:flex-row sm:px-12">
            <div>
              <h3 className="font-display text-xl font-bold text-white sm:text-2xl">Not sure which service fits your stage?</h3>
              <p className="mt-2 text-sm text-mist">Take the free audit — we'll tell you exactly where the biggest opportunity is.</p>
            </div>
            <Link to="/contact" className="glow-btn shrink-0 rounded-full bg-gradient-to-r from-electric to-violetx px-7 py-3.5 text-sm font-semibold text-white">
              Get My Free Audit
            </Link>
          </div>
        </Reveal>
      </Section>

      <Section className="mt-24"><FinalCta /></Section>
    </>
  );
}
