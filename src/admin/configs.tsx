import { useState } from "react";
import { LayoutGrid, ListChecks, Workflow } from "lucide-react";
import { CollectionManager, CollectionConfig } from "./manager";
import { cn } from "../utils/cn";

/* ---------------- services ---------------- */

const SERVICES: CollectionConfig = {
  key: "services",
  title: "Services",
  singular: "Service",
  desc: "The five growth services shown on the homepage, services page and detail pages. Each gets its own SEO-ready page.",
  fields: [
    { key: "title", label: "Service name", type: "text" },
    { key: "slug", label: "URL slug", type: "text", hint: "Leave blank to auto-generate. e.g. seo-services" },
    { key: "category", label: "Category label", type: "text" },
    { key: "ctaText", label: "CTA button text", type: "text" },
    { key: "icon", label: "Icon", type: "icon" },
    { key: "accent", label: "Accent color", type: "accent" },
    { key: "short", label: "Short description (cards)", type: "textarea" },
    { key: "description", label: "Full description (hero)", type: "textarea" },
    { key: "problem", label: "Problem statement", type: "textarea" },
    { key: "features", label: "Features / what's included", type: "list" },
    { key: "benefits", label: "Benefits (outcomes)", type: "list" },
    { key: "deliverables", label: "Deliverables", type: "list" },
    { key: "tools", label: "Tools & platforms", type: "list" },
    { key: "process", label: "Process steps", type: "list" },
    { key: "faqs", label: "Service FAQs", type: "pairs", pairsLabels: ["Question", "Answer"], pairsKeys: ["q", "a"] },
    { key: "seo", label: "SEO metadata", type: "seo" },
    { key: "published", label: "Published (visible on site)", type: "toggle" },
  ],
  blank: () => ({
    title: "", slug: "", category: "Growth", icon: "sparkles", accent: "cyan", short: "", description: "",
    problem: "", features: [], benefits: [], deliverables: [], tools: [], process: [], faqs: [],
    ctaText: "Learn More", published: true, seo: { title: "", description: "", keywords: "" },
  }),
  itemTitle: (s) => s.title,
  itemSub: (s) => `${s.category} · ${s.features?.length || 0} features · /services/${s.slug}`,
};

/* ---------------- pricing ---------------- */

const PRICING: CollectionConfig = {
  key: "pricing",
  title: "Pricing & Plans",
  singular: "Plan",
  desc: 'Update prices, features and badges anytime. Use "Custom Quote" as price to hide numbers.',
  fields: [
    { key: "name", label: "Plan name", type: "text" },
    { key: "price", label: "Price (or 'Custom Quote')", type: "text" },
    { key: "period", label: "Billing period (e.g. /month)", type: "text" },
    { key: "badge", label: "Badge text (optional)", type: "text" },
    { key: "tagline", label: "Tagline", type: "textarea" },
    { key: "features", label: "Features included", type: "list" },
    { key: "cta", label: "Button text", type: "text" },
    { key: "recommended", label: "Highlight as recommended", type: "toggle" },
    { key: "published", label: "Published", type: "toggle" },
  ],
  blank: () => ({ name: "", price: "Custom Quote", period: "/month", tagline: "", features: [], cta: "Get Started", badge: "", recommended: false, published: true }),
  itemTitle: (p) => p.name,
  itemSub: (p) => `${p.price}${p.period} · ${p.features?.length || 0} features${p.recommended ? " · Recommended" : ""}`,
};

/* ---------------- portfolio ---------------- */

const PORTFOLIO: CollectionConfig = {
  key: "portfolio",
  title: "Portfolio",
  singular: "Project",
  desc: "Filterable work gallery — add covers from the Media Library or upload directly (auto WebP).",
  fields: [
    { key: "title", label: "Project title", type: "text" },
    { key: "client", label: "Client name", type: "text" },
    { key: "category", label: "Category (filter)", type: "select", options: ["seo", "web", "ecommerce", "whatsapp", "meta-ads"] },
    { key: "industry", label: "Industry", type: "text" },
    { key: "cover", label: "Cover image", type: "image" },
    { key: "description", label: "Project description", type: "textarea" },
    { key: "services", label: "Services provided", type: "list" },
    { key: "results", label: "Key results", type: "list" },
    { key: "url", label: "Project URL (optional)", type: "text" },
    { key: "featured", label: "Featured project", type: "toggle" },
    { key: "published", label: "Published", type: "toggle" },
  ],
  blank: () => ({ title: "", client: "", category: "web", industry: "", cover: "", description: "", services: [], results: [], url: "", featured: false, published: true }),
  itemTitle: (p) => p.title,
  itemSub: (p) => `${p.client} · ${p.category} · ${p.industry}`,
  itemImage: (p) => p.cover,
};

