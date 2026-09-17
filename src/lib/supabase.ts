import { createClient } from "@supabase/supabase-js";
import { ActivityEntry, CMSContent, Lead, Visit } from "./types";

/* ------------------------------------------------------------------
   Supabase client — production configuration.
   Keys come ONLY from environment variables (never hardcoded):
     VITE_SUPABASE_URL
     VITE_SUPABASE_ANON_KEY
   Row Level Security is the real guard:
     · public  → read site_content, insert leads/visits/activity
     · admin   → full access after Supabase Auth sign-in
   If env vars are missing the app runs in local fallback mode.
------------------------------------------------------------------- */

const URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const ANON = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const SUPABASE_READY = Boolean(URL && ANON);

export const supabase = createClient(
  URL || "https://not-configured.supabase.co",
  ANON || "not-configured"
);

export const DOC_ID = "main";

function assertReady() {
  if (!SUPABASE_READY) throw new Error("Supabase env vars are not configured");
}

/* The content document excludes high-frequency tables (leads, visits,
   activity) — those sync through their own tables. */
export function buildDoc(content: CMSContent): Omit<CMSContent, "leads" | "visits" | "activity"> {
  const { leads: _l, visits: _v, activity: _a, ...doc } = content;
  return doc;
}

/* ---------------- site content document ---------------- */

export async function fetchSiteDoc(): Promise<{ data: Partial<CMSContent>; updated_at: string } | null> {
  assertReady();
  const { data, error } = await supabase
    .from("site_content").select("data, updated_at").eq("id", DOC_ID).maybeSingle();
  if (error) throw error;
  return data as { data: Partial<CMSContent>; updated_at: string } | null;
}

export async function saveSiteDoc(doc: unknown) {
  assertReady();
  const { error } = await supabase
    .from("site_content")
    .upsert({ id: DOC_ID, data: doc, updated_at: new Date().toISOString() });
  if (error) throw error;
}

/* ---------------- leads (admin read; public insert) ---------------- */

export async function fetchLeads(): Promise<Lead[]> {
  assertReady();
  const { data, error } = await supabase
    .from("leads").select("id, payload").order("created_at", { ascending: false }).limit(500);
  if (error) throw error;
  return (data || []).map((r) => r.payload as Lead);
}

export async function upsertLeadRow(lead: Lead) {
  assertReady();
  const { error } = await supabase.from("leads").upsert({ id: lead.id, payload: lead });
  if (error) throw error;
}

export async function deleteLeadRow(id: string) {
  assertReady();
  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) throw error;
}

/* ---------------- visits ---------------- */

export async function fetchVisits(): Promise<Visit[]> {
  assertReady();
  const { data, error } = await supabase
    .from("visits").select("t, path, device, source").order("t", { ascending: false }).limit(1000);
  if (error) throw error;
  return (data || [])
    .map((r) => ({
      t: Date.parse(r.t as unknown as string),
      path: r.path || "/",
      device: (r.device === "mobile" ? "mobile" : "desktop") as Visit["device"],
      source: r.source || "direct",
    }))
    .sort((a, b) => a.t - b.t);
}

export async function insertVisitRow(v: Visit) {
  assertReady();
  const { error } = await supabase.from("visits").insert({
    t: new Date(v.t).toISOString(), path: v.path, device: v.device, source: v.source,
  });
  if (error) throw error;
}

/* ---------------- activity ---------------- */

export async function fetchActivity(): Promise<ActivityEntry[]> {
  assertReady();
  const { data, error } = await supabase
    .from("activity").select("id, t, user_name, action, detail").order("t", { ascending: false }).limit(300);
  if (error) throw error;
  return (data || []).map((r) => ({ id: r.id, t: Number(r.t), user: r.user_name || "Admin", action: r.action || "", detail: r.detail || "" }));
}

export async function insertActivityRow(a: ActivityEntry) {
  assertReady();
  const { error } = await supabase.from("activity").insert({ id: a.id, t: a.t, user_name: a.user, action: a.action, detail: a.detail });
  if (error) throw error;
}

export async function clearActivityRows() {
  assertReady();
  const { error } = await supabase.from("activity").delete().neq("id", "");
  if (error) throw error;
}

/* ---------------- media storage ---------------- */

export function imageToWebpParts(file: File, maxW = 1200, quality = 0.82): Promise<{ blob: Blob; dataUrl: string; size: number }> {
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
        canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/webp", quality);
        canvas.toBlob((blob) => {
          if (!blob) { reject(new Error("encode failed")); return; }
          resolve({ blob, dataUrl, size: blob.size });
        }, "image/webp", quality);
      };
      img.onerror = reject;
      img.src = String(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* Uploads a blob to the public `media` bucket; returns its public URL or null on failure. */
export async function uploadToMediaBucket(blob: Blob, ext: string, contentType: string): Promise<string | null> {
  if (!SUPABASE_READY) return null;
  try {
    const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from("media").upload(path, blob, { contentType, cacheControl: "31536000", upsert: false });
    if (error) return null;
    const { data } = supabase.storage.from("media").getPublicUrl(path);
    return data.publicUrl || null;
  } catch {
    return null;
  }
}

/* Full pipeline: optimize image → try cloud storage → fallback inline data URL. */
export async function processAndStoreImage(file: File, maxW = 1200): Promise<{ url: string; size: number; cloud: boolean }> {
  const { blob, dataUrl, size } = await imageToWebpParts(file, maxW);
  const publicUrl = await uploadToMediaBucket(blob, "webp", "image/webp");
  if (publicUrl) return { url: publicUrl, size, cloud: true };
  return { url: dataUrl, size, cloud: false };
}
