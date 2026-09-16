import { useState } from "react";
import {
  Building2, Share2, Megaphone, Sparkles, BarChart3, Save,
  Phone, Mail, MapPin, Clock, Globe, CalendarCheck,
} from "lucide-react";
import { useCMS, newId } from "../lib/store";
import { Metric } from "../lib/types";
import {
  AField, AInput, ATextarea, AButton, ACard, AToggle, SectionTitle, ListEditor, toast,
} from "./ui";
import { cn } from "../utils/cn";

type Tab = "brand" | "social" | "offers" | "hero" | "metrics";

const TABS: { id: Tab; label: string; icon: typeof Building2; desc: string }[] = [
  { id: "brand", label: "Brand & Contact", icon: Building2, desc: "Name, tagline, email, phone, WhatsApp, address" },
  { id: "social", label: "Social Links", icon: Share2, desc: "Facebook, Instagram, LinkedIn, X, YouTube" },
  { id: "offers", label: "Offers & Announcements", icon: Megaphone, desc: "The promo bar on top of the website" },
  { id: "hero", label: "Homepage Hero", icon: Sparkles, desc: "Main headline, subtext, buttons, trust line" },
  { id: "metrics", label: "Metrics & Trust", icon: BarChart3, desc: "Numbers strip, client names marquee" },
];

