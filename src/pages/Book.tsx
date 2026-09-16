import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Video, FileText, Map as MapIcon, CheckCircle2 } from "lucide-react";
import { useCMS, publishedSorted, initials } from "../lib/store";
import { useSeo } from "../lib/seo";
import { Reveal, Stars, Field, inputCls, SubmitButton, FormSuccess, HoneyPot, WhatsAppCta, cn } from "../components/ui";

const EXPECT = [
  { icon: Video, title: "A 30-minute strategy call", desc: "With a senior strategist — never a salesperson reading a script." },
  { icon: MapIcon, title: "A clear growth map", desc: "The 2–3 highest-leverage moves for your business right now." },
  { icon: FileText, title: "An honest quote", desc: "Exact scope, timeline and pricing — or a straight 'you don't need us yet'." },
];

export default function Book() {
  const { content, addLead } = useCMS();
  const [params] = useSearchParams();
  const services = publishedSorted(content.services);
  const t = content.testimonials.find((x) => x.published);
  useSeo("/book", "Book a Free Consultation | Wavexo");

  const [form, setForm] = useState({
    name: "", email: "", phone: "", company: "",
    service: params.get("service") || "",
    budget: "", date: "", time: "", message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [bot, setBot] = useState("");

  useState(() => {
    const plan = params.get("plan");
    if (plan && !form.message) setForm((f) => ({ ...f, service: "Not sure yet", message: `Interested in the ${plan} package.` }));
  });

  const set = (k: string, v: string) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: "" })); };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bot) return;
    const errs: Record<string, string> = {};
    if (form.name.trim().length < 2) errs.name = "Please enter your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email";
    if (form.phone.replace(/\D/g, "").length < 8) errs.phone = "Enter your WhatsApp number";
    if (!form.date) errs.date = "Pick a preferred date";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    setTimeout(() => {
      addLead({
        name: form.name.trim(), email: form.email, phone: form.phone, company: form.company,
        service: form.service || "Not sure yet", budget: form.budget, source: "consultation",
        message: `Preferred: ${form.date}${form.time ? ` · ${form.time}` : ""}${form.message ? ` — ${form.message}` : ""}`,
        followUp: form.date,
      });
      setLoading(false);
      setDone(true);
    }, 900);
  };

  return (
    <section className="relative overflow-hidden pb-10 pt-36 sm:pt-44">
      <div className="bg-grid absolute inset-0" aria-hidden />
      <div className="pointer-events-none absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-electric/20 blur-[140px]" aria-hidden />
      <div className="pointer-events-none absolute right-0 top-1/3 h-80 w-80 rounded-full bg-violetx/20 blur-[140px]" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr]">
          {/* left pitch */}
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
                <span className="relative flex h-2 w-2"><span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" /><span className="relative h-2 w-2 rounded-full bg-emerald-400" /></span>
                Slots available this week
              </span>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="font-display mt-6 text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
                Book Your <span className="text-gradient">Free Strategy Call</span>
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-mist">
                Thirty minutes. Zero pitch. You'll leave with a clear action plan whether you work with us or not — that's the deal.
              </p>
            </Reveal>

            <div className="mt-10 space-y-5">
              {EXPECT.map((x, i) => (
                <Reveal key={x.title} delay={0.2 + i * 0.08}>
                  <div className="flex items-start gap-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-electric/25 to-violetx/25 text-cyan-300">
                      <x.icon className="h-5 w-5" strokeWidth={1.8} />
                    </span>
                    <div>
                      <p className="font-semibold text-white">{x.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-mist">{x.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            {t && (
              <Reveal delay={0.45}>
                <figure className="glass mt-10 max-w-lg rounded-3xl p-6">
                  <Stars n={t.rating} />
                  <blockquote className="mt-3 text-sm leading-relaxed text-white/85">"{t.text}"</blockquote>
                  <figcaption className="mt-4 flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-electric to-violetx text-[11px] font-bold text-white">{initials(t.name)}</span>
                    <span className="text-xs text-mist">{t.name} · {t.role}, {t.company}</span>
                  </figcaption>
                </figure>
              </Reveal>
            )}
          </div>

          {/* right form */}
          <Reveal delay={0.15}>
            <div className="g-border relative rounded-[30px] bg-midnight/60 p-7 backdrop-blur sm:p-10">
              {done ? (
                <FormSuccess title="Consultation booked!" message="We've received your preferred slot and will confirm by email and WhatsApp shortly. Talk soon!" />
              ) : (
                <>
                  <h2 className="font-display text-2xl font-bold text-white">Pick your slot</h2>
                  <p className="mt-2 text-sm text-mist">We confirm every booking personally within a few hours.</p>
                  <form onSubmit={submit} noValidate className="relative mt-8 space-y-4">
                    <HoneyPot onChange={setBot} />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Full name" error={errors.name}>
                        <input className={inputCls} placeholder="Your name" value={form.name} onChange={(e) => set("name", e.target.value)} />
                      </Field>
                      <Field label="Email" error={errors.email}>
                        <input className={inputCls} type="email" placeholder="you@company.com" value={form.email} onChange={(e) => set("email", e.target.value)} />
                      </Field>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Phone / WhatsApp" error={errors.phone}>
                        <input className={inputCls} placeholder="+91 98765 43210" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
                      </Field>
                      <Field label="Company" optional>
                        <input className={inputCls} placeholder="Your company" value={form.company} onChange={(e) => set("company", e.target.value)} />
                      </Field>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="What do you want to discuss?" optional>
                        <select className={inputCls + " appearance-none"} value={form.service} onChange={(e) => set("service", e.target.value)}>
                          <option value="" className="bg-midnight">Select…</option>
                          {services.map((s) => <option key={s.id} value={s.title} className="bg-midnight">{s.title}</option>)}
                          <option value="Not sure yet" className="bg-midnight">Not sure yet — need guidance</option>
                        </select>
                      </Field>
                      <Field label="Budget range" optional>
                        <select className={inputCls + " appearance-none"} value={form.budget} onChange={(e) => set("budget", e.target.value)}>
                          <option value="" className="bg-midnight">Select…</option>
                          {["Under ₹25k", "₹25k – ₹50k", "₹50k – ₹1L", "₹1L – ₹3L", "₹3L+"].map((b) => <option key={b} value={b} className="bg-midnight">{b}</option>)}
                        </select>
                      </Field>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Preferred date" error={errors.date}>
                        <input type="date" min={new Date().toISOString().slice(0, 10)} className={cn(inputCls, "[color-scheme:dark]")} value={form.date} onChange={(e) => set("date", e.target.value)} />
                      </Field>
                      <Field label="Preferred time" optional>
                        <select className={inputCls + " appearance-none"} value={form.time} onChange={(e) => set("time", e.target.value)}>
                          <option value="" className="bg-midnight">Any time</option>
                          {["10:00 – 12:00", "12:00 – 14:00", "14:00 – 16:00", "16:00 – 19:00"].map((t2) => <option key={t2} value={t2} className="bg-midnight">{t2} IST</option>)}
                        </select>
                      </Field>
                    </div>
                    <Field label="Anything we should know?" optional>
                      <textarea className={inputCls + " min-h-[80px] resize-none"} placeholder="Current challenges, links, goals…" value={form.message} onChange={(e) => set("message", e.target.value)} />
                    </Field>
                    <SubmitButton loading={loading}>Confirm My Free Consultation</SubmitButton>
                    <div className="flex items-center gap-3 pt-1 text-[11px] text-faint">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> No payment. No obligation. Reschedule anytime.
                    </div>
                  </form>
                </>
              )}
              <div className="mt-6 border-t border-white/[0.07] pt-6">
                <WhatsAppCta label="Or skip the form — WhatsApp us" className="w-full" />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
