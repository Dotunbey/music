"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ExternalLink, Play, X } from "lucide-react";
import { SafeImage } from "@/components/safe-image";
import type { GalleryItem } from "@/lib/content";
import { interactiveStateClasses } from "@/lib/ui";

type HomeGalleryItem = GalleryItem & {
  id: string;
  category: "music" | "books" | "poetry" | "short_films";
};

const frameStyles = [
  "salon-frame--portrait salon-frame--black",
  "salon-frame--landscape salon-frame--wood",
  "salon-frame--square salon-frame--brass",
  "salon-frame--round salon-frame--black",
  "salon-frame--small-portrait salon-frame--cream",
  "salon-frame--wide salon-frame--wood",
  "salon-frame--small-square salon-frame--brass",
  "salon-frame--tall salon-frame--black",
] as const;

function getYoutubeId(href?: string) {
  return href?.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/i,
  )?.[1];
}

function Artwork({ item, sizes }: { item: HomeGalleryItem; sizes: string }) {
  return (
    <>
      {item.type === "video" && item.src ? (
        <video
          src={`${item.src}#t=0.1`}
          muted
          playsInline
          preload="metadata"
          className="h-full w-full object-cover"
        />
      ) : (
        <SafeImage
          src={item.image ?? ""}
          alt={item.title}
          fill
          sizes={sizes}
          className="object-cover"
        />
      )}
      {item.type === "video" ? (
        <span className="absolute inset-0 grid place-items-center bg-ink/10" aria-hidden="true">
          <span className="grid h-10 w-10 place-items-center rounded-full border border-white/70 bg-ink/55 text-white backdrop-blur-sm">
            <Play className="h-4 w-4 translate-x-px" fill="currentColor" />
          </span>
        </span>
      ) : null}
    </>
  );
}

export function HomeGalleryWall({ items }: { items: HomeGalleryItem[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const wallRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const drag = useRef({ active: false, moved: false, startX: 0, scrollLeft: 0 });
  const activeItem = activeIndex === null ? null : items[activeIndex];

  const close = useCallback(() => {
    setActiveIndex(null);
    requestAnimationFrame(() => previousFocus.current?.focus());
  }, []);

  useEffect(() => {
    if (!activeItem) return;
    previousFocus.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key !== "Tab" || !dialogRef.current) return;
      const controls = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, a[href], video[controls], iframe',
      );
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKey);
    };
  }, [activeItem, close]);

  function pointerDown(event: React.PointerEvent<HTMLDivElement>) {
    const wall = wallRef.current;
    if (!wall || wall.scrollWidth <= wall.clientWidth) return;
    drag.current = {
      active: true,
      moved: false,
      startX: event.clientX,
      scrollLeft: wall.scrollLeft,
    };
    wall.setPointerCapture(event.pointerId);
  }

  function pointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const wall = wallRef.current;
    if (!wall || !drag.current.active) return;
    const delta = event.clientX - drag.current.startX;
    if (Math.abs(delta) > 5) drag.current.moved = true;
    wall.scrollLeft = drag.current.scrollLeft - delta;
  }

  function pointerUp(event: React.PointerEvent<HTMLDivElement>) {
    drag.current.active = false;
    wallRef.current?.releasePointerCapture(event.pointerId);
  }

  function open(index: number) {
    if (!drag.current.moved) setActiveIndex(index);
  }

  const youtubeId = getYoutubeId(activeItem?.href);

  return (
    <>
      <div
        ref={wallRef}
        className="salon-wall-scroll"
        onPointerDown={pointerDown}
        onPointerMove={pointerMove}
        onPointerUp={pointerUp}
        onPointerCancel={pointerUp}
        aria-label="Featured gallery. Swipe horizontally on a phone."
      >
        <div className="salon-wall" data-stagger>
          {items.map((item, index) => (
            <button
              key={`${item.id}-${index}`}
              type="button"
              className={`salon-frame ${frameStyles[index % frameStyles.length]} ${interactiveStateClasses}`}
              onClick={() => open(index)}
              aria-label={`Preview ${item.title}`}
              data-reveal="card"
            >
              <span className="salon-artwork">
                <Artwork item={item} sizes="(min-width: 1024px) 20vw, 45vw" />
              </span>
              <span className="salon-placard">
                <span>{item.category.replace("_", " ")}</span>
                <strong>{item.title}</strong>
              </span>
            </button>
          ))}
        </div>
      </div>

      {activeItem ? (
        <div
          ref={dialogRef}
          className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-ink/90 p-3 backdrop-blur-md sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.title}
          onClick={close}
        >
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            className={`fixed right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full border border-cream/30 bg-ink text-cream ${interactiveStateClasses}`}
            aria-label="Close preview"
          >
            <X aria-hidden="true" />
          </button>
          <div
            className="my-auto w-full max-w-5xl overflow-hidden rounded-sm border border-cream/15 bg-cream text-ink shadow-soft"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative flex max-h-[72svh] min-h-64 items-center justify-center overflow-hidden bg-black">
              {activeItem.type === "video" && activeItem.src ? (
                <video src={activeItem.src} controls playsInline className="max-h-[72svh] w-full object-contain" />
              ) : youtubeId ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
                  title={activeItem.title}
                  className="aspect-video w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="relative h-[68svh] w-full">
                  <SafeImage src={activeItem.image ?? ""} alt={activeItem.title} fill sizes="100vw" className="object-contain" />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-red-700">{activeItem.category.replace("_", " ")}</p>
                <h3 className="mt-1 font-display text-2xl font-black sm:text-3xl">{activeItem.title}</h3>
                {activeItem.price ? <p className="mt-2 font-bold text-red-700">{activeItem.price}</p> : null}
                {activeItem.excerpt ? <p className="mt-3 max-w-xl text-sm leading-6 text-ink/70">{activeItem.excerpt}</p> : null}
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                {activeItem.href ? (
                  <a href={activeItem.href} target="_blank" rel="noopener noreferrer" className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-ink/20 px-4 text-xs font-bold uppercase ${interactiveStateClasses}`}>
                    Open original <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </a>
                ) : null}
                {activeItem.purchaseUrl ? (
                  <a href={activeItem.purchaseUrl} target="_blank" rel="noopener noreferrer" className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-red-600 px-4 text-xs font-bold uppercase text-white ${interactiveStateClasses}`}>
                    Buy book <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </a>
                ) : null}
                <Link href="/gallery" className={`inline-flex min-h-11 items-center justify-center rounded-md bg-red-600 px-4 text-xs font-bold uppercase text-white ${interactiveStateClasses}`}>
                  View full gallery
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
