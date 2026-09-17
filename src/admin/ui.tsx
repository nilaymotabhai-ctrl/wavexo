import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Plus, ChevronUp, ChevronDown, Upload, ImageIcon, Check, AlertTriangle, Search } from "lucide-react";
import { cn } from "../utils/cn";
import { useCMS } from "../lib/store";
import { processAndStoreImage } from "../lib/supabase";
import { Icon, ICON_OPTIONS } from "../components/ui";

/* ---------------- tiny toast bus ---------------- */

let toastFn: ((msg: string) => void) | null = null;
export const toast = (msg: string) => toastFn?.(msg);

export function Toasts() {
  const [items, setItems] = useState<{ id: number; msg: string }[]>([]);
  useEffect(() => {
    toastFn = (msg) => {
      const id = Date.now() + Math.random();
      setItems((i) => [...i, { id, msg }]);
      setTimeout(() => setItems((i) => i.filter((x) => x.id !== id)), 2600);
    };
    return () => { toastFn = null; };
  }, []);
  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-[120] flex -translate-x-1/2 flex-col items-center gap-2">
      <AnimatePresence>
        {items.map((t) => (
          <motion.div key={t.id} initial={{ opacity: 0, y: 16, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }}
            className="flex items-center gap-2 rounded-full border border-emerald-400/30 bg-midnight/95 px-5 py-2.5 text-sm font-medium text-white shadow-2xl backdrop-blur">
            <Check className="h-4 w-4 text-emerald-400" /> {t.msg}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- primitives ---------------- */

export function AField({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-white/75">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-faint">{hint}</span>}
    </label>
  );
}

export const aInput =
  "w-full rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-2.5 text-sm text-white placeholder:text-faint transition focus:border-cyanx/60 focus:outline-none focus:ring-2 focus:ring-cyanx/15";

export function AInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(aInput, props.className)} />;
}

export function ATextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(aInput, "min-h-[96px] resize-y", props.className)} />;
}

export function ASelect({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={cn(aInput, "appearance-none", props.className)}>
      {children}
    </select>
  );
}

export function AToggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button type="button" onClick={() => onChange(!checked)}
      className="group inline-flex items-center gap-2.5" aria-pressed={checked}>
      <span className={cn("relative h-6 w-11 rounded-full border transition-colors duration-300",
        checked ? "border-transparent bg-gradient-to-r from-electric to-violetx" : "border-white/15 bg-white/10")}>
        <span className={cn("absolute top-[2px] h-[18px] w-[18px] rounded-full bg-white shadow transition-all duration-300",
          checked ? "left-[22px]" : "left-[3px]")} />
      </span>
      {label && <span className="text-[13px] font-medium text-white/75 group-hover:text-white">{label}</span>}
    </button>
  );
}

export function AButton({ children, variant = "primary", className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "danger" | "soft" }) {
  const styles = {
    primary: "bg-gradient-to-r from-electric to-violetx text-white hover:opacity-90 shadow-[0_8px_30px_-10px_rgba(37,99,235,0.8)]",
    ghost: "border border-white/12 bg-white/[0.05] text-white/80 hover:bg-white/10 hover:text-white",
    soft: "bg-white/[0.07] text-white hover:bg-white/12",
    danger: "border border-rose-400/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20",
  }[variant];
  return (
    <button {...props} className={cn("inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-semibold transition disabled:opacity-50", styles, className)}>
      {children}
    </button>
  );
}

export function ACard({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5", className)}>{children}</div>;
}

export function ASearch({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="relative">
      <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder || "Search…"} className={cn(aInput, "!pl-10")} />
    </div>
  );
}

export function SectionTitle({ title, sub, right }: { title: string; sub?: string; right?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">{title}</h1>
        {sub && <p className="mt-1 text-sm text-mist">{sub}</p>}
      </div>
      {right}
    </div>
  );
}

/* ---------------- drawer ---------------- */

export function Drawer({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; wide?: boolean }) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="fixed inset-0 z-[90] bg-space/70 backdrop-blur-sm" />
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 34 }}
            className={cn("fixed inset-y-0 right-0 z-[95] flex w-full flex-col border-l border-white/10 bg-[#0a0f24] shadow-2xl", wide ? "max-w-2xl" : "max-w-lg")}>
            <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-5">
              <h2 className="font-display text-lg font-bold text-white">{title}</h2>
              <button onClick={onClose} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-mist transition hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ---------------- confirm dialog ---------------- */

