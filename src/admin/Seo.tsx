import { useMemo, useState } from "react";
import { Globe, Pencil, Plus, Trash2, Copy, FileCode, Route } from "lucide-react";
import { useCMS, newId } from "../lib/store";
import { PageSeo } from "../lib/types";
import {
  AButton, ACard, AField, AInput, ATextarea, AToggle, SectionTitle, Drawer, ImageField, Pill, Confirm, toast,
} from "./ui";

export default function SeoManager() {
  const { content, save, updateSettings, log, can } = useCMS();
  const [editing, setEditing] = useState<PageSeo | null>(null);
  const [confirmRedirect, setConfirmRedirect] = useState<string | null>(null);
  const [redirect, setRedirect] = useState({ from: "", to: "" });
  const editable = can("content");

  const sitemap = useMemo(() => {
    const base = "https://wavexo.agency";
    const urls = new Set<string>();
    content.seoPages.filter((p) => !p.noIndex).forEach((p) => urls.add(p.slug));
    content.services.filter((s) => s.published).forEach((s) => urls.add(`/services/${s.slug}`));
    content.blog.filter((b) => b.status === "published").forEach((b) => urls.add(`/blog/${b.slug}`));
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...urls].map((u) => `  <url><loc>${base}${u}</loc><changefreq>weekly</changefreq></url>`).join("\n")}\n</urlset>`;
  }, [content.seoPages, content.services, content.blog]);

  const savePage = () => {
    if (!editing) return;
    const exists = content.seoPages.some((p) => p.id === editing.id);
    save({ seoPages: exists ? content.seoPages.map((p) => (p.id === editing.id ? editing : p)) : [...content.seoPages, editing] });
    log("SEO updated", `${editing.page} (${editing.slug})`);
    toast("SEO settings saved");
    setEditing(null);
  };

  return (
    <div>
      <SectionTitle title="SEO Manager"
        sub="Control titles, descriptions, indexing and sharing for every page — plus sitemap, robots.txt and redirects."
        right={editable && (
          <AButton variant="ghost" onClick={() => setEditing({ id: newId(), page: "Custom page", slug: "/custom", title: "", description: "", keywords: "" })}>
            <Plus className="h-4 w-4" /> Add custom page
          </AButton>
        )}
      />

      {/* pages table */}
      <div className="space-y-2.5">
        {content.seoPages.map((p) => (
          <div key={p.id} className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-electric/25 to-violetx/25 text-cyan-300">
              <Globe className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{p.page} <span className="ml-1 font-mono text-[11px] font-normal text-faint">{p.slug}</span></p>
              <p className="truncate text-[11px] text-mist">{p.title || "No title set"}</p>
              <p className="truncate text-[10px] text-faint">{p.description || "No description"}</p>
            </div>
            {p.noIndex ? <Pill tone="amber">no-index</Pill> : <Pill tone="green">indexed</Pill>}
            <span className={p.title && p.description ? "text-emerald-400" : "text-amber-400"}>
              <Pill tone={p.title && p.description ? "green" : "amber"}>{p.title && p.description ? "Optimized" : "Needs meta"}</Pill>
            </span>
            <button onClick={() => setEditing({ ...p })} className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-mist transition hover:border-violetx/50 hover:text-white">
              <Pencil className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {/* sitemap */}
        <ACard>
          <div className="flex items-center justify-between">
            <h3 className="font-display flex items-center gap-2 text-[15px] font-bold text-white"><FileCode className="h-4 w-4 text-cyan-300" /> sitemap.xml (auto-generated)</h3>
            <AButton variant="ghost" onClick={() => { navigator.clipboard.writeText(sitemap); toast("Sitemap copied — paste into public/sitemap.xml"); }}>
              <Copy className="h-4 w-4" /> Copy
            </AButton>
          </div>
          <textarea readOnly value={sitemap} className="mt-4 h-44 w-full resize-none rounded-xl border border-white/10 bg-space/60 p-3 font-mono text-[11px] leading-relaxed text-mist" />
        </ACard>

        {/* robots */}
        <ACard>
          <h3 className="font-display flex items-center gap-2 text-[15px] font-bold text-white"><FileCode className="h-4 w-4 text-cyan-300" /> robots.txt</h3>
          <ATextarea className="mt-4 h-44 font-mono !text-[11px]" value={content.robotsTxt}
            onChange={(e) => editable && save({ robotsTxt: e.target.value })} readOnly={!editable} />
          <div className="mt-3">
            <AField label="Google Search Console verification code (content attribute)">
              <AInput value={content.settings.gscVerification} readOnly={!editable}
                onChange={(e) => updateSettings({ gscVerification: e.target.value })} placeholder="e.g. abc123XYZ…" />
            </AField>
          </div>
        </ACard>
      </div>

      {/* redirects */}
      <ACard className="mt-5">
        <h3 className="font-display flex items-center gap-2 text-[15px] font-bold text-white"><Route className="h-4 w-4 text-cyan-300" /> 301 Redirects</h3>
        <p className="mt-1 text-[11px] text-faint">Point old URLs to new ones to preserve SEO equity.</p>
        <div className="mt-4 space-y-2.5">
          {content.redirects.map((r) => (
            <div key={r.id} className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3">
              <span className="font-mono text-[12px] text-mist">{r.from}</span>
              <span className="text-faint">→</span>
              <span className="font-mono text-[12px] text-white">{r.to}</span>
              {editable && (
                <button onClick={() => setConfirmRedirect(r.id)} className="ml-auto text-faint transition hover:text-rose-300">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
          {content.redirects.length === 0 && <p className="text-xs text-faint">No redirects configured.</p>}
        </div>
        {editable && (
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <AInput value={redirect.from} onChange={(e) => setRedirect({ ...redirect, from: e.target.value })} placeholder="/old-page" />
            <AInput value={redirect.to} onChange={(e) => setRedirect({ ...redirect, to: e.target.value })} placeholder="/new-page" />
            <AButton variant="ghost" className="shrink-0" onClick={() => {
              if (!redirect.from || !redirect.to) return;
              save({ redirects: [...content.redirects, { id: newId(), ...redirect }] });
              log("Redirect added", `${redirect.from} → ${redirect.to}`);
              setRedirect({ from: "", to: "" });
              toast("Redirect added");
            }}><Plus className="h-4 w-4" /> Add</AButton>
          </div>
        )}
      </ACard>

      {/* page editor drawer */}
      <Drawer open={!!editing} onClose={() => setEditing(null)} title={editing ? `SEO — ${editing.page}` : ""}>
        {editing && (
          <div className="space-y-4">
            <AField label="Page name"><AInput value={editing.page} onChange={(e) => setEditing({ ...editing, page: e.target.value })} /></AField>
            <AField label="URL slug"><AInput value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} /></AField>
            <AField label="SEO title" hint={`${editing.title.length}/60 characters`}>
              <AInput value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            </AField>
            <AField label="Meta description" hint={`${editing.description.length}/160 characters`}>
              <ATextarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
            </AField>
            <AField label="Focus keywords"><AInput value={editing.keywords} onChange={(e) => setEditing({ ...editing, keywords: e.target.value })} /></AField>
            <AField label="Canonical URL (optional)"><AInput value={editing.canonical || ""} onChange={(e) => setEditing({ ...editing, canonical: e.target.value })} /></AField>
            <ImageField label="Open Graph share image" value={editing.ogImage} onChange={(url) => setEditing({ ...editing, ogImage: url })} />
            <AToggle checked={!!editing.noIndex} onChange={(v) => setEditing({ ...editing, noIndex: v })} label="Hide from search engines (no-index)" />
            {/* SERP preview */}
            <div className="rounded-xl border border-white/10 bg-white p-4">
              <p className="text-[12px] text-emerald-700">https://wavexo.agency{editing.slug}</p>
              <p className="mt-0.5 truncate text-[16px] font-medium text-[#1a0dab]">{editing.title || "Page title preview"}</p>
              <p className="mt-0.5 text-[12px] leading-snug text-[#4d5156]">{editing.description || "Meta description preview appears here…"}</p>
            </div>
            <AButton className="w-full" onClick={savePage}>Save SEO settings</AButton>
          </div>
        )}
      </Drawer>

      <Confirm open={!!confirmRedirect} onClose={() => setConfirmRedirect(null)}
        onConfirm={() => {
          save({ redirects: content.redirects.filter((r) => r.id !== confirmRedirect) });
          toast("Redirect removed");
        }} title="Remove redirect?" message="Old URLs will stop forwarding to the new location." />
    </div>
  );
}
