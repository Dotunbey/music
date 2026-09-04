import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Flourish, GhostWord } from "@/components/brand-motifs";
import { GalleryGrid } from "@/components/gallery-grid";
import { SafeImage } from "@/components/safe-image";
import { ScriptHero } from "@/components/script-hero";
import { SectionHeading } from "@/components/section-heading";
import { contact, galleryCategories } from "@/lib/content";
import { interactiveStateClasses } from "@/lib/ui";

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
            <div className="flex flex-col items-center gap-4 text-center">
              <h2 className="font-display text-3xl font-black leading-none md:text-4xl">
                {category.title}
              </h2>
              <div className="flex w-full max-w-2xl items-center gap-5 text-ink/60">
                <span aria-hidden="true" className="h-px flex-1 bg-current opacity-50" />
                <Flourish className="h-10 w-48 shrink-0" />
                <span aria-hidden="true" className="h-px flex-1 bg-current opacity-50" />
              </div>
            </div>

            <GalleryGrid
              items={category.items}
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

      <section className="relative overflow-hidden bg-ink px-5 py-20 text-cream md:px-8 md:py-28">
        <GhostWord word="Personal" className="-left-8 top-10 text-[15vw]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div
            className="relative aspect-[4/3] overflow-hidden rounded-lg border border-cream/12"
            data-reveal="card"
          >
            <SafeImage
              src="/images/creation-hands.jpg"
              alt=""
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <SectionHeading title="This is the personal room." />
            <div className="mt-8 flex flex-wrap gap-3">
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
          </div>
        </div>
      </section>
    </>
  );
}
