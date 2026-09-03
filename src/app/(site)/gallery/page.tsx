import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { GhostWord } from "@/components/brand-motifs";
import { ActionLink } from "@/components/action-link";
import { PageHero } from "@/components/page-hero";
import { SafeImage } from "@/components/safe-image";
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
      <PageHero
        eyebrow="Tam's Gallery"
        title="Mixed work in a quiet room."
        body="Music, poems, short films, books, and personal creative fragments gathered like a gallery wall instead of a brochure."
        image="/images/work-creative.png"
        primaryHref={contact.instagram}
        primaryLabel="View Instagram"
      />

      <section className="relative overflow-hidden bg-cream px-5 py-20 text-ink md:px-8 md:py-28">
        <GhostWord word="Gallery" tone="dark" className="-right-10 top-12 text-[17vw]" />
        <div className="relative mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Creative archive"
            title="White space, image first, words when needed."
            body="The gallery is ready for links, embeds, stills, excerpts, and Instagram material as Michael releases each project."
            tone="dark"
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4" data-stagger>
            {galleryCategories.map((category, index) => {
              const Icon = category.icon;

              return (
                <article
                  key={category.title}
                  className={`card-lift relative overflow-hidden rounded-lg border border-ink/10 bg-white shadow-soft ${
                    index % 2 === 1 ? "lg:translate-y-10" : ""
                  }`}
                  data-reveal="card"
                >
                  <div className="relative aspect-[3/4]">
                    <SafeImage
                      src={category.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <span className="grid h-10 w-10 place-items-center rounded-md bg-ink text-cream">
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <h2 className="mt-5 font-display text-3xl font-black leading-none">
                      {category.title}
                    </h2>
                    <p className="mt-5 border-t border-ink/10 pt-5 text-sm font-bold uppercase leading-6 text-red-700">
                      {category.status}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-ink px-5 py-20 md:px-8 md:py-28">
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
            <SectionHeading
              eyebrow="Not portfolio"
              title="This is the personal room."
              body="Client work belongs under Services. This space is for the poems, film poems, music ideas, book work, images, and mixed media that make the wider creative world visible."
            />
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ActionLink href="/services" variant="secondary">
                See Services
              </ActionLink>
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
