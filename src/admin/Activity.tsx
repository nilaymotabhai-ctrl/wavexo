import { useMemo, useState } from "react";
import { ScrollText, Trash2 } from "lucide-react";
import { useCMS, timeAgo, formatDate } from "../lib/store";
import { AButton, ACard, ASearch, SectionTitle, Pill, Confirm, toast } from "./ui";

export default function ActivityLog() {
  const { content, save, can } = useCMS();
  const [q, setQ] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);

  const rows = useMemo(() => {
    if (!q) return content.activity;
    return content.activity.filter((a) => `${a.user} ${a.action} ${a.detail}`.toLowerCase().includes(q.toLowerCase()));
  }, [content.activity, q]);

  return (
    <div>
      <SectionTitle title="Activity Log"
        sub="Every important action in this workspace — logins, edits, deletions and new leads — with timestamps."
        right={can("settings") && content.activity.length > 0 && (
          <AButton variant="danger" onClick={() => setConfirmClear(true)}><Trash2 className="h-4 w-4" /> Clear log</AButton>
        )}
      />
      <div className="mb-5 max-w-md"><ASearch value={q} onChange={setQ} placeholder="Search activity…" /></div>

      {rows.length === 0 ? (
        <ACard className="py-16 text-center">
          <ScrollText className="mx-auto h-8 w-8 text-faint" />
          <p className="font-display mt-4 text-lg font-semibold text-white">No activity yet</p>
          <p className="mt-1 text-sm text-faint">Actions you and your team take will show up here.</p>
        </ACard>
      ) : (
        <div className="space-y-2">
          {rows.map((a) => (
            <div key={a.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3.5">
              <span className="h-2 w-2 shrink-0 rounded-full bg-gradient-to-r from-cyanx to-magentax" />
              <p className="text-sm font-semibold text-white">{a.action}</p>
              <Pill>{a.user}</Pill>
              <p className="min-w-0 flex-1 truncate text-[12px] text-mist">{a.detail}</p>
              <p className="text-[11px] text-faint">{timeAgo(a.t)} · {formatDate(a.t)}</p>
            </div>
          ))}
        </div>
      )}

      <Confirm open={confirmClear} onClose={() => setConfirmClear(false)}
        onConfirm={() => { save({ activity: [] }); toast("Activity log cleared"); }}
        title="Clear the activity log?" message="History up to this point will be permanently removed." />
    </div>
  );
}
