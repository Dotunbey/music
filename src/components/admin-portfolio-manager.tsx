"use client";

import { useState, useTransition } from "react";
import { createPortfolioItem, previewPortfolioUrl, updatePortfolioItem, updatePortfolioStatus } from "@/actions/admin-portfolio";
import type { GalleryItemStatus, PortfolioContentType, PortfolioProvider } from "@/lib/db/schema";
import { portfolioCreditOptions } from "@/lib/portfolio-links";
import { formFieldClasses, interactiveStateClasses } from "@/lib/ui";

type AdminPortfolioItem = { id: string; title: string; provider: PortfolioProvider; contentType: PortfolioContentType; sourceUrl: string; artworkUrl: string | null; credits: string[]; status: GalleryItemStatus; sortOrder: number; rejectionReason: string | null };
const providers: Array<{ value: PortfolioProvider; label: string }> = [{ value: "spotify", label: "Spotify" }, { value: "youtube", label: "YouTube" }, { value: "audiomack", label: "Audiomack" }];
const statuses: GalleryItemStatus[] = ["draft", "approved", "rejected", "archived"];

function CreditFields({ defaults = [] }: { defaults?: string[] }) {
  return <fieldset><legend className="text-xs font-bold uppercase text-cream/60">Credits</legend><div className="mt-2 flex flex-wrap gap-3">{portfolioCreditOptions.map((credit) => <label key={credit} className="flex items-center gap-2 text-sm text-cream/75"><input type="checkbox" name="credits" value={credit} defaultChecked={defaults.includes(credit)} />{credit}</label>)}</div></fieldset>;
}

export function AdminPortfolioManager({ items }: { items: AdminPortfolioItem[] }) {
  const [lane, setLane] = useState<PortfolioProvider>("spotify");
  const [showAdd, setShowAdd] = useState(false);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [artworkUrl, setArtworkUrl] = useState("");
  const [provider, setProvider] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  async function preview() {
    setError(""); setMessage("");
    const result = await previewPortfolioUrl(url);
    if (result.status === "error") return setError(result.message);
    setUrl(result.sourceUrl); setTitle(result.title); setArtworkUrl(result.artworkUrl); setProvider(result.provider);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setMessage("");
    const result = await createPortfolioItem(new FormData(event.currentTarget));
    if (result.status === "error") return setError(result.message);
    setMessage(result.message);
    startTransition(() => window.location.reload());
  }

  const visible = items.filter((item) => item.provider === lane);
  return <div className="grid gap-8">
    <form onSubmit={submit} className={showAdd ? "fixed inset-0 z-50 grid overflow-y-auto bg-ink/80 p-4 backdrop-blur-sm md:p-8" : "hidden"}>
      <div className="m-auto grid w-full max-w-3xl gap-5 rounded-lg border border-cream/12 bg-ink p-6 shadow-soft md:p-8">
        <div className="flex items-start justify-between gap-4"><div><h2 className="font-display text-2xl font-black">Add portfolio work</h2><p className="mt-1 text-sm text-cream/60">Paste a streaming link, review it, then save the draft.</p></div><button type="button" onClick={() => setShowAdd(false)} className="rounded-md border border-cream/20 px-3 py-2 text-xs font-bold uppercase">Close</button></div>
        <label className="grid gap-2"><span className="text-xs font-bold uppercase text-cream/60">Spotify, YouTube, or Audiomack URL</span><div className="flex gap-2"><input name="sourceUrl" required type="url" value={url} onChange={(e) => { setUrl(e.target.value); setProvider(""); }} className={`${formFieldClasses} min-w-0 flex-1`} /><button type="button" onClick={preview} disabled={!url || isPending} className="rounded-md border border-brass px-4 text-xs font-bold uppercase text-brass">Preview</button></div></label>
        {provider ? <p className="text-xs font-bold uppercase tracking-wide text-brass">Detected: {provider}</p> : null}
        <label className="grid gap-2"><span className="text-xs font-bold uppercase text-cream/60">Title</span><input name="title" required maxLength={180} value={title} onChange={(e) => setTitle(e.target.value)} className={formFieldClasses} /></label>
        <label className="grid gap-2"><span className="text-xs font-bold uppercase text-cream/60">Artwork URL</span><input name="artworkUrl" type="url" value={artworkUrl} onChange={(e) => setArtworkUrl(e.target.value)} className={formFieldClasses} /></label>
        {artworkUrl ? <img src={artworkUrl} alt="Metadata preview" className="aspect-square w-48 rounded-md object-cover" /> : null}
        <CreditFields />
        {error ? <p role="alert" className="text-sm text-red-300">{error}</p> : null}{message ? <p className="text-sm text-green-300">{message}</p> : null}
        <button type="submit" disabled={isPending || !provider} className={`w-fit rounded-md bg-red-600 px-5 py-3 text-xs font-bold uppercase text-white ${interactiveStateClasses}`}>{isPending ? "Saving..." : "Save as draft"}</button>
      </div>
    </form>
    <section>
      <div className="flex justify-end"><button type="button" onClick={() => setShowAdd(true)} className={`rounded-md bg-red-600 px-4 py-3 text-xs font-bold uppercase text-white ${interactiveStateClasses}`}>Add work</button></div>
      <div className="mt-5 flex flex-wrap justify-center gap-2">{providers.map((item) => <button type="button" key={item.value} onClick={() => setLane(item.value)} className={`rounded-full border px-4 py-2 text-xs font-bold uppercase ${lane === item.value ? "border-brass bg-brass/15 text-brass" : "border-cream/20 text-cream/65"}`}>{item.label} ({items.filter((work) => work.provider === item.value).length})</button>)}</div>
      <div className="mt-6 grid gap-4">{visible.map((item) => <AdminPortfolioCard key={item.id} item={item} />)}{visible.length === 0 ? <p className="rounded-lg border border-dashed border-cream/20 p-8 text-center text-sm text-cream/55">No work from this provider yet.</p> : null}</div>
    </section>
  </div>;
}

