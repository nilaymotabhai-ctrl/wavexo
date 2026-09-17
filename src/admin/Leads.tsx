import { useEffect, useMemo, useState } from "react";
import {
  Download, Mail, Phone, Trash2, Archive, Globe, Paperclip,
  CalendarDays, Tag as TagIcon, UserCheck, MessageSquarePlus, Send,
} from "lucide-react";
import { useCMS, timeAgo, formatDate, waLink, newId } from "../lib/store";
import { Lead, LeadStatus, LeadSource } from "../lib/types";
import { AField, AInput, ASelect, AButton, ACard, ASearch, SectionTitle, Drawer, Pill, Confirm, toast } from "./ui";
import { WhatsAppIcon } from "../components/ui";
import { cn } from "../utils/cn";

const STATUSES: { id: LeadStatus; label: string; tone: "cyan" | "amber" | "violet" | "green" | "rose" | "slate" }[] = [
  { id: "new", label: "New", tone: "cyan" },
  { id: "contacted", label: "Contacted", tone: "amber" },
  { id: "qualified", label: "Qualified", tone: "violet" },
  { id: "proposal", label: "Proposal Sent", tone: "violet" },
  { id: "won", label: "Won", tone: "green" },
  { id: "lost", label: "Lost", tone: "slate" },
  { id: "followup", label: "Follow-up Required", tone: "rose" },
];

const SOURCES: LeadSource[] = ["contact", "audit", "consultation", "newsletter", "whatsapp", "service"];
const statusMeta = (id: LeadStatus) => STATUSES.find((s) => s.id === id) || STATUSES[0];

