"use client";

import { useMemo, useState, useTransition } from "react";
import { createClient } from "@supabase/supabase-js";
import { registerGalleryItem, createGalleryUploadUrl, updateGalleryItem, updateGalleryStatus } from "@/actions/admin-gallery";
import { formFieldClasses, interactiveStateClasses } from "@/lib/ui";
import type { GalleryCategory, GalleryItemStatus, GalleryMediaType } from "@/lib/db/schema";

type AdminItem = {
  id: string;
  category: GalleryCategory;
  mediaType: GalleryMediaType;
  title: string;
  caption: string | null;
  storagePath: string | null;
  posterPath: string | null;
  status: GalleryItemStatus;
  sortOrder: number;
  rejectionReason: string | null;
  previewUrl: string | null;
  mediaUrl: string | null;
  posterUrl: string | null;
  createdAt: string;
};

const categories: Array<{ value: GalleryCategory; label: string }> = [
  { value: "music", label: "Music" },
  { value: "books", label: "Books" },
  { value: "poetry", label: "Poetry" },
  { value: "short_films", label: "Short Films" },
];

const statuses: GalleryItemStatus[] = ["draft", "approved", "rejected", "archived"];
const galleryBucket = process.env.NEXT_PUBLIC_SUPABASE_GALLERY_BUCKET || "gallery-media";

function browserSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

async function uploadFile(file: File, category: GalleryCategory, variant: "media" | "poster") {
  const signed = await createGalleryUploadUrl({
    category,
    filename: file.name,
    contentType: file.type,
    size: file.size,
    variant,
  });
  if (signed.status === "error") throw new Error(signed.message);
  const { error } = await browserSupabase()
    .storage.from(galleryBucket)
    .uploadToSignedUrl(signed.path, signed.token, file);
  if (error) throw new Error("The file upload failed. Try again.");
  return signed.path;
}

export function AdminGalleryManager({ items }: { items: AdminItem[] }) {
  const [category, setCategory] = useState<GalleryCategory>("poetry");
  const [mediaType, setMediaType] = useState<GalleryMediaType>("image");
  const [libraryCategory, setLibraryCategory] = useState<GalleryCategory | "all">("all");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const mediaPreview = useMemo(() => (mediaFile ? URL.createObjectURL(mediaFile) : null), [mediaFile]);

  async function submitUpload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    const form = new FormData(event.currentTarget);
    if (!mediaFile) return setError("Choose the gallery media first.");
    setUploading(true);
    try {
      const storagePath = await uploadFile(mediaFile, category, "media");
      form.set("storagePath", storagePath);
      form.set("posterPath", "");
      form.set("category", category);
      form.set("mediaType", mediaType);
      const result = await registerGalleryItem(form);
      if (result.status === "error") throw new Error(result.message);
      setMessage(result.message);
      setMediaFile(null);
      event.currentTarget.reset();
      startTransition(() => window.location.reload());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="grid gap-8">
      <form onSubmit={submitUpload} className="grid gap-5 rounded-lg border border-cream/12 bg-cream/[0.04] p-6 md:p-8">
        <div>
          <h2 className="font-display text-2xl font-black">Add new work</h2>
          <p className="mt-1 text-sm text-cream/60">Uploads remain hidden until approved.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2"><span className="text-xs font-bold uppercase text-cream/60">Category</span><select name="category" value={category} onChange={(e) => setCategory(e.target.value as GalleryCategory)} className={formFieldClasses}>{categories.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
        </div>
        <label className="grid gap-2"><span className="text-xs font-bold uppercase text-cream/60">Title</span><input name="title" required maxLength={160} className={formFieldClasses} placeholder="Work title" /></label>
        <label className="grid gap-2"><span className="text-xs font-bold uppercase text-cream/60">Caption</span><textarea name="caption" maxLength={500} rows={2} className={`${formFieldClasses} py-3`} placeholder="Small caption or year" /></label>
        <label className="grid gap-2"><span className="text-xs font-bold uppercase text-cream/60">Media file</span><input required type="file" accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime" onChange={(e) => { const file = e.target.files?.[0] ?? null; const nextType: GalleryMediaType = file?.type.startsWith("video/") ? "video" : "image"; setMediaFile(file); setMediaType(nextType); }} className="text-sm text-cream/75 file:mr-3 file:rounded-md file:border-0 file:bg-cream file:px-3 file:py-2 file:font-bold file:text-ink" /></label>
        {mediaPreview ? <Preview src={mediaPreview} type={mediaType} /> : null}
        {error ? <p className="text-sm text-red-300" role="alert">{error}</p> : null}
        {message ? <p className="text-sm text-green-300" aria-live="polite">{message}</p> : null}
        <button type="submit" disabled={uploading || isPending} className={`inline-flex min-h-12 w-fit items-center justify-center rounded-md bg-red-600 px-5 py-3 text-sm font-bold uppercase text-white hover:bg-red-500 ${interactiveStateClasses}`}>{uploading ? "Uploading..." : "Save as Draft"}</button>
      </form>

      <section>
        <div className="flex items-end justify-between gap-4"><div><h2 className="font-display text-2xl font-black">Current gallery</h2><p className="mt-1 text-sm text-cream/60">Every item stays here. Archive anything you want hidden.</p></div><span className="text-sm text-cream/55">{items.length} items</span></div>
        <div className="mt-5 flex flex-wrap gap-2"><button type="button" onClick={() => setLibraryCategory("all")} className={`rounded-full border px-3 py-2 text-xs font-bold uppercase ${libraryCategory === "all" ? "border-brass bg-brass/15 text-brass" : "border-cream/20 text-cream/65"}`}>All ({items.length})</button>{categories.map((item) => { const count = items.filter((galleryItem) => galleryItem.category === item.value).length; return <button type="button" key={item.value} onClick={() => setLibraryCategory(item.value)} className={`rounded-full border px-3 py-2 text-xs font-bold uppercase ${libraryCategory === item.value ? "border-brass bg-brass/15 text-brass" : "border-cream/20 text-cream/65"}`}>{item.label} ({count})</button>; })}</div>
        <div className="mt-5 grid gap-4">{items.filter((item) => libraryCategory === "all" || item.category === libraryCategory).map((item) => <AdminItemCard key={item.id} item={item} />)}{items.filter((item) => libraryCategory === "all" || item.category === libraryCategory).length === 0 ? <p className="rounded-lg border border-dashed border-cream/20 p-8 text-sm text-cream/55">No work in this category yet.</p> : null}</div>
      </section>
    </div>
  );
}