function AdminPortfolioCard({ item }: { item: AdminPortfolioItem }) {
  const [status, setStatus] = useState(item.status);
  return <article className="grid gap-5 rounded-lg border border-cream/12 bg-cream/[0.04] p-5 lg:grid-cols-[10rem_1fr_auto]">
    {item.artworkUrl ? <img src={item.artworkUrl} alt="" className="aspect-square w-full rounded-md object-cover" /> : <div className="grid aspect-square place-items-center rounded-md bg-black text-cream/30">TB</div>}
    <div className="grid content-start gap-3"><div className="flex flex-wrap items-center gap-3"><h3 className="font-display text-2xl font-black">{item.title}</h3><span className="rounded-full border border-cream/20 px-2 py-1 text-[11px] font-bold uppercase text-cream/60">{item.status}</span></div><p className="text-xs font-bold uppercase text-brass">{item.provider} · {item.contentType}</p><p className="text-sm text-cream/65">{item.credits.join(" · ")}</p><a href={item.sourceUrl} target="_blank" rel="noreferrer" className="w-fit text-xs font-bold uppercase text-cream/70 underline">Preview source</a>
      <details><summary className="cursor-pointer text-xs font-bold uppercase text-brass">Edit work</summary><form action={updatePortfolioItem} className="mt-4 grid gap-3"><input type="hidden" name="id" value={item.id} /><label className="grid gap-1"><span className="text-xs uppercase text-cream/50">Title</span><input name="title" defaultValue={item.title} className={formFieldClasses} /></label><label className="grid gap-1"><span className="text-xs uppercase text-cream/50">Source URL</span><input name="sourceUrl" type="url" defaultValue={item.sourceUrl} className={formFieldClasses} /></label><label className="grid gap-1"><span className="text-xs uppercase text-cream/50">Artwork URL</span><input name="artworkUrl" type="url" defaultValue={item.artworkUrl ?? ""} className={formFieldClasses} /></label><CreditFields defaults={item.credits} /><label className="grid max-w-40 gap-1"><span className="text-xs uppercase text-cream/50">Display order</span><input name="sortOrder" type="number" min="0" defaultValue={item.sortOrder} className={formFieldClasses} /></label><button type="submit" className="w-fit rounded-md border border-cream/20 px-3 py-2 text-xs font-bold uppercase">Save changes</button></form></details>
    </div>
    <div className="flex flex-wrap content-start gap-2 lg:max-w-40 lg:flex-col"><select value={status} onChange={(e) => setStatus(e.target.value as GalleryItemStatus)} className={formFieldClasses}>{statuses.map((value) => <option key={value} value={value}>{value}</option>)}</select><form action={updatePortfolioStatus}><input type="hidden" name="id" value={item.id} /><input type="hidden" name="status" value={status} /><input type="hidden" name="rejectionReason" value={status === "rejected" ? "Review in admin" : ""} /><button type="submit" className="rounded-md bg-red-600 px-3 py-2 text-xs font-bold uppercase text-white">Update status</button></form></div>
  </article>;
}
