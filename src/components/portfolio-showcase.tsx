"use client";

import { useState } from "react";
import { ArrowUpRight, Play, X } from "lucide-react";
import type { PublicPortfolioItem } from "@/lib/portfolio";
import { interactiveStateClasses } from "@/lib/ui";

const providerLabels = { spotify: "Spotify", youtube: "YouTube", audiomack: "Audiomack" } as const;

export function PortfolioShowcase({ items }: { items: PublicPortfolioItem[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeItem = items.find((item) => item.id === activeId) ?? null;

  if (items.length === 0) return <p className="mt-12 border-t border-cream/12 py-10 text-sm uppercase tracking-wide text-cream/55">Selected work is being prepared.</p>;

  return (
    <>
      <div className="mt-14 flex snap-x snap-mandatory flex-nowrap gap-5 overflow-x-auto overscroll-x-contain pb-5 [scrollbar-width:thin] md:gap-7">
        {items.map((item) => (
          <article key={item.id} className="w-44 shrink-0 snap-start overflow-hidden border border-cream/12 bg-cream/[0.04] sm:w-52">
            <div className="relative aspect-[9/16] overflow-hidden bg-ink">
              {item.artworkUrl ? <img src={item.artworkUrl} alt="" className="h-full w-full object-cover transition duration-700 hover:scale-[1.03]" loading="lazy" /> : <div className="grid h-full place-items-center font-display text-5xl font-black text-cream/20">TB</div>}
              <span className="absolute left-3 top-3 bg-ink/75 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-cream backdrop-blur-sm">{providerLabels[item.provider]}</span>
            </div>
            <div className="p-4">
              <h3 className="font-display text-lg font-black leading-tight">{item.title}</h3>
              <p className="mt-2 text-[10px] font-bold uppercase leading-5 tracking-wide text-brass">{item.credits.join(" · ")}</p>
              <div className="mt-4 flex items-center justify-between gap-2">
                {item.embedUrl ? <button type="button" onClick={() => setActiveId(item.id)} className={`inline-flex min-h-9 items-center gap-2 rounded-md bg-red-600 px-3 py-2 text-[10px] font-bold uppercase text-white hover:bg-red-500 ${interactiveStateClasses}`}><Play className="h-3.5 w-3.5" aria-hidden="true" />{item.provider === "youtube" ? "Watch" : "Listen"}</button> : null}
                <a href={item.sourceUrl} target="_blank" rel="noreferrer" aria-label={`Open ${item.title} in ${providerLabels[item.provider]}`} className={`grid h-9 w-9 place-items-center rounded-md border border-cream/20 text-cream hover:border-brass hover:text-brass ${interactiveStateClasses}`}><ArrowUpRight className="h-4 w-4" aria-hidden="true" /></a>
              </div>
            </div>
          </article>
        ))}
      </div>

      {activeItem?.embedUrl ? (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-ink/85 p-4 backdrop-blur-md" role="dialog" aria-modal="true" aria-label={activeItem.title} onClick={() => setActiveId(null)}>
          <button type="button" onClick={() => setActiveId(null)} className={`absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-cream/25 bg-ink/70 text-cream hover:border-red-500 ${interactiveStateClasses}`} aria-label="Close player"><X aria-hidden="true" /></button>
          <div className={`w-full overflow-hidden rounded-lg border border-cream/15 bg-ink shadow-soft ${activeItem.provider === "youtube" ? "aspect-video max-w-4xl" : "h-[352px] max-w-xl"}`} onClick={(event) => event.stopPropagation()}>
            <iframe src={activeItem.embedUrl} title={`${activeItem.title} on ${providerLabels[activeItem.provider]}`} className="h-full w-full border-0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" allowFullScreen />
          </div>
        </div>
      ) : null}
    </>
  );
}
