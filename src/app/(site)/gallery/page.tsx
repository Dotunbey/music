import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { GalleryGrid } from "@/components/gallery-grid";
import { BookGallery } from "@/components/book-gallery";
import { ScriptHero } from "@/components/script-hero";
import { contact } from "@/lib/content";
import {
  galleryCategoryConfig,
  getApprovedGalleryItems,
} from "@/lib/gallery";
import { interactiveStateClasses } from "@/lib/ui";

export const dynamic = "force-dynamic";

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
  const itemsPromise = getApprovedGalleryItems();
  return (
    <GalleryContent itemsPromise={itemsPromise} />
  );
}

async function GalleryContent({
  itemsPromise,
}: {
  itemsPromise: ReturnType<typeof getApprovedGalleryItems>;
}) {
  const items = await itemsPromise;

  return (
    <>
      <ScriptHero title={"Tam’s Gallery"} image="/images/work-creative.png" />

      {galleryCategoryConfig.map((category) => {
        const categoryItems = items
          .filter((item) => item.category === category.slug)
          .map(({ category: _category, ...item }) => item);

        return (
        <section
          key={category.slug}
          id={category.slug}
          className="gallery-wall relative scroll-mt-24 overflow-hidden px-5 py-10 text-ink md:px-8 md:py-14"
        >
          <div className="relative mx-auto max-w-7xl">
            <h2 className="font-display text-4xl font-black leading-none md:text-5xl">
              {category.title}
            </h2>

            {categoryItems.length > 0 ? category.slug === "books" ? (
              <BookGallery items={categoryItems} />
            ) : (
              <GalleryGrid
                items={categoryItems}
                numbered={category.slug === "poetry"}
                landscape={category.slug === "short_films"}
              />
            )
            : (
              <p className="mt-12 border-t border-ink/10 pt-5 text-xs font-bold uppercase tracking-[0.16em] text-ink/45">
                New work will appear here.
              </p>
            )}
          </div>
        </section>
        );
      })}

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
