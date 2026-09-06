"use client";

import { useEffect, useState } from "react";
import { BookOpen, ExternalLink, X } from "lucide-react";
import { SafeImage } from "@/components/safe-image";
import type { GalleryItem } from "@/lib/content";
import { interactiveStateClasses } from "@/lib/ui";

export function BookGallery({ items }: { items: GalleryItem[] }) {
  const [active, setActive] = useState<GalleryItem | null>(null);
  useEffect(() => {
    if (!active) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const close = (event: KeyboardEvent) => event.key === "Escape" && setActive(null);
    document.addEventListener("keydown", close);
    return () => { document.body.style.overflow = overflow; document.removeEventListener("keydown", close); };
  }, [active]);

  return <>
    <div className="mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-5">
      {items.map((item) => <article key={`${item.title}-${item.image}`} className="gallery-frame w-60 shrink-0 snap-start overflow-hidden bg-white shadow-soft">
        <button type="button" onClick={() => setActive(item)} className={`group relative block aspect-[3/4] w-full overflow-hidden bg-ink ${interactiveStateClasses}`} aria-label={`Preview ${item.title}`}>
          <SafeImage src={item.image ?? ""} alt={item.title} fill sizes="240px" className="object-cover transition duration-500 group-hover:scale-105" />
          <span className="absolute inset-x-4 bottom-4 inline-flex min-h-10 items-center justify-center rounded-md bg-ink/75 px-3 text-xs font-bold uppercase text-cream backdrop-blur-sm">Preview</span>
        </button>
        <div className="p-4 text-ink"><h3 className="font-display text-xl font-black leading-tight">{item.title}</h3><div className="mt-3 flex items-center justify-between gap-3"><strong className="text-sm text-red-700">{item.price}</strong>{item.purchaseUrl ? <a href={item.purchaseUrl} target="_blank" rel="noopener noreferrer" className={`inline-flex min-h-10 items-center rounded-md bg-red-600 px-3 text-xs font-bold uppercase text-white ${interactiveStateClasses}`}>Buy book</a> : null}</div></div>
      </article>)}
    </div>
    {active ? <div className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-ink/90 p-4 backdrop-blur-md" role="dialog" aria-modal="true" aria-label={`${active.title} preview`} onClick={() => setActive(null)}>
      <button type="button" onClick={() => setActive(null)} className={`fixed right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full border border-cream/30 bg-ink text-cream ${interactiveStateClasses}`} aria-label="Close preview"><X aria-hidden="true" /></button>
      <div className="my-auto grid w-full max-w-5xl overflow-hidden rounded-lg bg-cream text-ink shadow-soft md:grid-cols-[0.85fr_1.15fr]" onClick={(event) => event.stopPropagation()}>
        <div className="relative min-h-[22rem] bg-ink md:min-h-[38rem]"><SafeImage src={active.image ?? ""} alt={active.title} fill sizes="(min-width: 768px) 42vw, 100vw" className="object-contain" /></div>
        <div className="flex max-h-[78svh] flex-col overflow-y-auto p-6 md:p-10"><BookOpen className="h-6 w-6 text-red-700" aria-hidden="true" /><h3 className="mt-4 font-display text-3xl font-black md:text-5xl">{active.title}</h3><p className="mt-3 font-bold text-red-700">{active.price}</p>{active.excerpt ? <p className="mt-7 whitespace-pre-line font-display text-xl leading-relaxed text-ink/75">{active.excerpt}</p> : null}{active.sampleImages?.length ? <div className="mt-7 grid gap-4 sm:grid-cols-2">{active.sampleImages.map((src, index) => <div key={src} className="relative aspect-[3/4] overflow-hidden border border-ink/10 bg-white"><SafeImage src={src} alt={`${active.title} sample page ${index + 1}`} fill sizes="(min-width: 768px) 20vw, 80vw" className="object-contain" /></div>)}</div> : null}{active.purchaseUrl ? <a href={active.purchaseUrl} target="_blank" rel="noopener noreferrer" className={`mt-8 inline-flex min-h-12 w-fit items-center gap-2 rounded-md bg-red-600 px-5 text-sm font-bold uppercase text-white ${interactiveStateClasses}`}>Buy book <ExternalLink className="h-4 w-4" aria-hidden="true" /></a> : null}</div>
      </div>
    </div> : null}
  </>;
}
