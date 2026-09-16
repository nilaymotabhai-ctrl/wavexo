import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Clock, Paperclip, CalendarCheck, X } from "lucide-react";
import { useCMS, publishedSorted, waLink } from "../lib/store";
import { useSeo } from "../lib/seo";
import { GradientButton, WhatsAppIcon, SocialIcon, Reveal, Stagger, StaggerItem, Field, inputCls, SubmitButton, FormSuccess, HoneyPot, cn } from "../components/ui";
import { Section } from "../components/fx";
import { PageHero } from "../components/sections";

const BUDGETS = ["Under ₹25k", "₹25k – ₹50k", "₹50k – ₹1L", "₹1L – ₹3L", "₹3L+", "Let's discuss"];

function ContactForm() {
  const { content, addLead } = useCMS();
  const services = publishedSorted(content.services);
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", service: "", budget: "", message: "" });
  const [file, setFile] = useState<{ name: string; size: number } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [bot, setBot] = useState("");
  const [fail, setFail] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (k: string, v: string) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: "" })); };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bot) return;
    const errs: Record<string, string> = {};
    if (form.name.trim().length < 2) errs.name = "Please enter your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email";
    if (form.phone.replace(/\D/g, "").length < 8) errs.phone = "Enter a valid number";
    if (!form.service) errs.service = "Select a service";
    if (!form.message.trim()) errs.message = "Tell us a little about your project";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    setFail("");
    try {
      setTimeout(() => {
        addLead({
          name: form.name.trim(), email: form.email, phone: form.phone, company: form.company,
          service: form.service, budget: form.budget, message: form.message, source: "contact",
          attachmentName: file?.name,
        });
        setLoading(false);
        setDone(true);
      }, 900);
    } catch {
      setLoading(false);
      setFail("Submission failed. Please try again or message us on WhatsApp.");
    }
  };

  if (done) return <FormSuccess title="Message received!" message="Thanks for reaching out — a Wavexo strategist will reply within one business day (usually much faster)." />;

  return (
    <form onSubmit={submit} noValidate className="relative space-y-4">
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
        <Field label="Company name" optional>
          <input className={inputCls} placeholder="Your company" value={form.company} onChange={(e) => set("company", e.target.value)} />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Service interested in" error={errors.service}>
          <select className={inputCls + " appearance-none"} value={form.service} onChange={(e) => set("service", e.target.value)}>
            <option value="" className="bg-midnight">Select…</option>
            {services.map((s) => <option key={s.id} value={s.title} className="bg-midnight">{s.title}</option>)}
            <option value="Multiple / Not sure" className="bg-midnight">Multiple / Not sure</option>
          </select>
        </Field>
        <Field label="Budget range" optional>
          <select className={inputCls + " appearance-none"} value={form.budget} onChange={(e) => set("budget", e.target.value)}>
            <option value="" className="bg-midnight">Select…</option>
            {BUDGETS.map((b) => <option key={b} value={b} className="bg-midnight">{b}</option>)}
          </select>
        </Field>
      </div>
      <Field label="Your message" error={errors.message}>
        <textarea className={inputCls + " min-h-[110px] resize-none"} placeholder="What are you trying to achieve? Any timeline?" value={form.message} onChange={(e) => set("message", e.target.value)} />
      </Field>

      {/* file attachment */}
      <div>
        <input ref={fileRef} type="file" className="hidden" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f && f.size < 2_000_000) setFile({ name: f.name, size: f.size });
          }} />
        {file ? (
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white">
            <span className="flex items-center gap-2 truncate"><Paperclip className="h-4 w-4 text-cyan-300" />{file.name} <span className="text-xs text-faint">({Math.round(file.size / 1024)} KB)</span></span>
            <button type="button" onClick={() => setFile(null)} aria-label="Remove file" className="text-faint hover:text-white"><X className="h-4 w-4" /></button>
          </div>
        ) : (
          <button type="button" onClick={() => fileRef.current?.click()}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-4 py-3.5 text-[13px] font-medium text-mist transition hover:border-cyanx/40 hover:text-white">
            <Paperclip className="h-4 w-4" /> Attach a brief or file (PDF, DOC, image · max 2MB)
          </button>
        )}
      </div>

      {fail && <p className="text-xs text-rose-400">{fail}</p>}
      <SubmitButton loading={loading}>Send Message</SubmitButton>
    </form>
  );
}

