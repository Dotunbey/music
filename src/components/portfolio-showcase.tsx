"use client";

import { useState } from "react";
import { ArrowUpRight, Play } from "lucide-react";
import { PortfolioPlayer, PortfolioRecord } from "./portfolio-player";
import type { PublicPortfolioItem } from "@/lib/portfolio";
import { interactiveStateClasses } from "@/lib/ui";

const providerLabels = { spotify: "Spotify", youtube: "YouTube", audiomack: "Audiomack", external: "Listen", upload: "Tami Bedford" } as const;

export function PortfolioShowcase({ items }: { items: PublicPortfolioItem[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeItem = items.find((item) => item.id === activeId) ?? null;

  if (items.length === 0) return <p className="mt-12 border-t border-cream/12 py-10 text-sm uppercase tracking-wide text-cream/55">Selected work is being prepared.</p>;

  return (
    <>
      <div className="mt-14 flex snap-x snap-mandatory flex-nowrap gap-5 overflow-x-auto overscroll-x-contain pb-5 [scrollbar-width:thin] md:gap-7">
        {items.map((item) => (
          <article key={item.id} className="w-44 shrink-0 snap-start overflow-hidden border border-red-600/15 bg-white sm:w-52">
            <button type="button" aria-label={`Play ${item.title}`} disabled={!item.embedUrl && !item.mediaUrl} onClick={() => setActiveId(item.id)} className="block w-full p-3 focus-visible:outline-2 focus-visible:outline-red-600 disabled:cursor-default"><PortfolioRecord artwork={item.artworkUrl} /></button>
            <div className="p-4">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-red-700">{providerLabels[item.provider]}</p>
              <h3 className="font-display text-lg font-black leading-tight">{item.title}</h3>
              <p className="mt-2 text-[10px] font-bold uppercase leading-5 tracking-wide text-brass">{item.credits.join(" · ")}</p>
              <div className="mt-4 flex items-center justify-between gap-2">
                {item.embedUrl || item.mediaUrl ? <button type="button" onClick={() => setActiveId(item.id)} className={`inline-flex min-h-9 items-center gap-2 rounded-md bg-red-600 px-3 py-2 text-[10px] font-bold uppercase text-white hover:bg-red-500 ${interactiveStateClasses}`}><Play className="h-3.5 w-3.5" aria-hidden="true" />{item.contentType === "video" ? "Watch" : "Listen"}</button> : null}
                {item.sourceUrl ? <a href={item.sourceUrl} target="_blank" rel="noreferrer" aria-label={`Open ${item.title}`} className={`grid h-9 w-9 place-items-center rounded-md border border-cream/20 text-cream hover:border-brass hover:text-brass ${interactiveStateClasses}`}><ArrowUpRight className="h-4 w-4" aria-hidden="true" /></a> : null}
              </div>
            </div>
          </article>
        ))}
      </div>

      {activeItem && (activeItem.embedUrl || activeItem.mediaUrl) ? (
        <PortfolioPlayer key={activeItem.id} item={activeItem} onClose={() => setActiveId(null)} />
      ) : null}
    </>
  );
}
