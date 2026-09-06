"use client";

import { useMemo, useState, useTransition } from "react";
import { createClient } from "@supabase/supabase-js";
import { createPortfolioItem, createPortfolioUploadUrl, previewPortfolioUrl, updatePortfolioItem, updatePortfolioStatus } from "@/actions/admin-portfolio";
import type { GalleryItemStatus, PortfolioContentType, PortfolioProvider } from "@/lib/db/schema";
import { portfolioCreditOptions } from "@/lib/portfolio-links";
import { formFieldClasses, interactiveStateClasses } from "@/lib/ui";

type AdminPortfolioItem = { id: string; title: string; provider: PortfolioProvider; contentType: PortfolioContentType; sourceUrl: string | null; storagePath: string | null; artworkUrl: string | null; artworkPath: string | null; credits: string[]; status: GalleryItemStatus; rejectionReason: string | null };
const lanes = [{ value: "links", label: "Links" }, { value: "uploads", label: "Uploads" }] as const;
const statuses: GalleryItemStatus[] = ["draft", "approved", "rejected", "archived"];

function CreditFields({ defaults = [] }: { defaults?: string[] }) {
  return <fieldset><legend className="text-xs font-bold uppercase text-cream/60">Credits</legend><div className="mt-2 flex flex-wrap gap-3">{portfolioCreditOptions.map((credit) => <label key={credit} className="flex items-center gap-2 text-sm text-cream/75"><input type="checkbox" name="credits" value={credit} defaultChecked={defaults.includes(credit)} />{credit}</label>)}</div></fieldset>;
}

function browserSupabase(url: string, anonKey: string) {
  return createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
}

async function upload(file: File, variant: "media" | "artwork", url: string, anonKey: string, bucket: string) {
  const signed = await createPortfolioUploadUrl({ filename: file.name, contentType: file.type, size: file.size, variant });
  if (signed.status === "error") throw new Error(signed.message);
  const { error } = await browserSupabase(url, anonKey).storage.from(bucket).uploadToSignedUrl(signed.path, signed.token, file);
  if (error) throw new Error(`${variant === "artwork" ? "Artwork" : "Media"} upload failed. Try again.`);
  return signed;
}

