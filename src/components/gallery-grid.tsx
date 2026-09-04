"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SafeImage } from "./safe-image";
import type { GalleryItem } from "@/lib/content";
import { interactiveStateClasses } from "@/lib/ui";

/** Pull the shortcode out of an instagram.com/p/<code>/ or /reel/<code>/ URL. */
function instaShortcode(href?: string) {
  const m = href?.match(/instagram\.com\/(?:p|reel|tv)\/([^/?#]+)/i);
  return m ? m[1] : null;
}

/** Pull the 11-char video id out of a YouTube URL. */
function youtubeId(href?: string) {
  const m = href?.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/i,
  );
  return m ? m[1] : null;
}

function PlayBadge() {
  return (
    <span className="absolute inset-0 grid place-items-center bg-ink/25">
      <span className="grid h-14 w-14 place-items-center rounded-full border border-white/70 bg-ink/40 text-white backdrop-blur-sm transition duration-500 group-hover:scale-110">
        <Play
          aria-hidden="true"
          className="h-5 w-5 translate-x-[1px]"
          fill="currentColor"
        />
      </span>
    </span>
  );
}

function MiniPlacard({
  title,
  meta,
  numbered,
}: {
  title: string;
  meta?: string;
  numbered?: boolean;
}) {
  if (numbered) {
    return (
      <div className="flex items-center justify-center border-t border-ink/10 p-3">
        <span className="font-script text-3xl leading-none text-ink/70">
          {title}
        </span>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-between gap-3 border-t border-ink/10 p-4">
      <h3 className="font-display text-lg font-black leading-none">{title}</h3>
      {meta ? (
        <span className="shrink-0 text-[11px] font-bold uppercase tracking-wide text-red-700">
          {meta}
        </span>
      ) : null}
    </div>
  );
}

function CardBody({
  item,
  aspect = "aspect-[3/4]",
  numbered,
}: {
  item: GalleryItem;
  aspect?: string;
  numbered?: boolean;
}) {
  if (item.type === "text") {
    return (
      <div className="flex min-h-[18rem] flex-col justify-between">
        <p className="p-6 font-display text-xl font-medium italic leading-relaxed text-ink/80">
          &ldquo;{item.excerpt}&rdquo;
        </p>
        <MiniPlacard title={item.title} meta={item.meta} numbered={numbered} />
      </div>
    );
  }

  return (
    <>
      <div className={`relative ${aspect} overflow-hidden bg-ink`}>
        {item.type === "video" && item.src ? (
          <video
            className="h-full w-full object-cover"
            src={item.src}
            muted
            loop
            autoPlay
            playsInline
            preload="metadata"
            tabIndex={-1}
          />
        ) : (
          <SafeImage
            src={item.image ?? ""}
            alt={item.title}
            fill
            sizes="14rem"
            className="object-cover"
          />
        )}
        {item.type === "video" && !item.src ? <PlayBadge /> : null}
      </div>
      <MiniPlacard title={item.title} meta={item.meta} numbered={numbered} />
    </>
  );
}

const BASE_SPEED = 26; // px/s idle drift
const MAX_SPEED = 300; // px/s at the far edge under the cursor

/**
 * A rotating "coverflow" — pieces drift through a centre spotlight (scaled up,
 * bright), the rest shrink and dim to the sides. Idle it turns slowly; the
 * cursor's horizontal position steers it: right → speed one way, left → the
 * other, centre → eases to a near stop.
 */
function Coverflow({
  items,
  onOpen,
  numbered,
  landscape,
}: {
  items: GalleryItem[];
  onOpen: (index: number) => void;
  numbered?: boolean;
  landscape?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const st = useRef({
    offset: 0,
    speed: BASE_SPEED,
    hovering: false,
    px: 0.5,
    setW: 0,
    raf: 0,
    last: 0,
  });

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;
    const s = st.current;

    const measure = () => {
      s.setW = track.scrollWidth / 2; // items are rendered twice
    };
    measure();
    s.last = performance.now();

    const step = (now: number) => {
      const dt = Math.min(0.05, (now - s.last) / 1000);
      s.last = now;

      const target = s.hovering ? (s.px - 0.5) * 2 * MAX_SPEED : BASE_SPEED;
      s.speed += (target - s.speed) * Math.min(1, dt * 3.5);
      s.offset += s.speed * dt;
      if (s.setW > 0) s.offset = ((s.offset % s.setW) + s.setW) % s.setW;
      track.style.transform = `translate3d(${-s.offset}px,0,0)`;

      const cRect = container.getBoundingClientRect();
      const cx = cRect.left + cRect.width / 2;
      const half = cRect.width / 2 || 1;
      const kids = track.children;
      for (let i = 0; i < kids.length; i++) {
        const el = kids[i] as HTMLElement;
        const r = el.getBoundingClientRect();
        const dist = Math.min(1, Math.abs(r.left + r.width / 2 - cx) / half);
        const t = 1 - dist; // 1 at centre, 0 at edges
        const e = t * t; // sharpen the falloff so only the centre pops
        el.style.transform = `scale(${(0.5 + 0.65 * e).toFixed(3)})`;
        el.style.opacity = (0.22 + 0.78 * e).toFixed(3);
        el.style.zIndex = String(Math.round(t * 100));
      }
      s.raf = requestAnimationFrame(step);
    };
    s.raf = requestAnimationFrame(step);

    const onMove = (e: PointerEvent) => {
      const r = container.getBoundingClientRect();
      s.px = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
    };
    const onEnter = () => {
      s.hovering = true;
    };
    const onLeave = () => {
      s.hovering = false;
    };
    container.addEventListener("pointermove", onMove);
    container.addEventListener("pointerenter", onEnter);
    container.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(s.raf);
      container.removeEventListener("pointermove", onMove);
      container.removeEventListener("pointerenter", onEnter);
      container.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", measure);
    };
  }, [items.length]);

  return (
    <div ref={containerRef} className="relative mt-6 overflow-hidden py-14">
      <div ref={trackRef} className="flex w-max items-center will-change-transform">
        {[...items, ...items].map((it, i) => (
          <div
            key={i}
            className="shrink-0 px-3"
            style={{ transformOrigin: "center center" }}
          >
            <button
              type="button"
              onClick={() => onOpen(i % items.length)}
              className={`gallery-frame card-lift group relative block w-44 overflow-hidden text-left sm:w-52 ${interactiveStateClasses}`}
            >
              <CardBody
                item={it}
                aspect={landscape ? "aspect-video" : "aspect-[9/16]"}
                numbered={numbered}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Plain swipeable row for the smaller categories (or reduced-motion). */
function ScrollRow({
  items,
  onOpen,
  numbered,
  landscape,
}: {
  items: GalleryItem[];
  onOpen: (index: number) => void;
  numbered?: boolean;
  landscape?: boolean;
}) {
  return (
    <div className="mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4">
      {items.map((it, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onOpen(i)}
          className={`gallery-frame card-lift group relative block shrink-0 snap-start overflow-hidden text-left ${
            landscape ? "w-80 sm:w-[26rem]" : "w-60"
          } ${interactiveStateClasses}`}
        >
          <CardBody
            item={it}
            aspect={landscape ? "aspect-video" : undefined}
            numbered={numbered}
          />
        </button>
      ))}
    </div>
  );
}

export function GalleryGrid({
  items,
  numbered,
  landscape,
}: {
  items: GalleryItem[];
  numbered?: boolean;
  landscape?: boolean;
}) {
  const [active, setActive] = useState<number | null>(null);
  const reduce = useReducedMotion();

  const close = useCallback(() => setActive(null), []);
  const go = useCallback(
    (dir: number) =>
      setActive((a) =>
        a === null ? a : (a + dir + items.length) % items.length,
      ),
    [items.length],
  );

  useEffect(() => {
    if (active === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    }
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [active, close, go]);

  const item = active === null ? null : items[active];
  const shortcode =
    item && item.type === "video" && !item.src
      ? instaShortcode(item.href)
      : null;
  const ytId =
    item && item.type === "video" && !item.src ? youtubeId(item.href) : null;

  const useCoverflow = items.length >= 6 && !reduce;

  return (
    <>
      {useCoverflow ? (
        <Coverflow
          items={items}
          onOpen={setActive}
          numbered={numbered}
          landscape={landscape}
        />
      ) : (
        <ScrollRow
          items={items}
          onOpen={setActive}
          numbered={numbered}
          landscape={landscape}
        />
      )}

      <AnimatePresence>
        {item ? (
          <motion.div
            className="fixed inset-0 z-[60] grid place-items-center bg-ink/80 p-4 backdrop-blur-md md:p-8"
            role="dialog"
            aria-modal="true"
            aria-label={item.title}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.24 }}
            onClick={close}
          >
            <button
              type="button"
              onClick={close}
              className={`absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full border border-cream/25 bg-ink/50 text-cream hover:border-red-500 hover:text-white ${interactiveStateClasses}`}
              aria-label="Close"
            >
              <X aria-hidden="true" />
            </button>

            {items.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    go(-1);
                  }}
                  className={`absolute left-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-cream/25 bg-ink/50 text-cream hover:border-red-500 hover:text-white md:left-6 ${interactiveStateClasses}`}
                  aria-label="Previous"
                >
                  <ChevronLeft aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    go(1);
                  }}
                  className={`absolute right-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-cream/25 bg-ink/50 text-cream hover:border-red-500 hover:text-white md:right-6 ${interactiveStateClasses}`}
                  aria-label="Next"
                >
                  <ChevronRight aria-hidden="true" />
                </button>
              </>
            ) : null}

            <motion.div
              className="w-auto max-w-[94vw]"
              initial={reduce ? false : { opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, scale: 0.98, y: 8 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="overflow-hidden rounded-lg border border-cream/15 bg-charcoal">
                {item.type === "video" && item.src ? (
                  <div className="relative aspect-[9/16] h-[78vh] max-h-[78vh] max-w-[94vw] bg-ink">
                    <video
                      key={item.src}
                      className="absolute inset-0 h-full w-full cursor-pointer object-contain"
                      autoPlay
                      playsInline
                      poster={item.image}
                      onClick={(e) => {
                        const v = e.currentTarget;
                        if (v.paused) v.play();
                        else v.pause();
                      }}
                    >
                      <source src={item.src} />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ) : ytId ? (
                  <div className="aspect-video w-[min(88vw,900px)] max-w-[94vw] bg-ink">
                    <iframe
                      key={ytId}
                      src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
                      title={item.title}
                      className="h-full w-full border-0"
                      allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                      allowFullScreen
                    />
                  </div>
                ) : shortcode ? (
                  <iframe
                    key={shortcode}
                    src={`https://www.instagram.com/p/${shortcode}/embed`}
                    title={item.title}
                    className="h-[72vh] w-[400px] max-w-[94vw] border-0 bg-white"
                    scrolling="no"
                    allow="autoplay; encrypted-media; picture-in-picture; clipboard-write"
                    allowFullScreen
                  />
                ) : item.type === "text" ? (
                  <p className="max-w-md p-8 font-display text-2xl font-medium italic leading-relaxed text-cream/90 md:text-3xl">
                    &ldquo;{item.excerpt}&rdquo;
                  </p>
                ) : (
                  <div className="relative aspect-[9/16] h-[78vh] max-h-[78vh] max-w-[94vw] bg-ink">
                    <SafeImage
                      src={item.image ?? ""}
                      alt={item.title}
                      fill
                      sizes="(min-width: 768px) 440px, 94vw"
                      className="object-contain"
                    />
                  </div>
                )}

                {numbered ? (
                  <div className="relative flex items-center justify-center border-t border-cream/12 px-5 py-4">
                    <span className="font-script text-4xl leading-none text-cream/90">
                      {item.title}
                    </span>
                    <span className="absolute right-5 text-xs font-bold uppercase tracking-wide text-cream/45">
                      {(active ?? 0) + 1} / {items.length}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-4 border-t border-cream/12 px-5 py-4">
                    <div>
                      <h3 className="font-display text-xl font-black text-cream">
                        {item.title}
                      </h3>
                      {item.meta ? (
                        <span className="text-xs font-bold uppercase tracking-wide text-brass">
                          {item.meta}
                        </span>
                      ) : null}
                    </div>
                    <span className="shrink-0 text-xs font-bold uppercase tracking-wide text-cream/45">
                      {(active ?? 0) + 1} / {items.length}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