export function Confirm({ open, onClose, onConfirm, title, message }: { open: boolean; onClose: () => void; onConfirm: () => void; title: string; message: string }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-[100] bg-space/70 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.92, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 16 }}
            className="fixed left-1/2 top-1/2 z-[105] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-white/10 bg-midnight p-7 shadow-2xl">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-500/15 text-rose-300"><AlertTriangle className="h-5 w-5" /></span>
            <h3 className="font-display mt-4 text-lg font-bold text-white">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-mist">{message}</p>
            <div className="mt-6 flex gap-2.5">
              <AButton variant="danger" className="flex-1" onClick={() => { onConfirm(); onClose(); }}>Yes, delete</AButton>
              <AButton variant="ghost" className="flex-1" onClick={onClose}>Cancel</AButton>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ---------------- string list editor ---------------- */

export function ListEditor({ items, onChange, placeholder }: { items: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  return (
    <div className="space-y-2">
      {items.map((it, i) => (
        <div key={i} className="flex gap-2">
          <AInput value={it} placeholder={placeholder} onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))} />
          <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} aria-label="Remove"
            className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-faint transition hover:border-rose-400/40 hover:text-rose-300">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <AButton type="button" variant="ghost" onClick={() => onChange([...items, ""])}>
        <Plus className="h-4 w-4" /> Add item
      </AButton>
    </div>
  );
}

/* ---------------- pairs editor (q/a, label/value) ---------------- */

export function PairsEditor({
  items, onChange, kLabel, vLabel, textareaV,
}: { items: { [k: string]: string }[]; onChange: (v: { [k: string]: string }[]) => void; kLabel: string; vLabel: string; textareaV?: boolean }) {
  const keys = items.length ? Object.keys(items[0]) : ["k", "v"];
  const [k0, k1] = keys;
  return (
    <div className="space-y-3">
      {items.map((it, i) => (
        <div key={i} className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3">
          <div className="flex gap-2">
            <AInput value={it[k0]} placeholder={kLabel} onChange={(e) => onChange(items.map((x, j) => (j === i ? { ...x, [k0]: e.target.value } : x)))} />
            <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} aria-label="Remove"
              className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-faint transition hover:border-rose-400/40 hover:text-rose-300">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          {textareaV ? (
            <ATextarea className="mt-2 !min-h-[64px]" value={it[k1]} placeholder={vLabel} onChange={(e) => onChange(items.map((x, j) => (j === i ? { ...x, [k1]: e.target.value } : x)))} />
          ) : (
            <AInput className="mt-2" value={it[k1]} placeholder={vLabel} onChange={(e) => onChange(items.map((x, j) => (j === i ? { ...x, [k1]: e.target.value } : x)))} />
          )}
        </div>
      ))}
      <AButton type="button" variant="ghost" onClick={() => onChange([...items, { [k0]: "", [k1]: "" }])}>
        <Plus className="h-4 w-4" /> Add row
      </AButton>
    </div>
  );
}

/* ---------------- icon picker ---------------- */