export function AdminPortfolioManager({ items, supabaseUrl, supabaseAnonKey, bucketName }: { items: AdminPortfolioItem[]; supabaseUrl: string; supabaseAnonKey: string; bucketName: string }) {
  const [lane, setLane] = useState<"links" | "uploads">("links");
  const [showAdd, setShowAdd] = useState(false);
  const [mode, setMode] = useState<"link" | "upload">("link");
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [artworkUrl, setArtworkUrl] = useState("");
  const [provider, setProvider] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [artworkFile, setArtworkFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const mediaPreview = useMemo(() => mediaFile ? URL.createObjectURL(mediaFile) : null, [mediaFile]);
  const artworkPreview = useMemo(() => artworkFile ? URL.createObjectURL(artworkFile) : artworkUrl, [artworkFile, artworkUrl]);

  function changeMode(next: "link" | "upload") {
    setMode(next); setError(""); setMessage(""); setProvider(next === "upload" ? "upload" : "");
  }

  async function preview() {
    setError(""); setMessage("");
    const result = await previewPortfolioUrl(url);
    if (result.status === "error") return setError(result.message);
    setUrl(result.sourceUrl); setTitle(result.title); setArtworkUrl(result.artworkUrl); setProvider(result.provider);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setMessage(""); setUploading(true);
    const form = new FormData(event.currentTarget);
    try {
      if (mode === "upload") {
        if (!mediaFile) throw new Error("Choose an audio or video file.");
        const media = await upload(mediaFile, "media", supabaseUrl, supabaseAnonKey, bucketName);
        form.set("storagePath", media.path); form.set("mediaKind", media.mediaKind);
        if (artworkFile) {
          const artwork = await upload(artworkFile, "artwork", supabaseUrl, supabaseAnonKey, bucketName);
          form.set("artworkPath", artwork.path);
        }
        form.set("sourceUrl", ""); form.set("artworkUrl", "");
      } else {
        form.set("storagePath", ""); form.set("artworkPath", "");
      }
      const result = await createPortfolioItem(form);
      if (result.status === "error") throw new Error(result.message);
      setMessage(result.message);
      startTransition(() => window.location.reload());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save this work.");
    } finally { setUploading(false); }
  }

  const visible = items.filter((item) => lane === "uploads" ? item.provider === "upload" : item.provider !== "upload");
  return <div className="grid gap-8">
    <form onSubmit={submit} className={showAdd ? "fixed inset-0 z-50 grid overflow-y-auto bg-ink/80 p-4 backdrop-blur-sm md:p-8" : "hidden"}>
      <div className="m-auto grid w-full max-w-3xl gap-5 rounded-lg border border-cream/12 bg-ink p-6 shadow-soft md:p-8">
        <div className="flex items-start justify-between gap-4"><div><h2 className="font-display text-2xl font-black">Add portfolio work</h2><p className="mt-1 text-sm text-cream/60">Add a link or upload the work directly.</p></div><button type="button" onClick={() => setShowAdd(false)} className="rounded-md border border-cream/20 px-3 py-2 text-xs font-bold uppercase">Close</button></div>
        <div className="flex gap-2"><button type="button" onClick={() => changeMode("link")} className={`rounded-full border px-4 py-2 text-xs font-bold uppercase ${mode === "link" ? "border-brass text-brass" : "border-cream/20 text-cream/60"}`}>Add link</button><button type="button" onClick={() => changeMode("upload")} className={`rounded-full border px-4 py-2 text-xs font-bold uppercase ${mode === "upload" ? "border-brass text-brass" : "border-cream/20 text-cream/60"}`}>Upload media</button></div>
        {mode === "link" ? <label className="grid gap-2"><span className="text-xs font-bold uppercase text-cream/60">Streaming link</span><div className="flex gap-2"><input name="sourceUrl" required type="url" value={url} onChange={(e) => { setUrl(e.target.value); setProvider(""); }} className={`${formFieldClasses} min-w-0 flex-1`} placeholder="https://..." /><button type="button" onClick={preview} disabled={!url || isPending} className="rounded-md border border-brass px-4 text-xs font-bold uppercase text-brass">Preview</button></div></label> : <label className="grid gap-2"><span className="text-xs font-bold uppercase text-cream/60">Audio or video</span><input required type="file" accept="audio/mpeg,audio/wav,audio/mp4,audio/aac,audio/ogg,video/mp4,video/webm,video/quicktime" onChange={(e) => setMediaFile(e.target.files?.[0] ?? null)} className="text-sm text-cream/75 file:mr-3 file:rounded-md file:border-0 file:bg-cream file:px-3 file:py-2 file:font-bold file:text-ink" /></label>}
        {provider ? <p className="text-xs font-bold uppercase tracking-wide text-brass">Source: {provider}</p> : null}
        <label className="grid gap-2"><span className="text-xs font-bold uppercase text-cream/60">Title</span><input name="title" required maxLength={180} value={title} onChange={(e) => setTitle(e.target.value)} className={formFieldClasses} /></label>
        {mode === "link" ? <label className="grid gap-2"><span className="text-xs font-bold uppercase text-cream/60">Artwork URL (optional)</span><input name="artworkUrl" type="url" value={artworkUrl} onChange={(e) => setArtworkUrl(e.target.value)} className={formFieldClasses} /></label> : <label className="grid gap-2"><span className="text-xs font-bold uppercase text-cream/60">Artwork (optional)</span><input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(e) => setArtworkFile(e.target.files?.[0] ?? null)} className="text-sm text-cream/75 file:mr-3 file:rounded-md file:border-0 file:bg-cream file:px-3 file:py-2 file:font-bold file:text-ink" /></label>}
        {artworkPreview ? <img src={artworkPreview} alt="Artwork preview" className="aspect-square w-40 rounded-md object-cover" /> : mediaPreview && mediaFile?.type.startsWith("video/") ? <video src={mediaPreview} controls muted className="aspect-video max-h-52 w-full bg-black object-contain" /> : mediaPreview ? <audio src={mediaPreview} controls className="w-full" /> : null}
        <CreditFields />
        {error ? <p role="alert" className="text-sm text-red-300">{error}</p> : null}{message ? <p className="text-sm text-green-300">{message}</p> : null}
        <button type="submit" disabled={uploading || isPending || (mode === "link" && !provider)} className={`w-fit rounded-md bg-red-600 px-5 py-3 text-xs font-bold uppercase text-white ${interactiveStateClasses}`}>{uploading ? "Uploading..." : "Save as draft"}</button>
      </div>
    </form>
    <section><div className="flex justify-end"><button type="button" onClick={() => setShowAdd(true)} className={`rounded-md bg-red-600 px-4 py-3 text-xs font-bold uppercase text-white ${interactiveStateClasses}`}>Add work</button></div><div className="mt-5 flex flex-wrap justify-center gap-2">{lanes.map((item) => { const count = items.filter((work) => item.value === "uploads" ? work.provider === "upload" : work.provider !== "upload").length; return <button type="button" key={item.value} onClick={() => setLane(item.value)} className={`rounded-full border px-4 py-2 text-xs font-bold uppercase ${lane === item.value ? "border-brass bg-brass/15 text-brass" : "border-cream/20 text-cream/65"}`}>{item.label} ({count})</button>; })}</div><div className="mt-6 grid gap-4">{visible.map((item) => <AdminPortfolioCard key={item.id} item={item} supabaseUrl={supabaseUrl} bucketName={bucketName} />)}{visible.length === 0 ? <p className="rounded-lg border border-dashed border-cream/20 p-8 text-center text-sm text-cream/55">No work in this section yet.</p> : null}</div></section>
  </div>;
}