export default function Contact() {
  const { content } = useCMS();
  const s = content.settings;
  useSeo("/contact", "Contact Wavexo — Let's Talk Growth");

  const cards = [
    { icon: Mail, label: "Email us", value: s.email, href: `mailto:${s.email}`, grad: "from-cyanx to-electric" },
    { icon: Phone, label: "Call us", value: s.phone, href: `tel:${s.phone.replace(/\s/g, "")}`, grad: "from-electric to-violetx" },
    { icon: MapPin, label: "Visit us", value: s.address, grad: "from-violetx to-magentax" },
    { icon: Clock, label: "Business hours", value: s.hours, grad: "from-magentax to-cyanx" },
  ];

  return (
    <>
      <PageHero
        eyebrow="Contact"
        crumb="Contact"
        title={<>Let's Talk About <span className="text-gradient">Your Growth</span>.</>}
        sub="Tell us where you are and where you want to be. A strategist — not a salesperson — will reply within one business day."
      />

      <Section className="mt-4">
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          {/* form */}
          <Reveal>
            <div className="g-border rounded-[30px] bg-midnight/50 p-7 backdrop-blur sm:p-10">
              <h2 className="font-display text-2xl font-bold text-white">Send us a message</h2>
              <p className="mt-2 text-sm text-mist">Every submission lands directly in our team dashboard.</p>
              <div className="mt-8"><ContactForm /></div>
            </div>
          </Reveal>

          {/* info cards */}
          <Stagger className="space-y-4" step={0.08}>
            {cards.map((c) => (
              <StaggerItem key={c.label}>
                <div className="card-glow flex items-center gap-4 rounded-3xl border border-white/[0.08] bg-white/[0.03] p-5">
                  <span className={cn("grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-white", c.grad)}>
                    <c.icon className="h-5 w-5" strokeWidth={1.8} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">{c.label}</p>
                    {c.href ? (
                      <a href={c.href} className="mt-0.5 block truncate text-sm font-semibold text-white transition-colors hover:text-cyan-300">{c.value}</a>
                    ) : (
                      <p className="mt-0.5 text-sm font-semibold leading-snug text-white">{c.value}</p>
                    )}
                  </div>
                </div>
              </StaggerItem>
            ))}

            <StaggerItem>
              <div className="rounded-3xl border border-emerald-400/25 bg-emerald-400/[0.05] p-6">
                <p className="font-display text-lg font-semibold text-white">Prefer instant?</p>
                <p className="mt-1 text-[13px] text-mist">WhatsApp is our fastest channel — usually a reply within minutes during business hours.</p>
                {s.whatsapp && (
                  <GradientButton variant="whatsapp" className="mt-4 w-full" href={waLink(s.whatsapp, "Hi Wavexo! I'd like to discuss a project.")}>
                    <WhatsAppIcon className="h-4 w-4" /> Chat on WhatsApp
                  </GradientButton>
                )}
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="rounded-3xl border border-white/[0.08] bg-white/[0.03] p-6">
                <p className="flex items-center gap-2 font-display text-lg font-semibold text-white">
                  <CalendarCheck className="h-5 w-5 text-cyan-300" /> Rather book a slot?
                </p>
                <p className="mt-1 text-[13px] text-mist">Pick a time that works and we'll come prepared with ideas.</p>
                <GradientButton to="/book" className="mt-4 w-full">Book a Free Consultation</GradientButton>
                {s.calendlyUrl && (
                  <a href={s.calendlyUrl} target="_blank" rel="noreferrer" className="mt-3 block text-center text-xs font-semibold text-cyan-300 underline underline-offset-4 hover:text-white">
                    or open our live calendar
                  </a>
                )}
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="flex items-center justify-between rounded-3xl border border-white/[0.08] bg-white/[0.03] px-6 py-5">
                <p className="text-sm font-semibold text-white">Follow the journey</p>
                <div className="flex gap-2">
                  {(Object.keys(s.socials) as (keyof typeof s.socials)[]).map((k) =>
                    s.socials[k] ? (
                      <a key={k} href={s.socials[k]} target="_blank" rel="noreferrer" aria-label={k}
                        className="glass-soft grid h-9 w-9 place-items-center rounded-full text-mist transition hover:text-white">
                        <SocialIcon name={k} className="h-3.5 w-3.5" />
                      </a>
                    ) : null
                  )}
                </div>
              </div>
            </StaggerItem>
          </Stagger>
        </div>
      </Section>

      {/* map */}
      <Section className="mt-16">
        <Reveal>
          <div className="g-border overflow-hidden rounded-[30px]">
            <iframe
              title="Wavexo office location"
              src={s.mapUrl}
              loading="lazy"
              className="h-[380px] w-full grayscale-[35%] invert-[92%] hue-rotate-180 contrast-[0.9]"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <p className="mt-4 text-center text-xs text-faint">
            {s.address} · <Link to="/book" className="text-cyan-300 underline underline-offset-4">Book a visit or video call</Link>
          </p>
        </Reveal>
      </Section>
    </>
  );
}
