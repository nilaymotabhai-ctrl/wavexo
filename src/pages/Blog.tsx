import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CalendarDays, Clock3, Search, ArrowLeft, ArrowRight } from "lucide-react";
import { useCMS, publishedSorted, formatDate } from "../lib/store";
import { useSeo } from "../lib/seo";
import { Reveal, Stagger, StaggerItem, EmptyState, ArrowIcon, inputCls, cn } from "../components/ui";
import { Section } from "../components/fx";
import { PageHero, FinalCta } from "../components/sections";

export function BlogList() {
  const { content } = useCMS();
  const posts = publishedSorted(content.blog.map((b) => ({ ...b, published: b.status === "published" })));
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  useSeo("/blog", "Resources & Insights | Wavexo Blog");

  const cats = useMemo(() => ["All", ...Array.from(new Set(posts.map((p) => p.category)))], [posts]);
  const filtered = posts.filter((p) =>
    (cat === "All" || p.category === cat) &&
    (q === "" || (p.title + p.excerpt + p.tags.join(" ")).toLowerCase().includes(q.toLowerCase()))
  );
  const [featured, ...rest] = filtered;

  return (
    <>
      <PageHero
        eyebrow="Blog & Resources"
        crumb="Resources"
        title={<>Growth Playbooks, <span className="text-gradient">Not Fluff</span>.</>}
        sub="Field notes from real campaigns — SEO, Meta ads, WhatsApp automation and e-commerce. Steal our frameworks."
      />
      <Section className="mt-2">
        {/* search + categories */}
        <Reveal>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div className="flex flex-wrap justify-center gap-2">
              {cats.map((c) => (
                <button key={c} onClick={() => setCat(c)}
                  className={cn("rounded-full border px-4 py-2 text-xs font-semibold transition-all",
                    cat === c ? "border-transparent bg-gradient-to-r from-electric to-violetx text-white" : "border-white/10 bg-white/[0.04] text-mist hover:text-white")}>
                  {c}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search articles…" aria-label="Search articles"
                className={inputCls + " !rounded-full !pl-11"} />
            </div>
          </div>
        </Reveal>

        {filtered.length === 0 ? (
          <div className="mt-14">
            <EmptyState icon="search" title="No articles found" sub="Try a different search term or category — or subscribe and get new playbooks first." />
          </div>
        ) : (
          <>
            {/* featured */}
            {featured && cat === "All" && q === "" && (
              <Reveal className="mt-12">
                <Link to={`/blog/${featured.slug}`} className="card-glow group grid overflow-hidden rounded-[30px] border border-white/[0.08] bg-white/[0.03] lg:grid-cols-2">
                  <div className="relative h-64 overflow-hidden lg:h-auto">
                    {featured.image && <img src={featured.image} alt={featured.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />}
                    <span className="absolute left-5 top-5 rounded-full bg-gradient-to-r from-electric to-violetx px-3.5 py-1.5 text-[11px] font-bold text-white">Featured</span>
                  </div>
                  <div className="flex flex-col justify-center p-8 sm:p-10">
                    <div className="flex flex-wrap items-center gap-3 text-[11px] font-medium text-faint">
                      <span className="rounded-full bg-gradient-to-r from-electric/20 to-violetx/20 px-3 py-1 font-semibold text-cyan-200">{featured.category}</span>
                      <span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" />{formatDate(featured.date)}</span>
                      <span className="flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" />{featured.readTime}</span>
                    </div>
                    <h2 className="font-display mt-4 text-2xl font-bold leading-snug text-white transition-colors group-hover:text-cyan-200 sm:text-3xl">{featured.title}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-mist">{featured.excerpt}</p>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300">
                      Read the playbook <ArrowIcon />
                    </span>
                  </div>
                </Link>
              </Reveal>
            )}

            <Stagger className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {(cat === "All" && q === "" ? rest : filtered).map((p) => (
                <StaggerItem key={p.id}>
                  <Link to={`/blog/${p.slug}`} className="card-glow group flex h-full flex-col overflow-hidden rounded-[26px] border border-white/[0.08] bg-white/[0.03]">
                    <div className="relative h-48 overflow-hidden">
                      {p.image && <img src={p.image} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />}
                      <span className="absolute left-4 top-4 rounded-full bg-space/70 px-3 py-1 text-[10px] font-semibold text-cyan-200 backdrop-blur">{p.category}</span>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex items-center gap-3 text-[11px] text-faint">
                        <span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" />{formatDate(p.date)}</span>
                        <span className="flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" />{p.readTime}</span>
                      </div>
                      <h3 className="font-display mt-3 text-lg font-bold leading-snug text-white transition-colors group-hover:text-cyan-200">{p.title}</h3>
                      <p className="mt-2 text-[13px] leading-relaxed text-mist">{p.excerpt}</p>
                      <span className="mt-auto pt-5 text-[13px] font-semibold text-cyan-300">Read article →</span>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
          </>
        )}
      </Section>
      <Section className="mt-28"><FinalCta title={<>Learning Is Good. <span className="text-gradient">Doing Is Better.</span></>} sub="Let our team apply these playbooks to your business — starting with a free audit." /></Section>
    </>
  );
}

export function BlogPost() {
  const { slug } = useParams();
  const { content } = useCMS();
  const post = content.blog.find((b) => b.slug === slug && b.status === "published");
  useSeo("/blog", post?.seo.title || post?.title, post ? {
    "@context": "https://schema.org", "@type": "Article",
    headline: post.title, description: post.excerpt, image: post.image,
    author: { "@type": "Person", name: post.author }, datePublished: post.date,
  } : undefined);

  if (!post) {
    return (
      <Section className="pt-44">
        <EmptyState icon="search" title="Article not found" sub="It may have been unpublished or moved. Browse all resources instead." />
        <Reveal className="mt-8 text-center">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-300"><ArrowLeft className="h-4 w-4" /> Back to blog</Link>
        </Reveal>
      </Section>
    );
  }

  const related = content.blog.filter((b) => b.status === "published" && b.id !== post.id).slice(0, 2);

  const renderContent = (text: string) =>
    text.split("\n").filter((l) => l.trim()).map((line, i) => {
      if (line.startsWith("## ")) {
        return <h2 key={i} className="font-display mt-10 text-2xl font-bold text-white">{line.replace("## ", "")}</h2>;
      }
      return <p key={i} className="mt-5 text-[15px] leading-[1.85] text-mist">{line}</p>;
    });

  return (
    <>
      <article className="relative overflow-hidden pb-10 pt-36 sm:pt-44">
        <div className="bg-grid absolute inset-0" aria-hidden />
        <div className="pointer-events-none absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-violetx/20 blur-[130px]" aria-hidden />
        <div className="relative mx-auto max-w-3xl px-5 sm:px-8">
          <Reveal>
            <Link to="/blog" className="inline-flex items-center gap-2 text-xs font-semibold text-mist transition-colors hover:text-white">
              <ArrowLeft className="h-3.5 w-3.5" /> All resources
            </Link>
          </Reveal>
          <Reveal delay={0.06}>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-[11px] font-medium text-faint">
              <span className="rounded-full bg-gradient-to-r from-electric/20 to-violetx/20 px-3 py-1 font-semibold text-cyan-200">{post.category}</span>
              <span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" />{formatDate(post.date)}</span>
              <span className="flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" />{post.readTime}</span>
              <span>by {post.author}</span>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <h1 className="font-display mt-5 text-3xl font-bold leading-[1.15] tracking-tight text-white sm:text-4xl lg:text-[44px]">{post.title}</h1>
          </Reveal>
        </div>
        {post.image && (
          <Reveal delay={0.2} className="relative mx-auto mt-10 max-w-4xl px-5 sm:px-8">
            <img src={post.image} alt={post.title} className="w-full rounded-[28px] border border-white/10 object-cover" />
          </Reveal>
        )}
        <div className="relative mx-auto mt-4 max-w-3xl px-5 pb-8 sm:px-8">
          {renderContent(post.content)}
          <div className="mt-10 flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <span key={t} className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-mist">#{t}</span>
            ))}
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <Section className="mt-14">
          <Reveal><h2 className="font-display text-2xl font-bold text-white">Keep reading</h2></Reveal>
          <div className="mt-7 grid gap-6 md:grid-cols-2">
            {related.map((p) => (
              <Reveal key={p.id}>
                <Link to={`/blog/${p.slug}`} className="card-glow group flex h-full gap-5 rounded-[26px] border border-white/[0.08] bg-white/[0.03] p-5">
                  {p.image && <img src={p.image} alt="" loading="lazy" className="h-28 w-36 shrink-0 rounded-2xl object-cover" />}
                  <div>
                    <p className="text-[11px] font-semibold text-cyan-300">{p.category}</p>
                    <h3 className="font-display mt-1.5 text-[15px] font-bold leading-snug text-white transition-colors group-hover:text-cyan-200">{p.title}</h3>
                    <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-mist">Read <ArrowRight className="h-3 w-3" /></span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      <Section className="mt-20"><FinalCta /></Section>
    </>
  );
}
