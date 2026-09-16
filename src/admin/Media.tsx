import { useMemo, useRef, useState } from "react";
import { UploadCloud, ImageIcon, FileText, Copy, Pencil, Trash2, SearchX, Check } from "lucide-react";
import { useCMS, newId, timeAgo } from "../lib/store";
import { MediaFile } from "../lib/types";
import { AButton, ACard, AInput, ASearch, SectionTitle, Drawer, Confirm, fileToOptimizedImage, toast } from "./ui";
import { cn } from "../utils/cn";

const fmtSize = (bytes: number) => bytes > 1048576 ? `${(bytes / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;

export default function MediaLibrary() {
  const { content, addMedia, deleteMedia, save, log, can } = useCMS();
  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "image" | "file">("all");
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState(false);
  const [renaming, setRenaming] = useState<MediaFile | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const editable = can("content");

  const files = useMemo(() => {
    return content.media.filter((m) => {
      if (typeFilter === "image" && !m.type.startsWith("image")) return false;
      if (typeFilter === "file" && m.type.startsWith("image")) return false;
      if (q && !m.name.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [content.media, q, typeFilter]);

  const totalSize = content.media.reduce((a, m) => a + m.size, 0);

  const handleFiles = async (list: FileList | File[]) => {
    setBusy(true);
    const uploaded: MediaFile[] = [];
    for (const file of Array.from(list)) {
      try {
        if (file.type.startsWith("image/")) {
          const { dataUrl, size } = await fileToOptimizedImage(file);
          uploaded.push({ id: newId(), name: file.name.replace(/\.[^.]+$/, "") + ".webp", type: "image/webp", size, dataUrl, uploadedAt: Date.now() });
        } else if (file.type === "application/pdf" && file.size < 900_000) {
          const dataUrl = await new Promise<string>((res, rej) => {
            const r = new FileReader();
            r.onload = () => res(String(r.result));
            r.onerror = rej;
            r.readAsDataURL(file);
          });
          uploaded.push({ id: newId(), name: file.name, type: file.type, size: file.size, dataUrl, uploadedAt: Date.now() });
        } else {
          toast(`${file.name}: only images & PDFs under 900KB`);
        }
      } catch { toast(`Could not process ${file.name}`); }
    }
    if (uploaded.length) {
      addMedia(uploaded);
      log("Media uploaded", `${uploaded.length} file(s)`);
      toast(`${uploaded.length} file(s) optimized & added`);
    }
    setBusy(false);
  };

  const copy = (m: MediaFile) => {
    navigator.clipboard.writeText(m.dataUrl).then(() => {
      setCopiedId(m.id);
      setTimeout(() => setCopiedId(null), 1500);
      toast("File URL copied");
    });
  };

  return (
    <div>
      <SectionTitle title="Media Library"
        sub={`${content.media.length} files · ${fmtSize(totalSize)} total · Images auto-converted to WebP & resized. Pick these from any image field on the site.`}
        right={editable && <AButton onClick={() => inputRef.current?.click()} disabled={busy}><UploadCloud className="h-4 w-4" /> {busy ? "Processing…" : "Upload files"}</AButton>}
      />

      <input ref={inputRef} type="file" multiple accept="image/*,.pdf" className="hidden"
        onChange={(e) => { if (e.target.files?.length) handleFiles(e.target.files); e.target.value = ""; }} />

      {/* dropzone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); if (editable && e.dataTransfer.files.length) handleFiles(e.dataTransfer.files); }}
        onClick={() => editable && inputRef.current?.click()}
        className={cn("mb-6 cursor-pointer rounded-3xl border-2 border-dashed px-6 py-10 text-center transition",
          drag ? "border-cyanx/60 bg-cyanx/10" : "border-white/12 bg-white/[0.02] hover:border-violetx/40")}>
        <UploadCloud className={cn("mx-auto h-8 w-8", drag ? "text-cyan-300" : "text-faint")} />
        <p className="mt-3 text-sm font-semibold text-white">{drag ? "Drop to upload" : "Drag & drop files here, or click to browse"}</p>
        <p className="mt-1 text-xs text-faint">Images → auto-optimized WebP (max 1200px) · PDFs up to 900KB</p>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="w-full sm:w-72"><ASearch value={q} onChange={setQ} placeholder="Search files…" /></div>
        <div className="flex gap-2">
          {(["all", "image", "file"] as const).map((t) => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={cn("rounded-full border px-4 py-2 text-xs font-semibold capitalize transition",
                typeFilter === t ? "border-transparent bg-gradient-to-r from-electric to-violetx text-white" : "border-white/10 bg-white/[0.04] text-mist hover:text-white")}>
              {t === "all" ? "All files" : t === "image" ? "Images" : "Documents"}
            </button>
          ))}
        </div>
      </div>

      {files.length === 0 ? (
        <ACard className="py-16 text-center">
          <SearchX className="mx-auto h-8 w-8 text-faint" />
          <p className="font-display mt-4 text-lg font-semibold text-white">{content.media.length === 0 ? "Library is empty" : "No files match"}</p>
          <p className="mt-1 text-sm text-faint">Upload brand photos, team headshots, offers banners and blog covers here.</p>
        </ACard>
      ) : (
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {files.map((m) => (
            <div key={m.id} className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] transition hover:border-violetx/40">
              {m.type.startsWith("image") ? (
                <img src={m.dataUrl} alt={m.name} loading="lazy" className="h-32 w-full object-cover" />
              ) : (
                <div className="grid h-32 place-items-center bg-white/[0.03]"><FileText className="h-8 w-8 text-faint" /></div>
              )}
              <div className="p-3">
                <p className="truncate text-[12px] font-semibold text-white" title={m.name}>{m.name}</p>
                <p className="mt-0.5 text-[10px] text-faint">{fmtSize(m.size)} · {timeAgo(m.uploadedAt)}</p>
                <div className="mt-3 flex gap-1.5">
                  <button onClick={() => copy(m)} title="Copy URL" className="grid h-8 flex-1 place-items-center rounded-lg border border-white/10 bg-white/5 text-mist transition hover:text-white">
                    {copiedId === m.id ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                  <button onClick={() => setRenaming({ ...m })} title="Rename" className="grid h-8 flex-1 place-items-center rounded-lg border border-white/10 bg-white/5 text-mist transition hover:text-white">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  {editable && (
                    <button onClick={() => setConfirmId(m.id)} title="Delete" className="grid h-8 flex-1 place-items-center rounded-lg border border-white/10 bg-white/5 text-mist transition hover:border-rose-400/40 hover:text-rose-300">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* rename drawer */}
      <Drawer open={!!renaming} onClose={() => setRenaming(null)} title="Rename file">
        {renaming && (
          <div className="space-y-5">
            {renaming.type.startsWith("image") ? (
              <img src={renaming.dataUrl} alt="" className="h-40 w-full rounded-2xl border border-white/10 object-cover" />
            ) : (
              <div className="grid h-40 place-items-center rounded-2xl border border-white/10 bg-white/[0.03]"><ImageIcon className="h-8 w-8 text-faint" /></div>
            )}
            <AInput value={renaming.name} onChange={(e) => setRenaming({ ...renaming, name: e.target.value })} />
            <AButton className="w-full" onClick={() => {
              save({ media: content.media.map((m) => (m.id === renaming.id ? { ...m, name: renaming.name } : m)) });
              setRenaming(null);
              toast("File renamed");
            }}>Save name</AButton>
          </div>
        )}
      </Drawer>

      <Confirm open={!!confirmId} onClose={() => setConfirmId(null)}
        onConfirm={() => { if (confirmId) { deleteMedia(confirmId); log("Media deleted", confirmId); toast("File deleted"); } }}
        title="Delete this file?" message="Content using this file will show a broken image. Consider replacing it first." />
    </div>
  );
}