export default function ContentStudio() {
  const { content, updateSettings, updateHero, save, log, can } = useCMS();
  const [tab, setTab] = useState<Tab>("brand");
  const s = content.settings;
  const h = content.hero;
  const editable = can("content");

  const done = (what: string) => { toast(`${what} saved — live on the site`); log("Content updated", what); };

  const Guard = ({ children }: { children: React.ReactNode }) => (
    <fieldset disabled={!editable} className={cn(!editable && "opacity-60")}>{children}</fieldset>
  );

  return (
    <div>
      <SectionTitle title="Site Content & Offers"
        sub="Edit the text, contact details, offers and hero copy shown across the website. Everything saves instantly."
        right={!editable && <span className="text-xs font-semibold text-amber-300">Read-only for your role</span>} />

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        {/* tab rail */}
        <div className="flex gap-2 overflow-x-auto lg:flex-col">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={cn("flex min-w-[180px] items-start gap-3 rounded-2xl border p-4 text-left transition lg:min-w-0",
                tab === t.id ? "border-violetx/50 bg-gradient-to-r from-electric/20 to-violetx/15" : "border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.05]")}>
              <t.icon className={cn("mt-0.5 h-4 w-4 shrink-0", tab === t.id ? "text-cyan-300" : "text-faint")} strokeWidth={1.9} />
              <span>
                <span className={cn("block text-[13px] font-semibold", tab === t.id ? "text-white" : "text-white/80")}>{t.label}</span>
                <span className="mt-0.5 hidden text-[10px] leading-snug text-faint lg:block">{t.desc}</span>
              </span>
            </button>
          ))}
        </div>

        <Guard>
          {/* ---------------- BRAND & CONTACT ---------------- */}
          {tab === "brand" && (
            <div className="space-y-5">
              <ACard>
                <h3 className="font-display text-[15px] font-bold text-white">Brand identity</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <AField label="Site / brand name"><AInput value={s.siteName} onChange={(e) => updateSettings({ siteName: e.target.value })} /></AField>
                  <AField label="Tagline"><AInput value={s.tagline} onChange={(e) => updateSettings({ tagline: e.target.value })} /></AField>
                </div>
                <div className="mt-4">
                  <AField label="Footer description" hint="Shown under your logo in the footer.">
                    <ATextarea value={s.footerText} onChange={(e) => updateSettings({ footerText: e.target.value })} />
                  </AField>
                </div>
              </ACard>

              <ACard>
                <h3 className="font-display text-[15px] font-bold text-white">Contact details</h3>
                <p className="mt-1 text-[11px] text-faint">Used in the navbar, contact page, footer and all WhatsApp buttons across the site.</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <AField label="Email address"><div className="relative"><Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" /><AInput className="!pl-10" value={s.email} onChange={(e) => updateSettings({ email: e.target.value })} /></div></AField>
                  <AField label="Phone number"><div className="relative"><Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" /><AInput className="!pl-10" value={s.phone} onChange={(e) => updateSettings({ phone: e.target.value })} /></div></AField>
                  <AField label="WhatsApp number (with country code, digits only)" hint="e.g. 919876543210 — powers every WhatsApp button & chat link.">
                    <AInput value={s.whatsapp} onChange={(e) => updateSettings({ whatsapp: e.target.value.replace(/[^\d]/g, "") })} placeholder="919876543210" />
                  </AField>
                  <AField label="Business hours"><div className="relative"><Clock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" /><AInput className="!pl-10" value={s.hours} onChange={(e) => updateSettings({ hours: e.target.value })} /></div></AField>
                </div>
                <div className="mt-4 grid gap-4">
                  <AField label="Office address"><div className="relative"><MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-faint" /><ATextarea className="!min-h-[64px] !pl-10" value={s.address} onChange={(e) => updateSettings({ address: e.target.value })} /></div></AField>
                  <AField label="Google Maps embed URL" hint='Google Maps → Share → Embed a map → copy the "src" URL.'>
                    <div className="relative"><Globe className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" /><AInput className="!pl-10" value={s.mapUrl} onChange={(e) => updateSettings({ mapUrl: e.target.value })} /></div>
                  </AField>
                  <AField label="Calendly / booking calendar URL (optional)"><div className="relative"><CalendarCheck className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" /><AInput className="!pl-10" value={s.calendlyUrl} onChange={(e) => updateSettings({ calendlyUrl: e.target.value })} placeholder="https://calendly.com/wavexo/30min" /></div></AField>
                </div>
              </ACard>
              <AButton onClick={() => done("Brand & contact details")}><Save className="h-4 w-4" /> Save & publish</AButton>
            </div>
          )}

          {/* ---------------- SOCIAL ---------------- */}
          {tab === "social" && (
            <div className="space-y-5">
              <ACard>
                <h3 className="font-display text-[15px] font-bold text-white">Social media profiles</h3>
                <p className="mt-1 text-[11px] text-faint">Leave blank to hide an icon. Shown in the footer and contact page.</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {(Object.keys(s.socials) as (keyof typeof s.socials)[]).map((k) => (
                    <AField key={k} label={k.charAt(0).toUpperCase() + k.slice(1)}>
                      <AInput value={s.socials[k]} onChange={(e) => updateSettings({ socials: { ...s.socials, [k]: e.target.value } })} placeholder={`https://${k}.com/yourpage`} />
                    </AField>
                  ))}
                </div>
              </ACard>
              <AButton onClick={() => done("Social links")}><Save className="h-4 w-4" /> Save & publish</AButton>
            </div>
          )}

          {/* ---------------- OFFERS ---------------- */}
          {tab === "offers" && (
            <div className="space-y-5">
              <ACard>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-display text-[15px] font-bold text-white">Announcement / offer bar</h3>
                    <p className="mt-1 text-[11px] text-faint">A slim gradient banner above the navbar — perfect for limited-time offers, discounts and announcements.</p>
                  </div>
                  <AToggle checked={s.announcement.enabled} onChange={(v) => { updateSettings({ announcement: { ...s.announcement, enabled: v } }); toast(v ? "Offer bar is now LIVE" : "Offer bar hidden"); }} label={s.announcement.enabled ? "Live" : "Hidden"} />
                </div>
                <div className="mt-5 space-y-4">
                  <AField label="Offer text"><AInput value={s.announcement.text} onChange={(e) => updateSettings({ announcement: { ...s.announcement, text: e.target.value } })} placeholder="Diwali offer: 30% off all packages this week!" /></AField>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <AField label="Button text"><AInput value={s.announcement.cta} onChange={(e) => updateSettings({ announcement: { ...s.announcement, cta: e.target.value } })} placeholder="Claim Offer" /></AField>
                    <AField label="Button link"><AInput value={s.announcement.href} onChange={(e) => updateSettings({ announcement: { ...s.announcement, href: e.target.value } })} placeholder="/contact or /pricing" /></AField>
                  </div>
                </div>
              </ACard>

              {/* live preview */}
              <ACard>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">Live preview</p>
                {s.announcement.enabled ? (
                  <div className="mt-3 rounded-xl bg-gradient-to-r from-electric/90 via-violetx/90 to-magentax/90 px-4 py-2.5 text-center">
                    <p className="truncate text-xs font-medium text-white">{s.announcement.text || "Your offer text here…"}
                      <span className="ml-3 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold">{s.announcement.cta}</span>
                    </p>
                  </div>
                ) : (
                  <p className="mt-3 rounded-xl border border-dashed border-white/12 px-4 py-5 text-center text-xs text-faint">Offer bar is currently hidden on the website.</p>
                )}
              </ACard>

              <ACard>
                <h3 className="font-display text-[15px] font-bold text-white">More places to add offers</h3>
                <ul className="mt-3 space-y-2.5 text-[13px] text-mist">
                  <li>→ Discount pricing? Edit plans in <b className="text-white">Pricing & Plans</b> (add a "Limited Offer" badge)</li>
                  <li>→ Seasonal banners? Upload images in <b className="text-white">Media Library</b> and use them in blog or portfolio</li>
                  <li>→ Flash deals? Announce them in the <b className="text-white">Blog</b> and link from the offer bar</li>
                </ul>
              </ACard>
              <AButton onClick={() => done("Offer bar")}><Save className="h-4 w-4" /> Save & publish</AButton>
            </div>
          )}

          {/* ---------------- HERO ---------------- */}
          {tab === "hero" && (
            <div className="space-y-5">
              <ACard>
                <h3 className="font-display text-[15px] font-bold text-white">Headline builder</h3>
                <p className="mt-1 text-[11px] text-faint">The big headline on the homepage. Gradient fields appear highlighted: "We Help Businesses <b className="text-white">Grow</b> With <b className="text-white">Digital Marketing & Technology</b>."</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <AField label="Badge text"><AInput value={h.badge} onChange={(e) => updateHero({ badge: e.target.value })} /></AField>
                  <AField label="Opening (before highlight)"><AInput value={h.headingStart} onChange={(e) => updateHero({ headingStart: e.target.value })} /></AField>
                  <AField label="Highlight 1 (gradient)"><AInput value={h.grad1} onChange={(e) => updateHero({ grad1: e.target.value })} /></AField>
                  <AField label="Connector word"><AInput value={h.headingMiddle} onChange={(e) => updateHero({ headingMiddle: e.target.value })} /></AField>
                  <AField label="Highlight 2 (gradient)"><AInput value={h.grad2} onChange={(e) => updateHero({ grad2: e.target.value })} /></AField>
                  <AField label="Ending punctuation"><AInput value={h.headingEnd} onChange={(e) => updateHero({ headingEnd: e.target.value })} /></AField>
                </div>
                <div className="mt-4">
                  <AField label="Subtitle"><ATextarea value={h.subtitle} onChange={(e) => updateHero({ subtitle: e.target.value })} /></AField>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <AField label="Primary button"><AInput value={h.primaryCta} onChange={(e) => updateHero({ primaryCta: e.target.value })} /></AField>
                  <AField label="Secondary button"><AInput value={h.secondaryCta} onChange={(e) => updateHero({ secondaryCta: e.target.value })} /></AField>
                </div>
              </ACard>

              <ACard>
                <h3 className="font-display text-[15px] font-bold text-white">Trust line (comma separated)</h3>
                <AInput className="mt-3" value={h.trustItems.join(", ")} onChange={(e) => updateHero({ trustItems: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) })} placeholder="Strategy, Creativity, Technology, Growth" />
              </ACard>

              <ACard>
                <h3 className="font-display text-[15px] font-bold text-white">Floating stat cards (desktop hero)</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <AField label="Card 1 label"><AInput value={h.cardOneLabel} onChange={(e) => updateHero({ cardOneLabel: e.target.value })} /></AField>
                  <AField label="Card 1 value"><AInput value={h.cardOneValue} onChange={(e) => updateHero({ cardOneValue: e.target.value })} /></AField>
                  <AField label="Card 2 label"><AInput value={h.cardTwoLabel} onChange={(e) => updateHero({ cardTwoLabel: e.target.value })} /></AField>
                  <AField label="Card 2 value"><AInput value={h.cardTwoValue} onChange={(e) => updateHero({ cardTwoValue: e.target.value })} /></AField>
                </div>
              </ACard>
              <AButton onClick={() => done("Homepage hero")}><Save className="h-4 w-4" /> Save & publish</AButton>
            </div>
          )}

          {/* ---------------- METRICS & TRUST ---------------- */}
          {tab === "metrics" && (
            <div className="space-y-5">
              <ACard>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-display text-[15px] font-bold text-white">Animated numbers strip</h3>
                    <p className="mt-1 text-[11px] text-faint">Only show numbers you can stand behind — they build (or break) trust.</p>
                  </div>
                  <AToggle checked={s.showStats} onChange={(v) => updateSettings({ showStats: v })} label={s.showStats ? "Visible" : "Hidden"} />
                </div>
                <div className="mt-4 space-y-2.5">
                  {content.metrics.map((m, i) => (
                    <div key={i} className="grid grid-cols-[1fr_100px_80px] gap-2">
                      <AInput value={m.label} placeholder="Label" onChange={(e) => save({ metrics: content.metrics.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)) })} />
                      <AInput type="number" value={m.value} placeholder="Value" onChange={(e) => save({ metrics: content.metrics.map((x, j) => (j === i ? { ...x, value: Number(e.target.value) } : x)) })} />
                      <AInput value={m.suffix} placeholder="Suffix" onChange={(e) => save({ metrics: content.metrics.map((x, j) => (j === i ? { ...x, suffix: e.target.value } : x)) })} />
                    </div>
                  ))}
                  <AButton variant="ghost" onClick={() => save({ metrics: [...content.metrics, { label: "New Metric", value: 100, suffix: "+" } as Metric] })}>+ Add metric</AButton>
                </div>
              </ACard>

              <ACard>
                <h3 className="font-display text-[15px] font-bold text-white">"Trusted by" marquee names</h3>
                <p className="mt-1 text-[11px] text-faint">Replace these placeholders with your real client names — honesty here converts better than stock logos.</p>
                <div className="mt-4">
                  <ListEditor
                    items={content.trustedBy.map((t) => t.name)}
                    onChange={(names) => save({ trustedBy: names.map((name, i) => ({ id: content.trustedBy[i]?.id || newId(), name })) })}
                    placeholder="Client name"
                  />
                </div>
              </ACard>
              <AButton onClick={() => done("Metrics & trust")}><Save className="h-4 w-4" /> Save & publish</AButton>
            </div>
          )}
        </Guard>
      </div>
    </div>
  );
}