/* ---------------- case studies ---------------- */

const CASES: CollectionConfig = {
  key: "caseStudies",
  title: "Case Studies",
  singular: "Case Study",
  desc: "Deep-dive result stories with challenge → strategy → solution and editable metrics.",
  fields: [
    { key: "title", label: "Title", type: "text" },
    { key: "client", label: "Client", type: "text" },
    { key: "industry", label: "Industry", type: "text" },
    { key: "quote", label: "Client quote", type: "text" },
    { key: "image", label: "Cover image", type: "image" },
    { key: "services", label: "Services delivered", type: "list" },
    { key: "challenge", label: "Challenge", type: "textarea" },
    { key: "strategy", label: "Strategy", type: "textarea" },
    { key: "solution", label: "Solution", type: "textarea" },
    { key: "metrics", label: "Performance metrics", type: "pairs", pairsLabels: ["Metric label", "Value (e.g. +186%)"], pairsKeys: ["label", "value"] },
    { key: "before", label: "Before value (0–100 bar)", type: "number" },
    { key: "after", label: "After value (0–100 bar)", type: "number" },
    { key: "beforeLabel", label: "Before label", type: "text" },
    { key: "afterLabel", label: "After label", type: "text" },
    { key: "published", label: "Published", type: "toggle" },
  ],
  blank: () => ({
    title: "", client: "", industry: "", quote: "", image: "", services: [], challenge: "", strategy: "", solution: "",
    metrics: [], before: 30, after: 85, beforeLabel: "Before", afterLabel: "After", published: true,
  }),
  itemTitle: (c) => c.title,
  itemSub: (c) => `${c.client} · ${c.industry}`,
  itemImage: (c) => c.image,
};

/* ---------------- blog ---------------- */

const BLOG: CollectionConfig = {
  key: "blog",
  title: "Blog & Resources",
  singular: "Post",
  desc: 'Write articles with "## headings" and paragraphs. Save as draft, schedule or publish.',
  fields: [
    { key: "title", label: "Post title", type: "text" },
    { key: "slug", label: "URL slug (blank = auto)", type: "text" },
    { key: "author", label: "Author", type: "text" },
    { key: "category", label: "Category", type: "text" },
    { key: "image", label: "Featured image", type: "image" },
    { key: "excerpt", label: "Excerpt", type: "textarea" },
    { key: "content", label: "Content (## for headings, blank line between paragraphs)", type: "textarea" },
    { key: "tags", label: "Tags", type: "list" },
    { key: "date", label: "Publish date", type: "date" },
    { key: "readTime", label: "Read time (e.g. 5 min read)", type: "text" },
    { key: "status", label: "Status", type: "select", options: ["published", "draft", "scheduled"] },
    { key: "seo", label: "SEO metadata", type: "seo" },
  ],
  blank: () => ({
    title: "", slug: "", author: "Wavexo Team", category: "Growth", image: "", excerpt: "", content: "",
    tags: [], date: new Date().toISOString().slice(0, 10), readTime: "5 min read", status: "draft",
    seo: { title: "", description: "", keywords: "" },
  }),
  itemTitle: (b) => b.title,
  itemSub: (b) => `${b.category} · ${b.status} · ${b.date}`,
  itemImage: (b) => b.image,
  publishField: "status",
};

/* ---------------- testimonials ---------------- */

const TESTIMONIALS: CollectionConfig = {
  key: "testimonials",
  title: "Testimonials",
  singular: "Testimonial",
  desc: "Real client quotes for the homepage carousel. Reorder with the arrows; hide anytime.",
  fields: [
    { key: "name", label: "Client name", type: "text" },
    { key: "role", label: "Designation", type: "text" },
    { key: "company", label: "Company", type: "text" },
    { key: "rating", label: "Rating (1–5)", type: "number" },
    { key: "text", label: "Testimonial", type: "textarea" },
    { key: "image", label: "Profile photo (optional)", type: "image" },
    { key: "published", label: "Published", type: "toggle" },
  ],
  blank: () => ({ name: "", role: "", company: "", rating: 5, text: "", image: "", published: true }),
  itemTitle: (t) => t.name,
  itemSub: (t) => `${t.role} · ${t.company} · ${"★".repeat(t.rating || 5)}`,
  itemImage: (t) => t.image,
};

/* ---------------- faqs ---------------- */

