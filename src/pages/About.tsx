import { Mail } from "lucide-react";
import { useCMS, publishedSorted, initials } from "../lib/store";
import { useSeo } from "../lib/seo";
import { Icon, GradientButton, ArrowIcon, SocialIcon, Reveal, Stagger, StaggerItem, GlowOrb, Tilt, cn } from "../components/ui";
import { Section } from "../components/fx";
import { PageHero, FinalCta } from "../components/sections";

export default function About() {
  const { content } = useCMS();
  const a = content.about;
  const team = publishedSorted(content.team);
  useSeo("/about", "About Wavexo — Strategy-First Digital Growth Agency");

  return (
    <>
      <PageHero
        eyebrow="About Wavexo"
        crumb="About"
        title={<>The Growth Partner Behind <span className="text-gradient">Ambitious Brands</span>.</>}
        sub="Strategy, creativity and technology under one roof — obsessed with outcomes, not activity."
      />

      {/* story */}
      <Section className="mt-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="relative">
              <GlowOrb className="-left-16 -top-16 h-56 w-56 bg-electric/25" />
              <div className="g-border relative overflow-hidden rounded-[28px]">
                {a.image && (
                  <img src={a.image} alt="Wavexo studio" loading="lazy" className="h-full w-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-space/85 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-3">
                  {a.stats.slice(0, 2).map((s) => (
                    <div key={s.label} className="glass rounded-2xl px-4 py-3">
                      <p className="font-display text-xl font-bold text-white">{s.value}</p>
                      <p className="text-[10px] uppercase tracking-wide text-mist">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
          <div>
            <Reveal>
              <h2 className="font-display text-2xl font-bold leading-snug tracking-tight text-white sm:text-3xl">
                {a.storyTitle}
              </h2>
            </Reveal>
            {a.story.split("\n").filter(Boolean).map((p, i) => (
              <Reveal key={i} delay={0.08 + i * 0.06}>
                <p className="mt-5 text-[15px] leading-relaxed text-mist">{p}</p>
              </Reveal>
            ))}
            <Reveal delay={0.26} className="mt-8">
              <GradientButton to="/book">Work with us <ArrowIcon /></GradientButton>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* mission & vision */}
      <Section className="mt-24">
        <Stagger className="grid gap-5 md:grid-cols-2">
          {[
            { tag: "Our Mission", text: a.mission, accent: "from-cyanx to-electric" },
            { tag: "Our Vision", text: a.vision, accent: "from-violetx to-magentax" },
          ].map((card) => (
            <StaggerItem key={card.tag}>
              <div className="card-glow relative h-full overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.03] p-9">
                <span className={cn("inline-block rounded-full bg-gradient-to-r px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white", card.accent)}>
                  {card.tag}
                </span>
                <p className="font-display mt-5 text-xl font-medium leading-relaxed text-white/90">{card.text}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* values */}
      <Section className="mt-24">
        <Reveal>
          <h2 className="font-display text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Values We <span className="text-gradient">Operate By</span>
          </h2>
        </Reveal>
        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" step={0.07}>
          {a.values.map((v) => (
            <StaggerItem key={v.id}>
              <div className="card-glow h-full rounded-3xl border border-white/[0.08] bg-white/[0.03] p-7 text-center">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-electric/25 to-violetx/25 text-cyan-300">
                  <Icon name={v.icon} className="h-5 w-5" />
                </span>
                <h3 className="font-display mt-4 text-[16px] font-semibold text-white">{v.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-mist">{v.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* stats band */}
      <Section className="mt-24">
        <Reveal>
          <div className="glass grid grid-cols-2 gap-8 rounded-[28px] px-8 py-10 lg:grid-cols-4">
            {a.stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-display text-3xl font-bold text-gradient sm:text-4xl">{s.value}</p>
                <p className="mt-1.5 text-[13px] font-medium text-mist">{s.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </Section>

      {/* team */}
      <Section className="mt-24">
        <Reveal>
          <h2 className="font-display text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Meet the <span className="text-gradient">Growth Team</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-[15px] text-mist">
            Strategists, engineers and creatives — one team, one KPI: your growth.
          </p>
        </Reveal>
        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" step={0.08}>
          {team.map((m) => (
            <StaggerItem key={m.id}>
              <Tilt className="h-full">
                <div className="card-glow group h-full rounded-3xl border border-white/[0.08] bg-white/[0.03] p-6 text-center">
                  {m.image ? (
                    <img src={m.image} alt={m.name} loading="lazy" className="mx-auto h-24 w-24 rounded-full border-2 border-white/15 object-cover" />
                  ) : (
                    <span className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-electric to-violetx text-2xl font-bold text-white shadow-[0_14px_40px_-10px_rgba(124,58,237,0.6)]">
                      {initials(m.name)}
                    </span>
                  )}
                  <h3 className="font-display mt-5 text-[16px] font-semibold text-white">{m.name}</h3>
                  <p className="mt-1 text-xs font-medium text-cyan-300">{m.role}</p>
                  <p className="mt-3 text-[13px] leading-relaxed text-mist">{m.bio}</p>
                  <div className="mt-5 flex justify-center gap-2">
                    {m.linkedin && (
                      <a href={m.linkedin} target="_blank" rel="noreferrer" aria-label={`${m.name} on LinkedIn`}
                        className="glass-soft grid h-9 w-9 place-items-center rounded-full text-mist transition hover:text-white">
                        <SocialIcon name="linkedin" className="h-3.5 w-3.5" />
                      </a>
                    )}
                    {m.twitter && (
                      <a href={m.twitter} target="_blank" rel="noreferrer" aria-label={`${m.name} on X`}
                        className="glass-soft grid h-9 w-9 place-items-center rounded-full text-mist transition hover:text-white">
                        <SocialIcon name="twitter" className="h-3.5 w-3.5" />
                      </a>
                    )}
                    {m.email && (
                      <a href={`mailto:${m.email}`} aria-label={`Email ${m.name}`}
                        className="glass-soft grid h-9 w-9 place-items-center rounded-full text-mist transition hover:text-white">
                        <Mail className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </Tilt>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* certifications strip */}
      <Section className="mt-24">
        <Reveal>
          <div className="rounded-[28px] border border-white/[0.07] bg-white/[0.02] px-8 py-10 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-faint">Certified & partnered with the platforms we master</p>
            <div className="font-display mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-lg font-semibold text-white/40">
              {["Meta Business Partner", "Google Partner", "Shopify Partners", "WhatsApp Business API", "HubSpot", "Semrush Certified"].map((p) => (
                <span key={p} className="transition-colors hover:text-white/80">{p}</span>
              ))}
            </div>
          </div>
        </Reveal>
      </Section>

      <Section className="mt-24"><FinalCta title={<>Like How We <span className="text-gradient">Think?</span> Let's Talk.</>} /></Section>
    </>
  );
}