export function IconPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen(!open)}
        className={cn(aInput, "flex items-center gap-2.5 text-left")}>
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-electric/30 to-violetx/30 text-cyan-300">
          <Icon name={value} className="h-4 w-4" />
        </span>
        <span className="capitalize">{value}</span>
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
              className="absolute z-50 mt-2 grid max-h-56 w-64 grid-cols-5 gap-1.5 overflow-y-auto rounded-2xl border border-white/10 bg-midnight p-3 shadow-2xl">
              {ICON_OPTIONS.map((name) => (
                <button key={name} type="button" title={name}
                  onClick={() => { onChange(name); setOpen(false); }}
                  className={cn("grid h-10 w-full place-items-center rounded-xl border transition",
                    value === name ? "border-violetx/60 bg-violetx/25 text-white" : "border-white/[0.07] bg-white/[0.03] text-mist hover:text-white")}>
                  <Icon name={name} className="h-4 w-4" />
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- image → webp conversion ---------------- */

export function fileToOptimizedImage(file: File, maxW = 1200): Promise<{ dataUrl: string; size: number }> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) { reject(new Error("Not an image")); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxW / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/webp", 0.82);
        resolve({ dataUrl, size: Math.round((dataUrl.length * 3) / 4) });
      };
      img.onerror = reject;
      img.src = String(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ---------------- image field (upload or pick from library) ---------------- */

export function ImageField({ value, onChange, label }: { value?: string; onChange: (url: string) => void; label?: string }) {
  const { content } = useCMS();
  const [picker, setPicker] = useState(false);
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    setBusy(true);
    try {
      const { url, cloud } = await processAndStoreImage(file);
      onChange(url);
      toast(cloud ? "Image optimized & stored in cloud" : "Image optimized (saved inline)");
    } catch { toast("Could not process that image"); }
    setBusy(false);
  };

  return (
    <div>
      {label && <span className="mb-1.5 block text-[13px] font-medium text-white/75">{label}</span>}
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
      {value ? (
        <div className="relative overflow-hidden rounded-xl border border-white/10">
          <img src={value} alt="" className="h-32 w-full object-cover" />
          <button type="button" onClick={() => onChange("")} aria-label="Remove image"
            className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-lg bg-space/80 text-white backdrop-blur transition hover:bg-rose-500/70">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <button type="button" onClick={() => ref.current?.click()} disabled={busy}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-white/[0.03] text-[13px] font-medium text-mist transition hover:border-cyanx/40 hover:text-white">
            <Upload className="h-4 w-4" /> {busy ? "Optimizing…" : "Upload (auto WebP)"}
          </button>
          <button type="button" onClick={() => setPicker(true)}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] text-[13px] font-medium text-mist transition hover:text-white">
            <ImageIcon className="h-4 w-4" /> Media library
          </button>
        </div>
      )}
      <Drawer open={picker} onClose={() => setPicker(false)} title="Choose from media library" wide>
        {content.media.length === 0 ? (
          <p className="py-16 text-center text-sm text-faint">No media uploaded yet. Upload files in Admin → Media Library.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {content.media.filter((m) => m.type.startsWith("image")).map((m) => (
              <button key={m.id} type="button" onClick={() => { onChange(m.dataUrl); setPicker(false); }}
                className="group overflow-hidden rounded-xl border border-white/10 transition hover:border-violetx/50">
                <img src={m.dataUrl} alt={m.name} className="h-24 w-full object-cover" loading="lazy" />
                <p className="truncate bg-white/[0.04] px-2 py-1.5 text-[10px] text-mist group-hover:text-white">{m.name}</p>
              </button>
            ))}
          </div>
        )}
      </Drawer>
    </div>
  );
}

/* ---------------- order controls ---------------- */

export function OrderButtons({ onUp, onDown, disableUp, disableDown }: { onUp: () => void; onDown: () => void; disableUp?: boolean; disableDown?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <button type="button" onClick={onUp} disabled={disableUp} aria-label="Move up"
        className="grid h-6 w-6 place-items-center rounded-md border border-white/10 bg-white/5 text-mist transition enabled:hover:text-white disabled:opacity-30">
        <ChevronUp className="h-3.5 w-3.5" />
      </button>
      <button type="button" onClick={onDown} disabled={disableDown} aria-label="Move down"
        className="grid h-6 w-6 place-items-center rounded-md border border-white/10 bg-white/5 text-mist transition enabled:hover:text-white disabled:opacity-30">
        <ChevronDown className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

/* ---------------- status pill ---------------- */

export function Pill({ children, tone = "slate" }: { children: React.ReactNode; tone?: "slate" | "green" | "amber" | "rose" | "cyan" | "violet" }) {
  const tones = {
    slate: "border-white/10 bg-white/[0.06] text-mist",
    green: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
    amber: "border-amber-400/25 bg-amber-400/10 text-amber-300",
    rose: "border-rose-400/25 bg-rose-400/10 text-rose-300",
    cyan: "border-cyan-400/25 bg-cyan-400/10 text-cyan-300",
    violet: "border-violet-400/25 bg-violet-400/10 text-violet-300",
  }[tone];
  return <span className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold", tones)}>{children}</span>;
}
