import { Link } from "react-router-dom";
import { ShieldCheck, FileText, RefreshCcw } from "lucide-react";
import { useCMS, publishedSorted } from "../lib/store";
import { useSeo } from "../lib/seo";
import { Reveal, Accordion } from "../components/ui";
import { Section } from "../components/fx";
import { PageHero, FinalCta } from "../components/sections";

/* ---------------- FAQs page ---------------- */

export function FaqPage() {
  const { content } = useCMS();
  const faqs = publishedSorted(content.faqs);
  useSeo("/faqs", "FAQs | Wavexo", faqs.length ? {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  } : undefined);

  return (
    <>
      <PageHero
        eyebrow="FAQs"
        crumb="FAQs"
        title={<>Everything You're <span className="text-gradient">Wondering</span>.</>}
        sub="Straight answers about services, timelines, pricing and how we work. These are updated regularly by our team."
      />
      <Section className="mt-2">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <Accordion items={faqs.map((f) => ({ id: f.id, q: f.q, a: f.a }))} />
          </Reveal>
        </div>
      </Section>
      <Section className="mt-24"><FinalCta title={<>Still Have <span className="text-gradient">Questions?</span></>} sub="Ask us directly — no bots (unless you count our WhatsApp assistant)." /></Section>
    </>
  );
}

/* ---------------- legal pages ---------------- */

type LegalKind = "privacy" | "terms" | "refund";

const LEGAL: Record<LegalKind, { icon: typeof ShieldCheck; title: string; crumb: string; updated: string; blocks: { h: string; p: string }[] }> = {
  privacy: {
    icon: ShieldCheck,
    title: "Privacy Policy",
    crumb: "Privacy Policy",
    updated: "Last updated: January 2026",
    blocks: [
      { h: "What we collect", p: "When you contact Wavexo — through forms, WhatsApp, email or consultation booking — we collect the details you share: name, email, phone number, company, website and project information. We also collect anonymous analytics (pages visited, device type, approximate location) to improve this website." },
      { h: "How we use it", p: "Your information is used only to respond to your inquiry, deliver services, share requested resources (like your free audit) and — with your consent — occasional growth tips by email. We never sell, rent or trade your personal data to third parties." },
      { h: "Cookies & tracking", p: "We use essential cookies and optional analytics tools (Google Analytics 4, Meta Pixel — only when configured by the site owner) to understand usage. You can accept or decline non-essential cookies via the consent banner, and your choice is respected." },
      { h: "Data storage & security", p: "Form submissions are stored in our secured systems with access limited to authorized team members. We apply industry-standard safeguards including HTTPS, access controls and activity logging. Data is retained only as long as needed for the purposes above or as required by law." },
      { h: "Your rights", p: "You may request access, correction or deletion of your personal data at any time by emailing us. We respond to all privacy requests within 7 business days. You may also opt out of marketing emails with one click." },
      { h: "Contact", p: "For any privacy question, contact us using the details on our Contact page. If this policy changes, the updated version will be posted here with a new revision date." },
    ],
  },
  terms: {
    icon: FileText,
    title: "Terms & Conditions",
    crumb: "Terms & Conditions",
    updated: "Last updated: January 2026",
    blocks: [
      { h: "Services", p: "Wavexo provides digital marketing, website development, WhatsApp automation, e-commerce management and advertising services. The specific scope, deliverables, timelines and fees for any engagement are defined in a written proposal or agreement shared before work begins." },
      { h: "Client responsibilities", p: "You agree to provide accurate business information, timely feedback, required access (analytics, ad accounts, website) and approvals needed to execute your project. Delays in inputs may shift timelines proportionally." },
      { h: "Intellectual property", p: "Upon full payment, all deliverables created specifically for your project — designs, websites, creatives, copy and automation workflows — are owned by you. Wavexo retains the right to showcase non-confidential work in our portfolio unless you request otherwise in writing." },
      { h: "Payments", p: "Invoices are due as per the agreed schedule (typically 50% advance for projects, monthly in advance for retainers). Late payments may pause work. All third-party costs (ad spend, tools, subscriptions) are billed separately at actuals." },
      { h: "Results disclaimer", p: "We commit to best-in-class process, transparency and effort. Marketing outcomes depend on factors outside any agency's control (market, competition, budget, product). We do not guarantee specific rankings, revenue or returns, and no verbal assurance overrides this clause." },
      { h: "Liability", p: "To the maximum extent permitted by law, Wavexo's total liability for any claim is limited to the fees paid for the service giving rise to the claim in the 3 months preceding it. We are not liable for indirect or consequential losses." },
      { h: "Governing terms", p: "These terms are governed by the laws of India, with jurisdiction in Gurugram, Haryana. If any provision is found unenforceable, the remainder stays in effect." },
    ],
  },
  refund: {
    icon: RefreshCcw,
    title: "Refund Policy",
    crumb: "Refund Policy",
    updated: "Last updated: January 2026",
    blocks: [
      { h: "Our fairness promise", p: "We want you to feel safe working with us. This policy explains exactly when refunds apply — in plain language, because fine print is where trust goes to die." },
      { h: "Project work (websites, setup)", p: "If you cancel before work begins, your advance is refunded in full minus any payment-gateway fees. Once work has begun, refunds are prorated based on delivered milestones. If we fail to deliver an agreed milestone on our side, you are entitled to a full refund of the amount paid for that milestone." },
      { h: "Monthly retainers (SEO, ads, management)", p: "Retainers are billed monthly in advance and can be cancelled anytime with 7 days' notice — no lock-ins. If we miss the agreed scope in any month, tell us within 5 days of the report and we will either redo the work or credit/refund the affected portion, your choice." },
      { h: "First-cycle satisfaction window", p: "New retainer clients get a 14-day satisfaction window in their first cycle: if you feel the engagement isn't right, let us know within 14 days of kickoff and we'll refund the un-consumed portion of the first month's fee." },
      { h: "Non-refundable items", p: "Third-party costs paid on your behalf (advertising spend, domain, hosting, software subscriptions, stock assets) are non-refundable once incurred, as they are paid to external platforms." },
      { h: "How to request", p: "Email us from your registered email address with your invoice number. Approved refunds are processed within 7–10 business days to the original payment method." },
    ],
  },
};

export function LegalPage({ kind }: { kind: LegalKind }) {
  const doc = LEGAL[kind];
  const { content } = useCMS();
  useSeo("", `${doc.title} | Wavexo`);

  return (
    <>
      <PageHero
        eyebrow={doc.crumb}
        crumb={doc.crumb}
        title={<span className="flex flex-wrap items-center gap-4"><doc.icon className="h-10 w-10 text-cyan-300" strokeWidth={1.6} /> {doc.title}</span>}
        sub={`${doc.updated} · Questions? Write to ${content.settings.email}`}
      />
      <Section className="mt-2">
        <div className="mx-auto max-w-3xl space-y-4">
          {doc.blocks.map((b, i) => (
            <Reveal key={b.h} delay={i * 0.04}>
              <div className="rounded-3xl border border-white/[0.08] bg-white/[0.03] p-7">
                <h2 className="font-display text-lg font-bold text-white"><span className="text-gradient mr-2">{String(i + 1).padStart(2, "0")}</span>{b.h}</h2>
                <p className="mt-3 text-sm leading-[1.8] text-mist">{b.p}</p>
              </div>
            </Reveal>
          ))}
          <Reveal delay={0.2}>
            <p className="pt-4 text-center text-sm text-faint">
              Related documents: <Link to="/privacy" className="text-cyan-300 hover:text-white">Privacy</Link> · <Link to="/terms" className="text-cyan-300 hover:text-white">Terms</Link> · <Link to="/refund" className="text-cyan-300 hover:text-white">Refunds</Link>
            </p>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
