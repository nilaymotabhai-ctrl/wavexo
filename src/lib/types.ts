/* Wavexo CMS — content model. Every record here is editable from the Admin Panel. */

export interface SeoMeta {
  title: string;
  description: string;
  keywords: string;
  ogImage?: string;
  noIndex?: boolean;
}

export interface ServiceFaq { q: string; a: string }

export interface Service {
  id: string;
  slug: string;
  title: string;
  category: string;
  icon: string;
  accent: string; // tailwind gradient classes e.g. "from-cyan-400 to-blue-600"
  short: string;
  description: string;
  problem: string;
  features: string[];
  benefits: string[];
  deliverables: string[];
  tools: string[];
  process: string[];
  faqs: ServiceFaq[];
  ctaText: string;
  published: boolean;
  order: number;
  seo: SeoMeta;
}

export interface Metric { label: string; value: number; suffix: string; prefix?: string }

export interface Testimonial {
  id: string; name: string; role: string; company: string;
  text: string; rating: number; image?: string; published: boolean; order: number;
}

export interface Faq { id: string; q: string; a: string; published: boolean; order: number }

export interface Industry { id: string; name: string; desc: string; icon: string; published: boolean; order: number }

export interface WhyFeature { id: string; title: string; desc: string; icon: string; order: number }

export interface ProcessStep { id: string; title: string; desc: string; icon: string; order: number }

export interface TeamMember {
  id: string; name: string; role: string; bio: string; image?: string;
  linkedin?: string; twitter?: string; email?: string;
  published: boolean; order: number;
}

export interface PricingPlan {
  id: string; name: string; price: string; period: string; tagline: string;
  features: string[]; cta: string; badge?: string; recommended: boolean;
  published: boolean; order: number;
}

export interface PortfolioItem {
  id: string; title: string; client: string; category: string; industry: string;
  cover?: string; description: string; services: string[]; results: string[];
  url?: string; featured: boolean; published: boolean; order: number;
}

export interface CaseMetric { label: string; value: string }

export interface CaseStudy {
  id: string; title: string; client: string; industry: string; services: string[];
  image?: string; challenge: string; strategy: string; solution: string;
  metrics: CaseMetric[]; before: number; after: number; beforeLabel: string; afterLabel: string;
  quote?: string; published: boolean; order: number;
}

export interface BlogPost {
  id: string; slug: string; title: string; excerpt: string; content: string;
  image?: string; author: string; category: string; tags: string[];
  date: string; readTime: string; status: "published" | "draft" | "scheduled";
  seo: SeoMeta;
}

export type LeadStatus = "new" | "contacted" | "qualified" | "proposal" | "won" | "lost" | "followup";
export type LeadSource = "contact" | "audit" | "consultation" | "newsletter" | "whatsapp" | "service";

export interface LeadNote { t: number; by: string; text: string }

export interface Lead {
  id: string; name: string; email: string; phone: string; company?: string;
  service?: string; budget?: string; website?: string; message?: string;
  source: LeadSource; status: LeadStatus; priority: "low" | "medium" | "high";
  tags: string[]; notes: LeadNote[]; followUp?: string; assignedTo?: string;
  attachmentName?: string; createdAt: number; read: boolean; archived: boolean;
}

export interface MediaFile {
  id: string; name: string; type: string; size: number; dataUrl: string; uploadedAt: number;
}

export interface Visit { t: number; path: string; device: "mobile" | "desktop"; source: string }

export interface ActivityEntry { id: string; t: number; user: string; action: string; detail: string; ip?: string }

export type Role = "superadmin" | "editor" | "marketing" | "content" | "viewer";

export interface AdminUser {
  id: string; name: string; email: string; role: Role; lastActive?: number;
}

export interface HeroContent {
  badge: string;
  headingStart: string;
  grad1: string;
  headingMiddle: string;
  grad2: string;
  headingEnd: string;
  subtitle: string;
  primaryCta: string;
  secondaryCta: string;
  trustItems: string[];
  cardOneLabel: string; cardOneValue: string; cardOneSub: string;
  cardTwoLabel: string; cardTwoValue: string; cardTwoSub: string;
}

export interface Settings {
  siteName: string;
  tagline: string;
  logoUrl?: string;
  email: string;
  phone: string;
  whatsapp: string; // digits only, intl format
  address: string;
  hours: string;
  mapUrl: string;
  calendlyUrl: string;
  footerText: string;
  socials: { facebook: string; instagram: string; linkedin: string; twitter: string; youtube: string };
  announcement: { enabled: boolean; text: string; cta: string; href: string };
  showStats: boolean;
  gaId: string; gtmId: string; pixelId: string; gscVerification: string;
  smtp: { host: string; port: string; user: string; pass: string };
}

export interface PageSeo extends SeoMeta { id: string; page: string; slug: string; canonical?: string }

export interface RedirectRule { id: string; from: string; to: string }

export interface CMSContent {
  settings: Settings;
  hero: HeroContent;
  metrics: Metric[];
  trustedBy: { id: string; name: string }[];
  services: Service[];
  whyFeatures: WhyFeature[];
  process: ProcessStep[];
  industries: Industry[];
  testimonials: Testimonial[];
  faqs: Faq[];
  team: TeamMember[];
  pricing: PricingPlan[];
  portfolio: PortfolioItem[];
  caseStudies: CaseStudy[];
  blog: BlogPost[];
  about: {
    storyTitle: string; story: string; mission: string; vision: string;
    values: { id: string; title: string; desc: string; icon: string }[];
    stats: { label: string; value: string }[];
    image?: string;
  };
  seoPages: PageSeo[];
  robotsTxt: string;
  redirects: RedirectRule[];
  leads: Lead[];
  media: MediaFile[];
  visits: Visit[];
  activity: ActivityEntry[];
  users: AdminUser[];
}
