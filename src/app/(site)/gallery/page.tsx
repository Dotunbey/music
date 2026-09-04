import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { GalleryGrid } from "@/components/gallery-grid";
import { ScriptHero } from "@/components/script-hero";
import { contact, galleryCategories, type GalleryItem } from "@/lib/content";
import { interactiveStateClasses } from "@/lib/ui";

const VIDEO_EXT = /\.(mp4|webm|mov|m4v)$/i;
const IMAGE_EXT = /\.(jpe?g|png|webp|gif)$/i;

function toRoman(n: number): string {
  const map: [number, string][] = [
    [1000, "M"],
    [900, "CM"],
    [500, "D"],
    [400, "CD"],
    [100, "C"],
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];
  let out = "";
  for (const [value, symbol] of map) {
    while (n >= value) {
      out += symbol;
      n -= value;
    }
  }
  return out;
}

// Every media file dropped in /public/poetry becomes a numbered poem, ordered
// by the timestamp in its filename. Videos play; images show.
function readPoetryItems(): GalleryItem[] {
  let files: string[];
  try {
    files = fs.readdirSync(path.join(process.cwd(), "public", "poetry"));
  } catch {
    return [];
  }
  return files
    .filter((f) => VIDEO_EXT.test(f) || IMAGE_EXT.test(f))
    .sort(
      (a, b) =>
        Number(a.match(/_(\d{10})_/)?.[1] ?? 0) -
        Number(b.match(/_(\d{10})_/)?.[1] ?? 0),
    )
    .map((f, i) =>
      VIDEO_EXT.test(f)
        ? { title: toRoman(i + 1), type: "video", src: `/poetry/${f}` }
        : { title: toRoman(i + 1), type: "image", image: `/poetry/${f}` },
    );
}

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Tam's Gallery: a minimalist home for Tami Bedford music, poetry, books, short films, and mixed creative projects.",
  openGraph: {
    title: "Gallery | Tami Bedford",
    description:
      "Tam's Gallery: a minimalist home for Tami Bedford music, poetry, books, short films, and mixed creative projects.",
  },
  twitter: {
    title: "Gallery | Tami Bedford",
    description:
      "Tam's Gallery: a minimalist home for Tami Bedford music, poetry, books, short films, and mixed creative projects.",
  },
};

export default function GalleryPage() {
  const poetry = readPoetryItems();
  return (
    <>
      <ScriptHero title={"Tam’s Gallery"} image="/images/work-creative.png" />

      {galleryCategories.map((category) => (
        <section
          key={category.slug}
          id={category.slug}
          className="gallery-wall relative scroll-mt-24 overflow-hidden px-5 py-10 text-ink md:px-8 md:py-14"
        >
          <div className="relative mx-auto max-w-7xl">
            <h2 className="font-display text-4xl font-black leading-none md:text-5xl">
              {category.title}
            </h2>

            <GalleryGrid
              items={
                category.slug === "poetry" && poetry.length
                  ? poetry
                  : category.items
              }
              numbered={category.slug === "poetry"}
              landscape={category.slug === "short-films"}
            />

            {category.purchase ? (
              <div
                className="mx-auto mt-12 flex max-w-md flex-col items-center gap-4 rounded-lg border border-ink/12 bg-ink/[0.03] p-8 text-center"
                data-reveal="card"
              >
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-700">
                  Available now
                </p>
                <h3 className="font-display text-3xl font-black leading-none">
                  {category.purchase.title}
                </h3>
                <a
                  href={category.purchase.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`motion-sheen mt-1 inline-flex min-h-12 items-center justify-center gap-2 overflow-hidden rounded-md bg-red-600 px-6 py-3 text-sm font-bold uppercase text-white hover:bg-red-500 ${interactiveStateClasses}`}
                >
                  Buy the book — {category.purchase.price}
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </a>
                {category.purchase.note ? (
                  <p className="text-xs font-bold uppercase tracking-wide text-ink/45">
                    {category.purchase.note}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        </section>
      ))}

      <section className="bg-ink px-5 py-16 text-cream md:px-8 md:py-20">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-3">
          <a
            href={contact.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className={`motion-sheen inline-flex min-h-12 items-center justify-center gap-2 overflow-hidden rounded-md bg-red-600 px-5 py-3 text-sm font-bold uppercase text-white hover:bg-red-500 ${interactiveStateClasses}`}
          >
            Visit Instagram
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </a>
          <a
            href={contact.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className={`motion-sheen inline-flex min-h-12 items-center justify-center gap-2 overflow-hidden rounded-md border border-cream/25 px-5 py-3 text-sm font-bold uppercase text-cream hover:border-red-500 hover:text-white ${interactiveStateClasses}`}
          >
            Visit YouTube
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </a>
          <a
            href={`mailto:${contact.email}?subject=${encodeURIComponent(
              "Gallery inquiry",
            )}`}
            className={`motion-sheen inline-flex min-h-12 items-center justify-center gap-2 overflow-hidden rounded-md border border-cream/25 px-5 py-3 text-sm font-bold uppercase text-cream hover:border-red-500 hover:text-white ${interactiveStateClasses}`}
          >
            Email Us
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </a>
        </div>
      </section>
    </>
  );
}
