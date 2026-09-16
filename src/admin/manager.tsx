import { useMemo, useState } from "react";
import { Pencil, Trash2, Plus, Eye, EyeOff, Save } from "lucide-react";
import { useCMS, newId } from "../lib/store";
import {
  AButton, AField, AInput, ATextarea, ASelect, AToggle, ASearch, SectionTitle,
  Drawer, Confirm, Pill, OrderButtons, ListEditor, PairsEditor, IconPicker, ImageField, toast,
} from "./ui";
import { ACCENT_OPTIONS, accentOf, Icon as IconRenderer } from "../components/ui";
import { cn } from "../utils/cn";

/* ------------------------------------------------------------------ */
/* Generic CMS collection manager — renders list + edit drawer from    */
/* a field config. Used by Services, Blog, Pricing, Portfolio, etc.    */
/* ------------------------------------------------------------------ */

export type FieldType = "text" | "textarea" | "number" | "toggle" | "select" | "icon" | "list" | "pairs" | "image" | "accent" | "seo" | "date";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
  hint?: string;
  span?: boolean; // full width
  pairsLabels?: [string, string];
  pairsKeys?: [string, string];
}

export interface CollectionConfig {
  key: "services" | "whyFeatures" | "process" | "industries" | "testimonials" | "faqs" | "team" | "pricing" | "portfolio" | "caseStudies" | "blog";
  title: string;
  singular: string;
  desc: string;
  fields: FieldDef[];
  blank: () => Record<string, unknown>;
  itemTitle: (item: any) => string;
  itemSub?: (item: any) => string;
  itemImage?: (item: any) => string | undefined;
  publishField?: string; // default "published"
  addLabel?: string;
}

function get(obj: any, path: string) {
  return path.split(".").reduce((o, k) => (o == null ? o : o[k]), obj);
}
function setDeep(obj: any, path: string, value: unknown) {
  const keys = path.split(".");
  const clone = { ...obj };
  let cur = clone;
  keys.forEach((k, i) => {
    if (i === keys.length - 1) cur[k] = value;
    else { cur[k] = { ...(cur[k] || {}) }; cur = cur[k]; }
  });
  return clone;
}

function FieldRenderer({ def, item, onChange }: { def: FieldDef; item: any; onChange: (it: any) => void }) {
  const value = get(item, def.key);
  const set = (v: unknown) => onChange(setDeep(item, def.key, v));

  switch (def.type) {
    case "textarea":
      return <ATextarea value={value || ""} onChange={(e) => set(e.target.value)} />;
    case "number":
      return <AInput type="number" value={value ?? 0} onChange={(e) => set(Number(e.target.value))} />;
    case "date":
      return <AInput type="date" className="[color-scheme:dark]" value={value || ""} onChange={(e) => set(e.target.value)} />;
    case "toggle":
      return <div className="pt-1.5"><AToggle checked={!!value} onChange={set} label={value ? "Yes" : "No"} /></div>;
    case "select":
      return (
        <ASelect value={value || ""} onChange={(e) => set(e.target.value)}>
          {(def.options || []).map((o) => <option key={o} value={o} className="bg-midnight capitalize">{o.replace(/-/g, " ")}</option>)}
        </ASelect>
      );
    case "icon":
      return <IconPicker value={value || "sparkles"} onChange={set} />;
    case "accent":
      return (
        <div className="flex flex-wrap gap-2">
          {ACCENT_OPTIONS.map((a) => (
            <button key={a} type="button" onClick={() => set(a)} title={a}
              className={cn("h-9 w-14 rounded-lg bg-gradient-to-br transition", accentOf(a).grad, value === a ? "ring-2 ring-white ring-offset-2 ring-offset-space" : "opacity-50 hover:opacity-90")} />
          ))}
        </div>
      );
    case "list":
      return <ListEditor items={value || []} onChange={set} placeholder="Add item…" />;
    case "pairs": {
      const k1 = (def.pairsKeys || ["q", "a"])[1];
      const [l0, l1] = def.pairsLabels || ["Label", "Value"];
      const items = (value || []) as Record<string, string>[];
      return (
        <PairsEditor
          items={items.length ? items : []}
          onChange={(v) => set(v)}
          kLabel={l0} vLabel={l1}
          textareaV={k1 === "a"}
        />
      );
    }
    case "image":
      return <ImageField value={value || ""} onChange={set} />;
    case "seo": {
      const seo = value || {};
      return (
        <div className="space-y-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3">
          <AInput value={seo.title || ""} placeholder="SEO title" onChange={(e) => set({ ...seo, title: e.target.value })} />
          <ATextarea className="!min-h-[56px]" value={seo.description || ""} placeholder="Meta description (150–160 chars)" onChange={(e) => set({ ...seo, description: e.target.value })} />
          <AInput value={seo.keywords || ""} placeholder="Focus keywords, comma separated" onChange={(e) => set({ ...seo, keywords: e.target.value })} />
        </div>
      );
    }
    default:
      return <AInput value={value || ""} onChange={(e) => set(e.target.value)} />;
  }
}