export default function Leads() {
  const { content, updateLead, deleteLead, user, can, log } = useCMS();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [source, setSource] = useState("all");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [tagsDraft, setTagsDraft] = useState("");

  /* local tags draft — initialized when a lead is opened, so realtime
     lead updates from other sessions never clobber in-progress typing */
  useEffect(() => {
    const lead = content.leads.find((l) => l.id === activeId);
    setTagsDraft(lead ? lead.tags.join(", ") : "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  const leads = useMemo(() => {
    return content.leads.filter((l) => {
      if (l.archived) return false;
      if (status !== "all" && l.status !== status) return false;
      if (source !== "all" && l.source !== source) return false;
      if (q) {
        const hay = `${l.name} ${l.email} ${l.phone} ${l.company || ""} ${l.service || ""}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [content.leads, q, status, source]);

  const active = content.leads.find((l) => l.id === activeId) || null;

  const counts = useMemo(() => {
    const m: Record<string, number> = { all: 0 };
    content.leads.forEach((l) => { if (!l.archived) { m.all++; m[l.status] = (m[l.status] || 0) + 1; } });
    return m;
  }, [content.leads]);

  const exportCsv = () => {
    const esc = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
    const header = "Name,Email,Phone,Company,Service,Budget,Source,Status,Priority,Message,Created";
    const body = leads.map((l: Lead) =>
      [l.name, l.email, l.phone, l.company || "", l.service || "", l.budget || "", l.source, l.status, l.priority,
        (l.message || "").replace(/[\r\n]+/g, " "), new Date(l.createdAt).toLocaleDateString()]
        .map(esc).join(",")
    );
    const rows = [header, ...body].join("\n");
    const blob = new Blob([rows], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `wavexo-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    toast(`Exported ${leads.length} leads to CSV`);
  };

  const patch = (id: string, p: Partial<Lead>) => {
    updateLead(id, p);
    if (p.status) log("Lead status changed", `${active?.name || "Lead"} → ${statusMeta(p.status).label}`);
  };

  return (
    <div>
      <SectionTitle
        title="Leads & Inquiries"
        sub="Every form on the website lands here — contact, audits, bookings, newsletters and service inquiries."
        right={<AButton variant="ghost" onClick={exportCsv}><Download className="h-4 w-4" /> Export CSV</AButton>}
      />

      {/* status filter pills */}
      <div className="mb-5 flex flex-wrap gap-2">
        {[{ id: "all", label: `All (${counts.all || 0})` }, ...STATUSES.map((s) => ({ id: s.id, label: `${s.label} (${counts[s.id] || 0})` }))].map((f) => (
          <button key={f.id} onClick={() => setStatus(f.id)}
            className={cn("rounded-full border px-3.5 py-1.5 text-[12px] font-semibold transition",
              status === f.id ? "border-transparent bg-gradient-to-r from-electric to-violetx text-white" : "border-white/10 bg-white/[0.04] text-mist hover:text-white")}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="mb-5 grid gap-3 sm:grid-cols-[1fr_200px]">
        <ASearch value={q} onChange={setQ} placeholder="Search by name, email, company, service…" />
        <ASelect value={source} onChange={(e) => setSource(e.target.value)} aria-label="Filter by source">
          <option value="all" className="bg-midnight">All sources</option>
          {SOURCES.map((s) => <option key={s} value={s} className="bg-midnight capitalize">{s}</option>)}
        </ASelect>
      </div>

      {/* list */}
      <div className="space-y-2.5">
        {leads.length === 0 && (
          <ACard className="py-14 text-center">
            <p className="font-display text-lg font-semibold text-white">No leads match these filters</p>
            <p className="mt-1 text-sm text-faint">New website submissions appear here instantly.</p>
          </ACard>
        )}
        {leads.map((l) => {
          const sm = statusMeta(l.status);
          return (
            <button key={l.id} onClick={() => { setActiveId(l.id); if (!l.read) updateLead(l.id, { read: true }); }}
              className="group w-full rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 text-left transition hover:border-violetx/40 hover:bg-white/[0.045]">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-electric/40 to-violetx/40 text-xs font-bold text-white">
                    {l.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
                    {!l.read && <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-[#060912] bg-cyan-400" />}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">{l.name} {l.company && <span className="font-normal text-faint">· {l.company}</span>}</p>
                    <p className="truncate text-[11px] text-faint">{l.email} · {l.phone}</p>
                  </div>
                </div>
                <div className="hidden md:block">
                  <p className="text-[11px] text-faint">Interested in</p>
                  <p className="text-[12px] font-medium text-white/85">{l.service || "—"}</p>
                </div>
                <Pill tone={sm.tone}>{sm.label}</Pill>
                <Pill>{l.source}</Pill>
                <p className="hidden text-[11px] text-faint sm:block">{timeAgo(l.createdAt)}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* detail drawer */}
      <Drawer open={!!active} onClose={() => { setActiveId(null); setNote(""); }} title={active ? `Lead — ${active.name}` : ""} wide>
        {active && (
          <div className="space-y-6">
            {/* contact box */}
            <ACard>
              <div className="grid gap-3 text-sm sm:grid-cols-2">
                <p className="flex items-center gap-2 text-white/85"><Mail className="h-4 w-4 text-cyan-300" /> {active.email}</p>
                <p className="flex items-center gap-2 text-white/85"><Phone className="h-4 w-4 text-cyan-300" /> {active.phone}</p>
                {active.website && <p className="flex items-center gap-2 text-white/85"><Globe className="h-4 w-4 text-cyan-300" /> {active.website}</p>}
                <p className="flex items-center gap-2 text-white/85"><CalendarDays className="h-4 w-4 text-cyan-300" /> {formatDate(active.createdAt)} · {timeAgo(active.createdAt)}</p>
                {active.attachmentName && <p className="flex items-center gap-2 text-white/85"><Paperclip className="h-4 w-4 text-cyan-300" /> {active.attachmentName}</p>}
              </div>
              {active.message && (
                <div className="mt-4 rounded-xl border border-white/[0.07] bg-white/[0.03] p-4 text-[13px] leading-relaxed text-mist">
                  "{active.message}"
                </div>
              )}
              <div className="mt-4 flex gap-2">
                {content.settings.whatsapp && (
                  <a href={waLink(active.phone.replace(/\D/g, "").length > 10 ? active.phone : `91${active.phone.replace(/\D/g, "")}`, `Hi ${active.name.split(" ")[0]}, thanks for contacting Wavexo!`)}
                    target="_blank" rel="noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-2.5 text-[13px] font-semibold text-emerald-300 transition hover:bg-emerald-400/20">
                    <WhatsAppIcon className="h-4 w-4" /> WhatsApp
                  </a>
                )}
                <a href={`mailto:${active.email}`}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/[0.05] px-4 py-2.5 text-[13px] font-semibold text-white/80 transition hover:text-white">
                  <Mail className="h-4 w-4" /> Email
                </a>
              </div>
            </ACard>

            {/* pipeline */}
            <div className="grid gap-4 sm:grid-cols-2">
              <AField label="Pipeline status">
                <ASelect value={active.status} onChange={(e) => patch(active.id, { status: e.target.value as LeadStatus })}>
                  {STATUSES.map((s) => <option key={s.id} value={s.id} className="bg-midnight">{s.label}</option>)}
                </ASelect>
              </AField>
              <AField label="Priority">
                <ASelect value={active.priority} onChange={(e) => patch(active.id, { priority: e.target.value as Lead["priority"] })}>
                  {["low", "medium", "high"].map((p) => <option key={p} value={p} className="bg-midnight capitalize">{p}</option>)}
                </ASelect>
              </AField>
              <AField label="Assigned to">
                <ASelect value={active.assignedTo || ""} onChange={(e) => patch(active.id, { assignedTo: e.target.value })}>
                  <option value="" className="bg-midnight">Unassigned</option>
                  {content.team.map((t) => <option key={t.id} value={t.name} className="bg-midnight">{t.name}</option>)}
                </ASelect>
              </AField>
              <AField label="Follow-up date">
                <AInput type="date" className="[color-scheme:dark]" value={active.followUp || ""} onChange={(e) => patch(active.id, { followUp: e.target.value })} />
              </AField>
            </div>

            <AField label="Tags (comma separated) — saved when you leave the field">
              <AInput value={tagsDraft}
                onChange={(e) => setTagsDraft(e.target.value)}
                onBlur={() => {
                  const tags = tagsDraft.split(",").map((t) => t.trim()).filter(Boolean);
                  if (tags.join("|") !== active.tags.join("|")) {
                    patch(active.id, { tags });
                    toast("Tags updated");
                  }
                }}
                placeholder="ecommerce, hot, referral" />
            </AField>

            {/* notes */}
            <div>
              <p className="mb-2 flex items-center gap-2 text-[13px] font-medium text-white/75"><MessageSquarePlus className="h-4 w-4 text-cyan-300" /> Internal notes</p>
              <div className="space-y-2.5">
                {active.notes.map((n) => (
                  <div key={n.t} className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-3.5">
                    <p className="text-[13px] text-white/85">{n.text}</p>
                    <p className="mt-1 text-[10px] text-faint">{n.by} · {timeAgo(n.t)}</p>
                  </div>
                ))}
                {active.notes.length === 0 && <p className="text-xs text-faint">No notes yet.</p>}
              </div>
              <div className="mt-3 flex gap-2">
                <AInput value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note…" />
                <AButton onClick={() => {
                  if (!note.trim()) return;
                  patch(active.id, { notes: [{ t: Date.now(), by: user?.name || "Admin", text: note.trim() }, ...active.notes] });
                  setNote("");
                  toast("Note added");
                }}><Send className="h-4 w-4" /></AButton>
              </div>
            </div>

            {/* danger */}
            {can("delete") && (
              <div className="flex gap-2.5 border-t border-white/[0.07] pt-5">
                <AButton variant="ghost" className="flex-1" onClick={() => { patch(active.id, { archived: true }); setActiveId(null); toast("Lead archived"); }}>
                  <Archive className="h-4 w-4" /> Archive
                </AButton>
                <AButton variant="danger" className="flex-1" onClick={() => setConfirmId(active.id)}>
                  <Trash2 className="h-4 w-4" /> Delete
                </AButton>
              </div>
            )}
            <p className="flex items-center gap-2 text-[11px] text-faint"><UserCheck className="h-3.5 w-3.5" /> Changes save instantly and log to the activity feed. <TagIcon className="h-3 w-3 opacity-0" /></p>
          </div>
        )}
      </Drawer>

      <Confirm open={!!confirmId} onClose={() => setConfirmId(null)}
        onConfirm={() => { if (confirmId) { deleteLead(confirmId); setActiveId(null); log("Lead deleted", confirmId); toast("Lead deleted"); } }}
        title="Delete this lead?" message="This permanently removes the lead and all its notes. This action is logged." />
    </div>
  );
}

export { STATUSES as LEAD_STATUSES };
export const leadSourceOptions = SOURCES;
export const newLeadId = newId;