function AdminPortfolioCard({ item, supabaseUrl, bucketName }: { item: AdminPortfolioItem; supabaseUrl: string; bucketName: string }) {
  const [status, setStatus] = useState(item.status);
  const publicUrl = (path: string | null) => path ? `${supabaseUrl}/storage/v1/object/public/${bucketName}/${path}` : null;
  const artwork = publicUrl(item.artworkPath) ?? item.artworkUrl;
  const media = publicUrl(item.storagePath);
  return <article className="grid gap-5 rounded-lg border border-cream/12 bg-cream/[0.04] p-5 lg:grid-cols-[10rem_1fr_auto]">
    {artwork ? <img src={artwork} alt="" className="aspect-square w-full rounded-md object-cover" /> : <div className="grid aspect-square place-items-center rounded-md bg-black text-cream/30">TB</div>}
    <div className="grid content-start gap-3"><div className="flex flex-wrap items-center gap-3"><h3 className="font-display text-2xl font-black">{item.title}</h3><span className="rounded-full border border-cream/20 px-2 py-1 text-[11px] font-bold uppercase text-cream/60">{item.status}</span></div><p className="text-xs font-bold uppercase text-brass">{item.provider} · {item.contentType}</p><p className="text-sm text-cream/65">{item.credits.join(" · ")}</p>{media ? item.contentType === "video" ? <video src={media} controls className="max-h-52 w-full bg-black" /> : <audio src={media} controls className="w-full" /> : item.sourceUrl ? <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="w-fit text-xs font-bold uppercase text-cream/70 underline">Preview source</a> : null}<details><summary className="cursor-pointer text-xs font-bold uppercase text-brass">Edit work</summary><form action={updatePortfolioItem} className="mt-4 grid gap-3"><input type="hidden" name="id" value={item.id} /><label className="grid gap-1"><span className="text-xs uppercase text-cream/50">Title</span><input name="title" defaultValue={item.title} className={formFieldClasses} /></label><label className="grid gap-1"><span className="text-xs uppercase text-cream/50">Artwork URL</span><input name="artworkUrl" type="url" defaultValue={item.artworkUrl ?? ""} className={formFieldClasses} /></label><CreditFields defaults={item.credits} /><button type="submit" className="w-fit rounded-md border border-cream/20 px-3 py-2 text-xs font-bold uppercase">Save changes</button></form></details></div>
    <div className="flex flex-wrap content-start gap-2 lg:max-w-40 lg:flex-col"><select value={status} onChange={(e) => setStatus(e.target.value as GalleryItemStatus)} className={formFieldClasses}>{statuses.map((value) => <option key={value} value={value}>{value}</option>)}</select><form action={updatePortfolioStatus}><input type="hidden" name="id" value={item.id} /><input type="hidden" name="status" value={status} /><input type="hidden" name="rejectionReason" value={status === "rejected" ? "Review in admin" : ""} /><button type="submit" className="rounded-md bg-red-600 px-3 py-2 text-xs font-bold uppercase text-white">Update status</button></form></div>
  </article>;
}
