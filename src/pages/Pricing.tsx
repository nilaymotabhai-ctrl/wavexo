import { Link } from "react-router-dom";
import { Check, ShieldCheck, Infinity as InfinityIcon, RefreshCcw } from "lucide-react";
import { useCMS, publishedSorted } from "../lib/store";
import { useSeo } from "../lib/seo";
import { Reveal, Stagger, StaggerItem, ArrowIcon, cn } from "../components/ui";
import { Section } from "../components/fx";
import { PageHero, FinalCta } from "../components/sections";

const INCLUDED = [
  { icon: ShieldCheck, title: "No lock-in contracts", desc: "Stay because it's working, not because you're stuck." },
  { icon: RefreshCcw, title: "Flexible scope", desc: "Switch services between cycles as priorities change." },
  { icon: InfinityIcon, title: "You own everything", desc: "Accounts, assets, data and creatives — always yours." },
];

export default function Pricing() {
  const { content } = useCMS();
  const plans = publishedSorted(content.pricing);
  useSeo("/pricing", "Pricing & Packages | Wavexo");

  return (
    <>
      <PageHero
        eyebrow="Pricing"
        crumb="Pricing"
        title={<>Honest Pricing for <span className="text-gradient">Serious Growth</span>.</>}
        sub="Every plan is managed live from our team dashboard and tailored to your stage. No hidden fees, no surprise invoices."
      />

      <Section className="mt-8">
        <Stagger className="grid items-stretch gap-6 lg:grid-cols-3" step={0.1}>
          {plans.map((p) => (
            <StaggerItem key={p.id} className="h-full">
              <div className={cn(
                "relative flex h-full flex-col rounded-[30px] p-8 transition-transform duration-500",
                p.recommended
                  ? "g-border scale-[1.02] bg-gradient-to-b from-[#131c4e] to-[#0d1330] shadow-[0_30px_90px_-30px_rgba(124,58,237,0.55)]"
                  : "border border-white/[0.08] bg-white/[0.03] card-glow"
              )}>
                {p.recommended && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-cyanx via-electric to-magentax px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-lg">
                    {p.badge || "Recommended"}
                  </span>
                )}
                {!p.recommended && p.badge && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full border border-white/15 bg-midnight px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white">
                    {p.badge}
                  </span>
                )}
                <h3 className="font-display text-xl font-bold text-white">{p.name}</h3>
                <p className="mt-2 min-h-[40px] text-[13px] leading-relaxed text-mist">{p.tagline}</p>
                <div className="mt-6 flex items-end gap-1.5">
                  <span className={cn("font-display text-4xl font-bold tracking-tight sm:text-[42px]", p.recommended ? "text-gradient" : "text-white")}>
                    {p.price}
                  </span>
                  {p.period && <span className="pb-1.5 text-sm font-medium text-faint">{p.period}</span>}
                </div>
                <div className="my-7 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                <ul className="flex-1 space-y-3.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-white/85">
                      <span className={cn("mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full", p.recommended ? "bg-gradient-to-br from-cyanx to-violetx" : "bg-white/10")}>
                        <Check className="h-3 w-3 text-white" strokeWidth={3.5} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to={`/book?plan=${encodeURIComponent(p.name)}`}
                  className={cn(
                    "group mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-all duration-300",
                    p.recommended
                      ? "glow-btn bg-gradient-to-r from-electric via-violetx to-magentax bg-[length:160%_100%] bg-left text-white hover:bg-right"
                      : "glass-soft text-white hover:bg-white/10"
                  )}>
                  {p.cta} <ArrowIcon />
                </Link>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.15}>
          <p className="mt-8 text-center text-[13px] text-faint">
            Prices are starting points — final scope is quoted after your free audit. GST as applicable. Ad spend billed separately at actuals.
          </p>
        </Reveal>
      </Section>

      {/* included in every plan */}
      <Section className="mt-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-[36px] border border-white/[0.07] bg-gradient-to-b from-white/[0.04] to-transparent px-6 py-14 sm:px-12">
            <h2 className="font-display text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Included in <span className="text-gradient">Every Plan</span>
            </h2>
            <Stagger className="mt-12 grid gap-5 md:grid-cols-3">
              {INCLUDED.map((x) => (
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
            <p className="mt-10 text-center text-sm text-mist">
              On the fence? Read our <Link to="/refund" className="font-semibold text-cyan-300 underline underline-offset-4 hover:text-white">refund policy</Link> — we keep it fair.
            </p>
          </div>
        </Reveal>
      </Section>

      <Section className="mt-24"><FinalCta title={<>Need a <span className="text-gradient">Custom Package?</span></>} sub="Tell us your goals and budget — we'll design a plan that pays for itself." /></Section>
    </>
  );
}