const FAQS: CollectionConfig = {
  key: "faqs",
  title: "FAQs",
  singular: "FAQ",
  desc: "Questions shown on the homepage and /faqs page (with FAQ schema for Google).",
  fields: [
    { key: "q", label: "Question", type: "text" },
    { key: "a", label: "Answer", type: "textarea" },
    { key: "published", label: "Published", type: "toggle" },
  ],
  blank: () => ({ q: "", a: "", published: true }),
  itemTitle: (f) => f.q,
  itemSub: (f) => (f.a || "").slice(0, 80) + "…",
};

/* ---------------- team ---------------- */

const TEAM: CollectionConfig = {
  key: "team",
  title: "Team Members",
  singular: "Member",
  desc: "People shown on the About page. Add photos, roles and social links.",
  fields: [
    { key: "name", label: "Full name", type: "text" },
    { key: "role", label: "Role", type: "text" },
    { key: "image", label: "Profile photo", type: "image" },
    { key: "bio", label: "Short bio", type: "textarea" },
    { key: "linkedin", label: "LinkedIn URL", type: "text" },
    { key: "twitter", label: "X / Twitter URL", type: "text" },
    { key: "email", label: "Email (optional)", type: "text" },
    { key: "published", label: "Published", type: "toggle" },
  ],
  blank: () => ({ name: "", role: "", image: "", bio: "", linkedin: "", twitter: "", email: "", published: true }),
  itemTitle: (t) => t.name,
  itemSub: (t) => t.role,
  itemImage: (t) => t.image,
};

/* ---------------- homepage sections (industries / why / process) ---------------- */

const INDUSTRIES: CollectionConfig = {
  key: "industries",
  title: "Industries",
  singular: "Industry",
  desc: '"Built for Ambitious Businesses" grid on the homepage.',
  fields: [
    { key: "name", label: "Industry name", type: "text" },
    { key: "icon", label: "Icon", type: "icon" },
    { key: "desc", label: "Short description", type: "textarea" },
    { key: "published", label: "Published", type: "toggle" },
  ],
  blank: () => ({ name: "", icon: "briefcase", desc: "", published: true }),
  itemTitle: (i) => i.name,
};

const WHY: CollectionConfig = {
  key: "whyFeatures",
  title: "Why Choose Us",
  singular: "Reason",
  desc: 'The six "Why Businesses Choose Wavexo" cards.',
  fields: [
    { key: "title", label: "Title", type: "text" },
    { key: "icon", label: "Icon", type: "icon" },
    { key: "desc", label: "Description", type: "textarea" },
  ],
  blank: () => ({ title: "", icon: "sparkles", desc: "" }),
  itemTitle: (w) => w.title,
};

const PROCESS_STEPS: CollectionConfig = {
  key: "process",
  title: "Process Steps",
  singular: "Step",
  desc: 'The "Discover → Scale" timeline on Home and Process pages.',
  fields: [
    { key: "title", label: "Step name", type: "text" },
    { key: "icon", label: "Icon", type: "icon" },
    { key: "desc", label: "What happens in this step", type: "textarea" },
  ],
  blank: () => ({ title: "", icon: "rocket", desc: "" }),
  itemTitle: (p) => p.title,
};

/* ---------------- exported pages ---------------- */

export const ServicesAdmin = () => <CollectionManager config={SERVICES} />;
export const PricingAdmin = () => <CollectionManager config={PRICING} />;
export const PortfolioAdmin = () => <CollectionManager config={PORTFOLIO} />;
export const CaseStudiesAdmin = () => <CollectionManager config={CASES} />;
export const BlogAdmin = () => <CollectionManager config={BLOG} />;
export const TestimonialsAdmin = () => <CollectionManager config={TESTIMONIALS} />;
export const FaqsAdmin = () => <CollectionManager config={FAQS} />;
export const TeamAdmin = () => <CollectionManager config={TEAM} />;

export function SectionsAdmin() {
  const [tab, setTab] = useState<"industries" | "why" | "process">("industries");
  const tabs = [
    { id: "industries", label: "Industries", icon: LayoutGrid, config: INDUSTRIES },
    { id: "why", label: "Why Choose Us", icon: ListChecks, config: WHY },
    { id: "process", label: "Process Steps", icon: Workflow, config: PROCESS_STEPS },
  ] as const;
  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={cn("inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-[13px] font-semibold transition",
              tab === t.id ? "border-transparent bg-gradient-to-r from-electric to-violetx text-white" : "border-white/10 bg-white/[0.04] text-mist hover:text-white")}>
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>
      {tab === "industries" && <CollectionManager config={INDUSTRIES} />}
      {tab === "why" && <CollectionManager config={WHY} />}
      {tab === "process" && <CollectionManager config={PROCESS_STEPS} />}
    </div>
  );
}
