import { CMSContent } from "./types";

const now = Date.now();
const day = 86400000;

/* ------------------------------------------------------------------
   DEFAULT CONTENT SEED
   Everything below is placeholder content — every record can be
   edited, reordered, published/unpublished or deleted from the
   Wavexo Admin Panel at /admin.
------------------------------------------------------------------- */

export const DEFAULT_CONTENT: CMSContent = {
  settings: {
    siteName: "Wavexo",
    tagline: "We Build Growth. We Create Impact.",
    email: "hello@wavexo.agency",
    phone: "+91 98765 43210",
    whatsapp: "919876543210",
    address: "Level 8, Cyber Hub, Gurugram, Haryana 122002, India",
    hours: "Mon – Sat · 10:00 AM – 7:00 PM IST",
    mapUrl: "https://www.google.com/maps?q=Cyber+Hub+Gurugram&output=embed",
    calendlyUrl: "",
    footerText: "Wavexo is a digital marketing and technology agency helping ambitious businesses attract more customers, increase revenue and build a powerful digital presence.",
    socials: {
      facebook: "https://facebook.com/wavexo",
      instagram: "https://instagram.com/wavexo",
      linkedin: "https://linkedin.com/company/wavexo",
      twitter: "https://x.com/wavexo",
      youtube: "https://youtube.com/@wavexo",
    },
    announcement: {
      enabled: true,
      text: "Limited offer: Free digital growth audit + strategy call for new clients this month.",
      cta: "Claim Free Audit",
      href: "/contact",
    },
    showStats: true,
    gaId: "",
    gtmId: "",
    pixelId: "",
    gscVerification: "",
    smtp: { host: "", port: "587", user: "", pass: "" },
  },

  hero: {
    badge: "Digital Growth Agency",
    headingStart: "We Help Businesses",
    grad1: "Grow",
    headingMiddle: "With",
    grad2: "Digital Marketing & Technology",
    headingEnd: ".",
    subtitle:
      "Wavexo combines strategy, creativity and technology to help ambitious businesses attract more customers, increase revenue and build a powerful digital presence.",
    primaryCta: "Book a Free Consultation",
    secondaryCta: "Explore Our Services",
    trustItems: ["Strategy", "Creativity", "Technology", "Growth"],
    cardOneLabel: "Avg. Client Growth",
    cardOneValue: "+187%",
    cardOneSub: "across active accounts",
    cardTwoLabel: "Campaign ROAS",
    cardTwoValue: "5.2x",
    cardTwoSub: "blended, last quarter",
  },

  metrics: [
    { label: "Projects Completed", value: 150, suffix: "+" },
    { label: "Businesses Helped", value: 90, suffix: "+" },
    { label: "Average Growth", value: 187, suffix: "%" },
    { label: "Client Retention", value: 94, suffix: "%" },
  ],

  trustedBy: [
    { id: "tb1", name: "NexaRetail" },
    { id: "tb2", name: "Skyline Realty" },
    { id: "tb3", name: "Lumina Fashion" },
    { id: "tb4", name: "BrightCare Clinics" },
    { id: "tb5", name: "EduSpark Academy" },
    { id: "tb6", name: "UrbanKart" },
    { id: "tb7", name: "FinEdge Advisors" },
    { id: "tb8", name: "NovaFit Studios" },
  ],

  services: [
    {
      id: "svc-seo",
      slug: "seo-services",
      title: "SEO Services",
      category: "Organic Growth",
      icon: "search",
      accent: "cyan",
      short: "Improve your visibility, attract qualified traffic and rank higher on search engines with a complete SEO strategy.",
      description:
        "We build compounding organic growth engines. From technical foundations to authority building, Wavexo's SEO programs are engineered around revenue — not vanity rankings.",
      problem:
        "Your customers are searching right now — and finding your competitors. Without a technical, content and authority strategy, even great businesses stay invisible on Google.",
      features: [
        "Complete website SEO audit",
        "Keyword research & search intent mapping",
        "On-page SEO optimization",
        "Technical SEO (speed, schema, crawlability)",
        "Off-page SEO & authority link building",
        "Google ranking improvement tracking",
        "Local SEO & Google Business Profile",
        "Transparent monthly SEO reporting",
      ],
      benefits: [
        "Rank for keywords that actually drive revenue",
        "Reduce long-term dependence on paid ads",
        "Compound traffic growth month over month",
        "Build trust with high-intent searchers",
      ],
      deliverables: ["SEO audit report", "Keyword strategy map", "Optimized pages", "Monthly performance dashboard"],
      tools: ["Google Search Console", "Ahrefs", "SEMrush", "Screaming Frog", "GA4"],
      process: ["Audit", "Keyword strategy", "On-page & technical fixes", "Content & authority", "Measure & iterate"],
      faqs: [
        { q: "How long does SEO take to show results?", a: "Most businesses see meaningful movement in 3–4 months, with compounding growth from month 6. Quick technical wins often show impact within weeks." },
        { q: "Do you guarantee #1 rankings?", a: "No honest agency can guarantee rankings. We guarantee a rigorous, transparent process focused on traffic, leads and revenue — not vanity metrics." },
      ],
      ctaText: "Explore SEO Services",
      published: true,
      order: 0,
      seo: { title: "SEO Services — Rank Higher & Grow Organic Revenue | Wavexo", description: "Complete SEO services: keyword research, on-page, technical & off-page SEO with transparent reporting. Grow qualified traffic with Wavexo.", keywords: "seo services, seo agency, technical seo, keyword research" },
    },
    {
      id: "svc-web",
      slug: "website-development",
      title: "Website Development",
      category: "Design & Engineering",
      icon: "code",
      accent: "blue",
      short: "Build a fast, modern and conversion-focused website that turns visitors into customers.",
      description:
        "We design and engineer websites that load in a blink, look world-class and convert relentlessly. From business sites to full e-commerce builds, every pixel is planned around your funnel.",
      problem:
        "A slow, dated or confusing website silently kills your marketing. Every rupee you spend on ads leaks through pages that don't build trust or drive action.",
      features: [
        "Business & corporate websites",
        "E-commerce website development",
        "Shopify store development",
        "High-converting landing pages",
        "UI/UX design & prototyping",
        "Website maintenance & support",
        "Speed & Core Web Vitals optimization",
        "Analytics & conversion tracking setup",
      ],
      benefits: [
        "A website engineered to convert visitors",
        "Lightning-fast load times on every device",
        "Easy to manage without a developer",
        "Built-in SEO and analytics foundations",
      ],
      deliverables: ["Design system & mockups", "Responsive website", "CMS access & training", "90-day support window"],
      tools: ["React", "Next.js", "Shopify", "WordPress", "Figma", "Tailwind CSS"],
      process: ["Discovery", "UX wireframes", "UI design", "Development", "QA & launch"],
      faqs: [
        { q: "Can you build Shopify stores?", a: "Yes — we design and develop complete Shopify stores including theme customization, app setup, payments, shipping and conversion optimization." },
        { q: "How long does a website take?", a: "Landing pages ship in 1–2 weeks. Business websites typically take 3–5 weeks, and e-commerce builds 4–8 weeks depending on scope." },
      ],
      ctaText: "Build Your Website",
      published: true,
      order: 1,
      seo: { title: "Website Development — Fast, Modern, Conversion-Focused | Wavexo", description: "Business websites, e-commerce & Shopify development, landing pages, UI/UX and speed optimization. Build a website that converts with Wavexo.", keywords: "website development, shopify development, landing pages, ui ux design" },
    },
    {
      id: "svc-wa",
      slug: "whatsapp-automation",
      title: "WhatsApp Automation",
      category: "Automation",
      icon: "message",
      accent: "emerald",
      short: "Automate customer communication, lead follow-ups and business notifications through WhatsApp.",
      description:
        "Meet customers where they already are. Wavexo builds WhatsApp automation systems that reply instantly, follow up automatically and turn conversations into revenue — 24/7.",
      problem:
        "Leads go cold in minutes. Manual replies are slow, follow-ups get forgotten and customers drift to whoever responds first. WhatsApp automation fixes the leak.",
      features: [
        "Automated replies & instant responses",
        "Customer follow-up sequences",
        "Order & shipping notifications",
        "New lead alerts to your team",
        "WhatsApp marketing automation",
        "Chatbot workflows & FAQs",
        "Customer support automation",
        "CRM & website integration",
      ],
      benefits: [
        "Respond to every lead in under 30 seconds",
        "Recover sales with automated follow-ups",
        "Reduce support workload by up to 60%",
        "98% open rates vs. email",
      ],
      deliverables: ["Automation blueprint", "Configured workflows", "Team inbox setup", "Playbooks & training"],
      tools: ["WhatsApp Business API", "WATI", "AiSensy", "Interakt", "Zapier", "Make"],
      process: ["Journey mapping", "Workflow design", "API setup", "Bot training", "Launch & optimize"],
      faqs: [
        { q: "Can you automate WhatsApp customer communication?", a: "Yes. We set up the WhatsApp Business API with chatbots, automated replies, follow-up sequences, notifications and a shared team inbox." },
        { q: "Is WhatsApp automation legal & safe?", a: "Absolutely — we use the official WhatsApp Business API with opt-in compliance, so your number stays safe from bans." },
      ],
      ctaText: "Automate Your Business",
      published: true,
      order: 2,
      seo: { title: "WhatsApp Automation — Reply, Follow Up & Sell on Autopilot | Wavexo", description: "WhatsApp Business API automation: chatbots, follow-ups, order notifications and marketing automation. Automate your business with Wavexo.", keywords: "whatsapp automation, whatsapp chatbot, whatsapp business api" },
    },
    {
      id: "svc-ecom",
      slug: "ecommerce-management",
      title: "Dropshipping & E-commerce Management",
      category: "Commerce",
      icon: "store",
      accent: "violet",
      short: "Launch, manage and scale your e-commerce business with data-driven product and store strategies.",
      description:
        "From product research to fulfilment operations, we run the machine behind your store. Data-driven product selection, conversion-optimized pages and disciplined operations that scale.",
      problem:
        "Most stores don't fail from lack of effort — they fail from wrong products, weak pages and chaotic operations. We replace guesswork with a proven operating system.",
      features: [
        "Winning product research",
        "Complete store setup & branding",
        "Product listing & copywriting",
        "Store conversion optimization",
        "Order & inventory management",
        "Supplier & fulfilment coordination",
        "E-commerce growth strategy",
        "Reviews & retention systems",
      ],
      benefits: [
        "Launch with validated, in-demand products",
        "Higher conversion rates on every product page",
        "Smooth operations as order volume grows",
        "One team for store, ads & automation",
      ],
      deliverables: ["Product research report", "Launch-ready store", "Optimized listings", "Weekly growth reports"],
      tools: ["Shopify", "WooCommerce", "Amazon", "Flipkart", "DSers", "Klaviyo"],
      process: ["Research", "Store build", "Listing optimization", "Ops setup", "Scale"],
      faqs: [
        { q: "Do you manage existing stores too?", a: "Yes — we audit your current store, fix conversion leaks and take over day-to-day management including listings, offers and reporting." },
        { q: "Can you help me start dropshipping?", a: "We handle product research, supplier vetting, store setup and launch marketing, and we stay on as your growth partner." },
      ],
      ctaText: "Grow Your Store",
      published: true,
      order: 3,
      seo: { title: "Dropshipping & E-commerce Management | Wavexo", description: "Product research, store setup, listing optimization and e-commerce growth management. Launch and scale your store with Wavexo.", keywords: "ecommerce management, dropshipping, shopify store management" },
    },
    {
      id: "svc-meta",
      slug: "meta-ads",
      title: "Facebook / Meta Ads Management",
      category: "Paid Growth",
      icon: "target",
      accent: "magenta",
      short: "Generate leads and sales with high-performing Facebook and Instagram advertising campaigns.",
      description:
        "Full-funnel Meta advertising managed by specialists. Scroll-stopping creatives, precision audiences and relentless testing — optimized daily for cost per result, not just clicks.",
      problem:
        "Boosting posts burns money. Without testing frameworks, tracking and creative strategy, Meta ads become an expensive lottery instead of a predictable growth channel.",
      features: [
        "Lead generation campaigns",
        "E-commerce sales campaigns",
        "Facebook & Instagram ads",
        "Ad creative design & copywriting",
        "Audience research & targeting",
        "Campaign structure & optimization",
        "Pixel, CAPI & event tracking",
        "Weekly performance reporting",
      ],
      benefits: [
        "Predictable lead and sales pipelines",
        "Lower cost per result through testing",
        "Creatives produced by our in-house team",
        "Clear reporting on every rupee spent",
      ],
      deliverables: ["Campaign strategy", "Ad creatives & copy", "Tracking setup", "Weekly performance reports"],
      tools: ["Meta Ads Manager", "Meta Pixel", "Conversions API", "GA4", "Canva Pro"],
      process: ["Audit & research", "Tracking setup", "Creative testing", "Optimization", "Scale winners"],
      faqs: [
        { q: "Do you manage Facebook and Instagram ads?", a: "Yes — full-funnel management including strategy, creatives, audiences, daily optimization, tracking and transparent weekly reporting." },
        { q: "What budget do I need to start?", a: "We recommend a minimum ad spend of ₹30,000/month to gather statistically useful data, plus our management fee." },
      ],
      ctaText: "Scale With Meta Ads",
      published: true,
      order: 4,
      seo: { title: "Facebook & Meta Ads Management — Leads & Sales | Wavexo", description: "High-performing Facebook and Instagram ad campaigns: lead generation, e-commerce sales, creatives, targeting and optimization by Wavexo.", keywords: "meta ads, facebook ads agency, instagram ads, lead generation" },
    },
  ],

  whyFeatures: [
    { id: "wf1", title: "Strategy Before Execution", desc: "Every project starts with research and a growth plan — never random tactics. We know why before we build what.", icon: "compass", order: 0 },
    { id: "wf2", title: "Focus on Real Business Growth", desc: "We optimize for revenue, leads and ROI — the metrics your business actually runs on, not vanity numbers.", icon: "growth", order: 1 },
    { id: "wf3", title: "Transparent Communication", desc: "Clear scopes, honest timelines, real-time dashboards and weekly updates. You'll always know what's happening.", icon: "messages", order: 2 },
    { id: "wf4", title: "Creative + Technical Expertise", desc: "Designers, developers and performance marketers under one roof — so nothing gets lost between teams.", icon: "sparkles", order: 3 },
    { id: "wf5", title: "Data-Driven Decisions", desc: "Every recommendation is backed by tracking, testing and analysis. Opinions are nice; data wins.", icon: "chart", order: 4 },
    { id: "wf6", title: "Long-Term Partnership", desc: "We grow when you grow. Most clients stay for years because we operate like your in-house growth team.", icon: "handshake", order: 5 },
  ],

  process: [
    { id: "ps1", title: "Discover", desc: "We understand your business, goals, audience and competition in a deep-dive workshop.", icon: "search", order: 0 },
    { id: "ps2", title: "Strategize", desc: "We build a customized growth plan with clear KPIs, channels, budgets and timelines.", icon: "map", order: 1 },
    { id: "ps3", title: "Build", desc: "We design and develop the required assets — websites, creatives, automations and tracking.", icon: "build", order: 2 },
    { id: "ps4", title: "Launch", desc: "We execute campaigns and activate your marketing systems with clean QA at every step.", icon: "rocket", order: 3 },
    { id: "ps5", title: "Optimize", desc: "We analyze performance data and continuously improve every funnel step.", icon: "gauge", order: 4 },
    { id: "ps6", title: "Scale", desc: "We double down on what works and expand into sustainable, compounding growth.", icon: "layers", order: 5 },
  ],

  industries: [
    { id: "in1", name: "E-commerce", desc: "Stores, marketplaces & D2C brands that want more sales per visitor.", icon: "cart", published: true, order: 0 },
    { id: "in2", name: "Real Estate", desc: "Lead engines for builders, brokers and property consultants.", icon: "building", published: true, order: 1 },
    { id: "in3", name: "Healthcare", desc: "Patient acquisition for clinics, hospitals & wellness brands.", icon: "health", published: true, order: 2 },
    { id: "in4", name: "Education", desc: "Enrolment marketing for institutes, courses & ed-tech.", icon: "education", published: true, order: 3 },
    { id: "in5", name: "SaaS", desc: "Demand generation and product-led funnels for software.", icon: "cloud", published: true, order: 4 },
    { id: "in6", name: "Local Businesses", desc: "Google Maps, reviews and local ads that bring footfall.", icon: "pin", published: true, order: 5 },
    { id: "in7", name: "Professional Services", desc: "Authority marketing for consultants, CAs, lawyers & agencies.", icon: "briefcase", published: true, order: 6 },
    { id: "in8", name: "Startups", desc: "Scrappy, fast growth systems for funded & bootstrapped teams.", icon: "rocket", published: true, order: 7 },
    { id: "in9", name: "Fashion & Lifestyle", desc: "Trend-speed creative & performance for lifestyle brands.", icon: "fashion", published: true, order: 8 },
  ],

  testimonials: [
    {
      id: "t1", name: "Aarav Mehta", role: "Founder", company: "Lumina Fashion",
      text: "Wavexo rebuilt our store and took over Meta ads. Within four months our ROAS crossed 5x and we finally have a marketing partner that talks revenue, not impressions.",
      rating: 5, image: "", published: true, order: 0,
    },
    {
      id: "t2", name: "Priya Nair", role: "Director", company: "BrightCare Clinics",
      text: "The WhatsApp automation alone changed our clinic. Every enquiry gets an instant reply, appointments book themselves and my front desk finally breathes.",
      rating: 5, image: "", published: true, order: 1,
    },
    {
      id: "t3", name: "Rohan Kapoor", role: "CEO", company: "Skyline Realty",
      text: "Transparent, data-obsessed and genuinely invested in our growth. Lead quality improved dramatically and the weekly reports make decisions easy.",
      rating: 5, image: "", published: true, order: 2,
    },
  ],

  faqs: [
    { id: "fq1", q: "What services does Wavexo provide?", a: "Wavexo offers five core services: SEO, website development (including Shopify & e-commerce), WhatsApp automation, dropshipping & e-commerce management, and Facebook/Meta ads management. You can engage us for one service or a complete growth stack.", published: true, order: 0 },
    { id: "fq2", q: "Do you work with small businesses?", a: "Absolutely. A large part of our client base is small and growing businesses. Our Starter package and flexible scopes are designed to deliver enterprise-grade thinking at budgets that make sense for SMBs.", published: true, order: 1 },
    { id: "fq3", q: "How long does SEO take to show results?", a: "Expect meaningful movement in 3–4 months and compounding growth from month 6. Technical fixes and quick-win optimizations often show impact within the first few weeks.", published: true, order: 2 },
    { id: "fq4", q: "Can you build Shopify stores?", a: "Yes — complete Shopify design and development including themes, apps, payments, shipping, product setup and conversion optimization. We also provide ongoing store management.", published: true, order: 3 },
    { id: "fq5", q: "Do you manage Facebook and Instagram ads?", a: "Yes, full-funnel: strategy, creative production, audience research, campaign management, pixel/CAPI tracking, daily optimization and transparent weekly reporting.", published: true, order: 4 },
    { id: "fq6", q: "Can you automate WhatsApp customer communication?", a: "Yes. Using the official WhatsApp Business API we set up chatbots, instant replies, follow-up sequences, order notifications, lead alerts and a shared team inbox — fully compliant with WhatsApp policies.", published: true, order: 5 },
    { id: "fq7", q: "Do you offer customized packages?", a: "Every engagement is scoped to your goals. Start with a free consultation and we'll recommend a custom plan — you only pay for what moves your metrics.", published: true, order: 6 },
    { id: "fq8", q: "How can I book a consultation?", a: "Click any 'Book a Free Consultation' button on this site, fill the short form, or message us directly on WhatsApp. We typically respond within a few business hours.", published: true, order: 7 },
  ],

  team: [
    { id: "tm1", name: "Aarav Mehta", role: "Founder & Growth Strategist", bio: "8+ years scaling D2C and service brands across SEO, paid media and CRO. Leads strategy for every Wavexo engagement.", linkedin: "https://linkedin.com", twitter: "https://x.com", published: true, order: 0 },
    { id: "tm2", name: "Sophia Rao", role: "Head of Performance Marketing", bio: "Managed ₹40Cr+ in ad spend. Obsessed with creative testing frameworks and full-funnel tracking.", linkedin: "https://linkedin.com", published: true, order: 1 },
    { id: "tm3", name: "Daniel Fernandes", role: "Lead Developer", bio: "Full-stack engineer specializing in high-speed marketing sites, e-commerce and automation architecture.", linkedin: "https://linkedin.com", published: true, order: 2 },
    { id: "tm4", name: "Maya Iyer", role: "Creative Director", bio: "Brand and ad creative specialist. Turns scrolls into stops and stops into sales.", linkedin: "https://linkedin.com", published: true, order: 3 },
  ],

  pricing: [
    {
      id: "pr1", name: "Starter", price: "₹14,999", period: "/month", tagline: "For businesses getting their growth engine started.",
      features: ["1 core service of your choice", "Complete audit & strategy", "Monthly optimization cycle", "Monthly performance report", "WhatsApp support", "No lock-in contract"],
      cta: "Start With Starter", badge: "", recommended: false, published: true, order: 0,
    },
    {
      id: "pr2", name: "Growth", price: "₹29,999", period: "/month", tagline: "For businesses ready to scale what works.",
      features: ["Up to 3 services combined", "Quarterly growth roadmap", "Weekly optimization & reports", "Ad creative production", "Landing page CRO", "Dedicated growth manager", "WhatsApp + call support"],
      cta: "Scale With Growth", badge: "Most Popular", recommended: true, published: true, order: 1,
    },
    {
      id: "pr3", name: "Enterprise", price: "Custom Quote", period: "", tagline: "A full-stack growth team for ambitious brands.",
      features: ["All 5 services, one team", "Custom strategy & SLAs", "Real-time dashboards", "Conversion & automation architecture", "Priority same-day support", "Quarterly executive reviews"],
      cta: "Talk to Wavexo", badge: "", recommended: false, published: true, order: 2,
    },
  ],

  portfolio: [
    {
      id: "pf1", title: "Lumina Fashion — D2C Store Relaunch", client: "Lumina Fashion", category: "meta-ads", industry: "E-commerce",
      cover: "/images/work-lumina.jpg",
      description: "Complete Shopify rebuild paired with a full-funnel Meta ads program — new creative system, CAPI tracking and landing page CRO.",
      services: ["Website Development", "Meta Ads"], results: ["5.2x blended ROAS", "+186% revenue in 4 months", "-42% cost per purchase"],
      url: "", featured: true, published: true, order: 0,
    },
    {
      id: "pf2", title: "Skyline Realty — Lead Engine", client: "Skyline Realty", category: "whatsapp", industry: "Real Estate",
      cover: "/images/work-skyline.jpg",
      description: "Meta lead campaigns wired directly into WhatsApp automation — instant replies, automated qualification and site-visit booking.",
      services: ["Meta Ads", "WhatsApp Automation"], results: ["+240% qualified leads", "<30s first response time", "68 site visits / month"],
      url: "", featured: true, published: true, order: 1,
    },
    {
      id: "pf3", title: "BrightCare Clinics — Patient Acquisition", client: "BrightCare Clinics", category: "seo", industry: "Healthcare",
      cover: "/images/work-dental.jpg",
      description: "Local SEO + appointment-focused website: Google Business optimization, treatment pages and review engine across 3 locations.",
      services: ["SEO", "Website Development"], results: ["Top 3 for 28 local keywords", "+162% appointment requests", "0.9s avg. page load"],
      url: "", featured: false, published: true, order: 2,
    },
  ],

  caseStudies: [
    {
      id: "cs1", title: "From Stagnant Store to 5.2x ROAS", client: "Lumina Fashion", industry: "E-commerce · Fashion D2C",
      services: ["Website Development", "Meta Ads"], image: "/images/work-lumina.jpg",
      challenge: "Lumina's store loaded in 6+ seconds, tracked nothing properly, and ad performance had flatlined at 1.8x ROAS while costs climbed.",
      strategy: "Rebuild the funnel end-to-end: a fast, conversion-first Shopify store, Conversions API tracking, and a structured creative testing program across hooks, formats and angles.",
      solution: "New store shipped in 4 weeks (0.9s LCP). Meta account restructured around ASC + testing campaigns with 12 fresh creatives per month, landing pages iterated weekly from heatmap data.",
      metrics: [
        { label: "Blended ROAS", value: "5.2x" },
        { label: "Revenue Growth", value: "+186%" },
        { label: "Cost / Purchase", value: "-42%" },
        { label: "Conversion Rate", value: "3.4%" },
      ],
      before: 38, after: 92, beforeLabel: "Before · 1.8x ROAS", afterLabel: "After · 5.2x ROAS",
      quote: "Wavexo talks revenue, not impressions. Our best four months ever.",
      published: true, order: 0,
    },
    {
      id: "cs2", title: "A 30-Second Response Machine for Real Estate", client: "Skyline Realty", industry: "Real Estate",
      services: ["Meta Ads", "WhatsApp Automation"], image: "/images/work-skyline.jpg",
      challenge: "Skyline generated leads but responded hours later — by then prospects had spoken to three competitors. Cost per site visit was spiralling.",
      strategy: "Pair high-intent Meta lead ads with instant WhatsApp automation: reply in seconds, qualify with a bot flow, and route hot leads straight to sales with context.",
      solution: "WhatsApp Business API with qualification workflows, automated brochures, site-visit scheduling and sales-team alerts. Campaigns rebuilt around qualification data fed back weekly.",
      metrics: [
        { label: "Qualified Leads", value: "+240%" },
        { label: "First Response", value: "28s" },
        { label: "Site Visits", value: "68/mo" },
        { label: "Cost / Visit", value: "-51%" },
      ],
      before: 30, after: 88, beforeLabel: "Before · manual follow-up", afterLabel: "After · automated engine",
      quote: "The automation alone paid for the engagement in month one.",
      published: true, order: 1,
    },
  ],

  blog: [
    {
      id: "bp1", slug: "seo-strategy-2026", title: "The 2026 SEO Playbook: Ranking When AI Answers Everything",
      excerpt: "Search is changing fast. Here's the exact framework we use to keep clients visible — in Google and in AI answers.",
      content: "## Search isn't dying — it's splitting\n\nBuyers now discover through Google, AI assistants, and social search simultaneously. The winners optimize for all three with one strategy: be the best answer, everywhere.\n\n## 1. Build topical authority, not pages\n\nOne great page per topic no longer wins. Build clusters: a pillar page supported by 8–12 deep subtopics, internally linked, each answering a real query your buyers ask.\n\n## 2. Engineer for AI citations\n\nAI engines cite sources with clear structure, original data and direct answers. Add statistics, definitions and FAQ schema. Make your content quotable.\n\n## 3. Technical health is table stakes\n\nCore Web Vitals, clean crawl paths and structured data won't differentiate you — but their absence will disqualify you.\n\n## The takeaway\n\nSEO in 2026 rewards brands that genuinely help. Publish less, better, and measure revenue — not just rankings.",
      image: "/images/blog-seo.jpg", author: "Aarav Mehta", category: "SEO", tags: ["SEO", "AI Search", "Content Strategy"],
      date: new Date(now - 5 * day).toISOString().slice(0, 10), readTime: "6 min read", status: "published",
      seo: { title: "The 2026 SEO Playbook | Wavexo Blog", description: "How to rank in 2026 when AI answers everything: topical authority, AI citations and technical excellence.", keywords: "seo 2026, ai search, topical authority" },
    },
    {
      id: "bp2", slug: "whatsapp-automation-roi", title: "WhatsApp Automation: The 98% Open Rate Channel You're Ignoring",
      excerpt: "Your customers live on WhatsApp. Here's how automation turns it into your highest-converting sales channel.",
      content: "## The attention math is brutal\n\nEmail open rates hover near 20%. WhatsApp? 98%, with most messages read within 5 minutes. If your follow-up lives in email, your revenue stays there too.\n\n## What a real automation stack looks like\n\nInstant lead replies, qualification flows, order updates, abandoned-cart nudges and review requests — all triggered automatically, all feeling human.\n\n## Real numbers from real deployments\n\nOur e-commerce clients see 25–40% cart-recovery rates on WhatsApp flows versus 5–10% on email. Service businesses cut response time from hours to under 30 seconds.\n\n## Compliance keeps you safe\n\nUse the official Business API, collect clear opt-ins and respect template rules. Done right, automation builds trust instead of burning it.",
      image: "/images/blog-whatsapp.jpg", author: "Sophia Rao", category: "Automation", tags: ["WhatsApp", "Automation", "CRM"],
      date: new Date(now - 12 * day).toISOString().slice(0, 10), readTime: "5 min read", status: "published",
      seo: { title: "WhatsApp Automation ROI Guide | Wavexo Blog", description: "How WhatsApp automation delivers 98% open rates and real revenue — flows, numbers and compliance.", keywords: "whatsapp automation, chatbot roi, business api" },
    },
    {
      id: "bp3", slug: "meta-ads-creative-testing", title: "Creative Is the New Targeting: Meta Ads in a Post-Advantage+ World",
      excerpt: "Meta's AI handles targeting now. Your edge is creative volume and testing discipline. Here's our 12-creative monthly system.",
      content: "## The algorithm ate your targeting\n\nAdvantage+ and broad audiences outperform micro-targeting for most accounts. Meta's AI finds your buyers — if your creative gives it the right signals.\n\n## The 12-creative system\n\nEvery month: 4 hooks × 3 formats. Never test headlines against headlines; test angles — pain, aspiration, proof, offer. Kill fast, scale faster.\n\n## Measure what matters\n\nThumb-stop rate (3s views / impressions) tells you if the hook works. Hold rate and CTR tell you about the body. Cost per result is the only verdict that counts.\n\n## Feed the machine\n\nAccounts that ship fresh creative weekly simply out-learn those that don't. Volume with discipline — that's the whole game.",
      image: "/images/blog-ads.jpg", author: "Sophia Rao", category: "Meta Ads", tags: ["Meta Ads", "Creative Strategy", "Performance"],
      date: new Date(now - 20 * day).toISOString().slice(0, 10), readTime: "7 min read", status: "published",
      seo: { title: "Meta Ads Creative Testing System | Wavexo Blog", description: "Creative is the new targeting. A 12-creative monthly testing system for Meta ads performance.", keywords: "meta ads, creative testing, facebook ads" },
    },
  ],

  about: {
    storyTitle: "Born from a simple frustration: agencies that report activity, not outcomes.",
    story:
      "Wavexo started when our founders — a performance marketer and a product engineer — kept meeting business owners burned by agencies: beautiful decks, vague reports, flat revenue.\n\nSo we built the agency we wished existed. Strategy-first. Data-obsessed. Radically transparent. A team where the person who designs your ad, codes your landing page and automates your follow-ups sits at the same table, accountable for one number: your growth.\n\nToday Wavexo partners with e-commerce brands, clinics, real-estate firms, educators and startups across India and beyond — many of them for years, because results compound and so does trust.",
    mission: "To make world-class digital growth accessible to ambitious businesses everywhere — with strategy, creativity and technology working as one system.",
    vision: "A world where every great business, regardless of size, can compete and win online through honest, data-driven marketing.",
    values: [
      { id: "v1", title: "Outcomes over activity", desc: "We are paid to move your numbers, not to stay busy. Every task traces back to a KPI.", icon: "target" },
      { id: "v2", title: "Radical transparency", desc: "Real dashboards, honest timelines, plain language. If something isn't working, you'll hear it from us first.", icon: "eye" },
      { id: "v3", title: "Craft in the details", desc: "From a headline to a page-speed score, details compound. We sweat all of them.", icon: "gem" },
      { id: "v4", title: "Partnership, not vendor-ship", desc: "We win when you win. That means honest advice — even when it's 'don't spend here'.", icon: "handshake" },
    ],
    stats: [
      { label: "Years in business", value: "6+" },
      { label: "Specialists in-house", value: "18" },
      { label: "Industries served", value: "9+" },
      { label: "Ad spend managed", value: "₹40Cr+" },
    ],
    image: "/images/about-studio.jpg",
  },

  seoPages: [
    { id: "seo-home", page: "Home", slug: "/", title: "Wavexo — Digital Marketing & Technology Agency", description: "Grow with SEO, websites, WhatsApp automation, e-commerce management & Meta ads. We Build Growth. We Create Impact.", keywords: "digital marketing agency, growth agency, wavexo", canonical: "https://wavexo.agency/" },
    { id: "seo-about", page: "About", slug: "/about", title: "About Wavexo — Strategy-First Digital Growth Agency", description: "Meet the team and story behind Wavexo. Strategy, creativity and technology under one roof.", keywords: "about wavexo, digital agency team" },
    { id: "seo-services", page: "Services", slug: "/services", title: "Services — SEO, Web Development, WhatsApp Automation, E-commerce & Meta Ads", description: "Explore Wavexo's five growth services, engineered to attract customers and grow revenue.", keywords: "seo services, website development, whatsapp automation, meta ads" },
    { id: "seo-work", page: "Work", slug: "/work", title: "Our Work — Case Studies & Results | Wavexo", description: "Real projects, real numbers. Explore Wavexo case studies across e-commerce, real estate and healthcare.", keywords: "case studies, portfolio, results" },
    { id: "seo-process", page: "Process", slug: "/process", title: "Our Process — Discover to Scale | Wavexo", description: "The six-step Wavexo growth process: Discover, Strategize, Build, Launch, Optimize, Scale.", keywords: "agency process, growth process" },
    { id: "seo-pricing", page: "Pricing", slug: "/pricing", title: "Pricing & Packages | Wavexo", description: "Transparent, flexible packages for SEO, ads, web and automation. Starter, Growth and Enterprise plans.", keywords: "pricing, marketing packages" },
    { id: "seo-blog", page: "Blog", slug: "/blog", title: "Resources & Insights | Wavexo Blog", description: "Playbooks on SEO, Meta ads, WhatsApp automation and e-commerce growth from the Wavexo team.", keywords: "marketing blog, growth insights" },
    { id: "seo-faqs", page: "FAQs", slug: "/faqs", title: "FAQs | Wavexo", description: "Answers about Wavexo's services, timelines, pricing and process.", keywords: "faq, questions" },
    { id: "seo-contact", page: "Contact", slug: "/contact", title: "Contact Wavexo — Let's Talk Growth", description: "Get in touch with Wavexo. Call, WhatsApp, email or request your free digital growth audit.", keywords: "contact, free audit" },
    { id: "seo-book", page: "Book Consultation", slug: "/book", title: "Book a Free Consultation | Wavexo", description: "30 minutes. Zero pitch. A clear action plan for your digital growth — book your free Wavexo consultation.", keywords: "free consultation, strategy call" },
  ],
  robotsTxt: "User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: https://wavexo.agency/sitemap.xml",
  redirects: [],

  leads: [
    {
      id: "ld1", name: "Sample — Vikram Shah", email: "vikram@nexaretail.com", phone: "+91 98111 22334", company: "NexaRetail",
      service: "Meta Ads", budget: "₹50k – ₹1L / month", message: "Looking to scale our fashion store ads. Currently spending ₹60k/month in-house with flat results.",
      source: "audit", status: "new", priority: "high", tags: ["ecommerce", "hot"], notes: [],
      createdAt: now - 1 * day, read: false, archived: false,
    },
    {
      id: "ld2", name: "Sample — Dr. Anisha Rao", email: "anisha@brightcare.com", phone: "+91 99887 66554", company: "BrightCare Clinics",
      service: "WhatsApp Automation", budget: "₹25k – ₹50k", message: "Need appointment booking automation for 3 clinic locations.",
      source: "consultation", status: "contacted", priority: "medium", tags: ["healthcare"], notes: [{ t: now - 20 * 3600000, by: "Aarav Mehta", text: "Called — wants demo this Friday with clinic head." }],
      followUp: new Date(now + 2 * day).toISOString().slice(0, 10), assignedTo: "Sophia Rao",
      createdAt: now - 3 * day, read: true, archived: false,
    },
    {
      id: "ld3", name: "Sample — Nikhil Verma", email: "nikhil@eduspark.in", phone: "+91 90909 80807", company: "EduSpark Academy",
      service: "SEO", budget: "Under ₹25k", message: "Want to rank for coaching keywords in Jaipur.",
      source: "contact", status: "qualified", priority: "low", tags: ["education"], notes: [],
      createdAt: now - 6 * day, read: true, archived: false,
    },
  ],

  media: [],

  visits: Array.from({ length: 64 }, () => {
    const paths = ["/", "/", "/", "/services", "/services/meta-ads", "/pricing", "/work", "/contact", "/blog", "/about"];
    const sources = ["google", "google", "google", "direct", "instagram", "facebook", "whatsapp", "referral"];
    const d = Math.floor(Math.random() * 28);
    return {
      t: now - d * day - Math.floor(Math.random() * day),
      path: paths[Math.floor(Math.random() * paths.length)],
      device: Math.random() > 0.42 ? ("mobile" as const) : ("desktop" as const),
      source: sources[Math.floor(Math.random() * sources.length)],
    };
  }),

  activity: [
    { id: "ac1", t: now - 3600000 * 5, user: "System", action: "Workspace created", detail: "Default Wavexo content seeded" },
    { id: "ac2", t: now - 3600000 * 3, user: "System", action: "Sample leads added", detail: "3 demo leads available to explore the CRM" },
  ],

  users: [
    { id: "u1", name: "Wavexo Owner", email: "admin@wavexo.agency", role: "superadmin", lastActive: now },
  ],
};

export const DEFAULT_PASSWORD = "wavexo2024";
export const AUTH_KEY = "wavexo_auth_v1";
export const CMS_KEY = "wavexo_cms_v1";
export const SESSION_KEY = "wavexo_session_v1";