export function CollectionManager({ config }: { config: CollectionConfig }) {
  const { content, upsert, remove, move, log, can } = useCMS();
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<any | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const editable = can("content");
  const publishField = config.publishField ?? "published";

  const items = useMemo(() => {
    const list = [...(content[config.key] as any[])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    if (!q) return list;
    return list.filter((it) => JSON.stringify(it).toLowerCase().includes(q.toLowerCase()));
  }, [content, config.key, q]);

  const startAdd = () => {
    const blank = config.blank();
    setEditing({ ...blank, id: newId(), order: items.length, __isNew: true });
  };

  const saveItem = () => {
    if (!editable) { toast("Your role has read-only access"); return; }
    if (!config.itemTitle(editing)) { toast("Please fill the title/name field"); return; }
    // auto-slug
    if ("slug" in editing && !editing.slug) {
      editing.slug = String(config.itemTitle(editing)).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }
    upsert(config.key, editing);
    log(`${editing.__isNew ? "Created" : "Updated"} ${config.singular}`, config.itemTitle(editing));
    toast(`${config.singular} saved — live on the site`);
    setEditing(null);
  };

  const togglePublish = (item: any) => {
    if (publishField === "status") {
      const next = item.status === "published" ? "draft" : "published";
      upsert(config.key, { ...item, status: next });
      toast(next === "published" ? `${config.singular} published` : `${config.singular} moved to drafts`);
      return;
    }
    upsert(config.key, { ...item, [publishField]: !item[publishField] });
    toast(item[publishField] ? `${config.singular} unpublished` : `${config.singular} published`);
  };

  const isPublished = (item: any) => publishField === "status" ? item.status === "published" : item[publishField] !== false;

  return (
    <div>
      <SectionTitle title={config.title} sub={config.desc}
        right={
          <div className="flex items-center gap-2.5">
            {!editable && <span className="text-xs font-semibold text-amber-300">Read-only for your role</span>}
            {editable && <AButton onClick={startAdd}><Plus className="h-4 w-4" /> {config.addLabel || `Add ${config.singular}`}</AButton>}
          </div>
        }
      />
      <div className="mb-5 max-w-md"><ASearch value={q} onChange={setQ} placeholder={`Search ${config.title.toLowerCase()}…`} /></div>

      <div className="space-y-2.5">
        {items.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/12 py-16 text-center">
            <p className="font-display text-lg font-semibold text-white">No {config.title.toLowerCase()} yet</p>
            <p className="mt-1 text-sm text-faint">Click "{config.addLabel || `Add ${config.singular}`}" to create your first one.</p>
          </div>
        )}
        {items.map((item, i) => (
          <div key={item.id} className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-3.5 transition hover:border-white/20">
            <OrderButtons
              onUp={() => move(config.key, item.id, -1)} onDown={() => move(config.key, item.id, 1)}
              disableUp={i === 0} disableDown={i === items.length - 1}
            />
            {config.itemImage?.(item) ? (
              <img src={config.itemImage(item)} alt="" className="h-11 w-14 shrink-0 rounded-lg border border-white/10 object-cover" />
            ) : item.icon ? (
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-cyan-300">
                <span className="h-4 w-4"><IconDot name={item.icon} /></span>
              </span>
            ) : (
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-electric/30 to-violetx/30 text-[11px] font-bold text-white">
                {String(config.itemTitle(item)).slice(0, 2).toUpperCase()}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{config.itemTitle(item)}</p>
              {config.itemSub && <p className="truncate text-[11px] text-faint">{config.itemSub(item)}</p>}
            </div>
            <Pill tone={isPublished(item) ? "green" : "slate"}>{isPublished(item) ? "Live" : "Hidden"}</Pill>
            <div className="flex items-center gap-1.5">
              <button onClick={() => editable && togglePublish(item)} disabled={!editable} title={isPublished(item) ? "Unpublish" : "Publish"}
                className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-mist transition enabled:hover:text-white disabled:opacity-40">
                {isPublished(item) ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              <button onClick={() => setEditing({ ...item })} title="Edit"
                className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-mist transition hover:border-violetx/50 hover:text-white">
                <Pencil className="h-4 w-4" />
              </button>
              {editable && can("delete") && (
                <button onClick={() => setConfirmId(item.id)} title="Delete"
                  className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-mist transition hover:border-rose-400/40 hover:text-rose-300">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* edit drawer */}
      <Drawer open={!!editing} onClose={() => setEditing(null)} title={editing && config.itemTitle(editing) ? `Edit — ${config.itemTitle(editing)}` : `New ${config.singular}`} wide>
        {editing && (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              {config.fields.map((def) => (
                <div key={def.key} className={cn(def.span || ["list", "pairs", "seo", "image", "textarea", "accent"].includes(def.type) ? "sm:col-span-2" : "")}>
                  <AField label={def.label} hint={def.hint}>
                    <FieldRenderer def={def} item={editing} onChange={setEditing} />
                  </AField>
                </div>
              ))}
            </div>
            <div className="flex gap-2.5 border-t border-white/[0.07] pt-5">
              <AButton className="flex-1" onClick={saveItem}><Save className="h-4 w-4" /> Save & publish</AButton>
              <AButton variant="ghost" onClick={() => setEditing(null)}>Cancel</AButton>
            </div>
          </div>
        )}
      </Drawer>

      <Confirm open={!!confirmId} onClose={() => setConfirmId(null)}
        onConfirm={() => {
          const item = items.find((x) => x.id === confirmId);
          if (confirmId) remove(config.key, confirmId);
          log(`Deleted ${config.singular}`, item ? config.itemTitle(item) : confirmId || "");
          toast(`${config.singular} deleted`);
        }}
        title={`Delete this ${config.singular.toLowerCase()}?`}
        message="It will be removed from the live website immediately. This action is logged." />
    </div>
  );
}

function IconDot({ name }: { name: string }) {
  return <IconRenderer name={name} />;
}