function Preview({ src, type }: { src: string; type: GalleryMediaType }) {
  return type === "video" ? <video src={src} controls muted className="aspect-video max-h-64 w-full rounded-md bg-black object-contain" /> : <img src={src} alt="Selected preview" className="aspect-video max-h-64 w-full rounded-md bg-black object-contain" />;
}

function AdminItemCard({ item }: { item: AdminItem }) {
  const [category, setCategory] = useState(item.category);
  const [status, setStatus] = useState(item.status);
  return <article className="grid gap-5 rounded-lg border border-cream/12 bg-cream/[0.04] p-5 lg:grid-cols-[14rem_1fr_auto]">
    <div>{item.mediaUrl ? (item.mediaType === "video" ? <video src={item.mediaUrl} poster={item.posterUrl ?? undefined} controls muted className="aspect-[4/3] w-full rounded-md bg-black object-contain" /> : <img src={item.mediaUrl} alt="" className="aspect-[4/3] w-full rounded-md bg-black object-contain" />) : <div className="grid aspect-[4/3] place-items-center rounded-md bg-black text-xs uppercase text-cream/45">No preview</div>}</div>
    <div className="grid content-start gap-3"><div className="flex flex-wrap items-center gap-3"><h3 className="font-display text-2xl font-black">{item.title}</h3><span className="rounded-full border border-cream/20 px-2 py-1 text-[11px] font-bold uppercase text-cream/60">{item.status}</span></div><p className="text-sm uppercase tracking-wide text-cream/50">{item.category.replace("_", " ")} · {item.mediaType}</p>{item.caption ? <p className="text-sm text-cream/70">{item.caption}</p> : null}{item.rejectionReason ? <p className="text-sm text-red-300">Rejected: {item.rejectionReason}</p> : null}<details><summary className="cursor-pointer text-xs font-bold uppercase text-brass">Edit metadata</summary><form action={updateGalleryItem} className="mt-3 grid gap-3"><input type="hidden" name="id" value={item.id} /><input type="hidden" name="mediaType" value={item.mediaType} /><input type="hidden" name="storagePath" value={item.storagePath ?? "legacy"} /><input type="hidden" name="posterPath" value={item.posterPath ?? ""} /><label className="grid gap-1"><span className="text-xs uppercase text-cream/50">Title</span><input name="title" defaultValue={item.title} className={formFieldClasses} /></label><label className="grid gap-1"><span className="text-xs uppercase text-cream/50">Caption</span><textarea name="caption" defaultValue={item.caption ?? ""} rows={2} className={`${formFieldClasses} py-2`} /></label><div className="grid gap-3 sm:grid-cols-2"><select name="category" value={category} onChange={(e) => setCategory(e.target.value as GalleryCategory)} className={formFieldClasses}>{categories.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select><input name="sortOrder" type="number" min="0" defaultValue={item.sortOrder} className={formFieldClasses} /></div><button type="submit" className={`w-fit rounded-md border border-cream/20 px-3 py-2 text-xs font-bold uppercase hover:border-brass hover:text-brass ${interactiveStateClasses}`}>Save metadata</button></form></details></div>
    <div className="flex flex-wrap content-start gap-2 lg:max-w-40 lg:flex-col"><select value={status} onChange={(e) => setStatus(e.target.value as GalleryItemStatus)} className={formFieldClasses}>{statuses.map((value) => <option key={value} value={value}>{value}</option>)}</select><form action={updateGalleryStatus}><input type="hidden" name="id" value={item.id} /><input type="hidden" name="status" value={status} /><input type="hidden" name="rejectionReason" value={status === "rejected" ? "Review in admin" : ""} /><button type="submit" className={`rounded-md bg-red-600 px-3 py-2 text-xs font-bold uppercase text-white hover:bg-red-500 ${interactiveStateClasses}`}>Update status</button></form></div>
  </article>;
}
