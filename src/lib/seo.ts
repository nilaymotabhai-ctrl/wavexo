import { useEffect } from "react";
import { useCMS } from "./store";

/* Sets document title + meta tags from the CMS SEO manager for a route slug. */
export function useSeo(slug: string, fallbackTitle?: string, jsonLd?: object) {
  const { content } = useCMS();
  useEffect(() => {
    const page = content.seoPages.find((p) => p.slug === slug);
    const title = page?.title || fallbackTitle || content.settings.siteName;
    const desc = page?.description || "";
    document.title = title;

    const setMeta = (selector: string, attr: string, value: string) => {
      let el = document.head.querySelector(selector);
      if (!el) {
        el = document.createElement("meta");
        const [key, val] = selector.match(/\[(.+?)="(.+?)"\]/)!.slice(1);
        el.setAttribute(key, val);
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };

    setMeta('meta[name="description"]', "content", desc);
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", desc);
    setMeta('meta[name="robots"]', "content", page?.noIndex ? "noindex,nofollow" : "index,follow");

    // org schema (once)
    if (!document.getElementById("ld-org")) {
      const s = document.createElement("script");
      s.id = "ld-org";
      s.type = "application/ld+json";
      s.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: content.settings.siteName,
        description: content.settings.footerText,
        email: content.settings.email,
        telephone: content.settings.phone,
        address: content.settings.address,
        sameAs: Object.values(content.settings.socials).filter(Boolean),
      });
      document.head.appendChild(s);
    }

    let ld: HTMLScriptElement | null = null;
    if (jsonLd) {
      ld = document.createElement("script");
      ld.type = "application/ld+json";
      ld.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(ld);
    }
    return () => { if (ld) ld.remove(); };
  }, [slug, fallbackTitle, content, jsonLd]);
}
