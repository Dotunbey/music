import type { Metadata } from "next";
import { SafeImage } from "@/components/safe-image";
import { ArrowRight } from "lucide-react";
import { ActionLink } from "@/components/action-link";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { contact, workCategories } from "@/lib/content";

export const metadata: Metadata = {
  title: "Work",
  description:
    "A curated hub for Tami Bedford music, poetry, and short film work.",
  openGraph: {
    title: "Work | Tami Bedford",
    description:
      "A curated hub for Tami Bedford music, poetry, and short film work.",
  },
  twitter: {
    title: "Work | Tami Bedford",
    description:
      "A curated hub for Tami Bedford music, poetry, and short film work.",
  },
};

export default function WorkPage() {
  return (
    <>
      <PageHero
        eyebrow="Work"
        title="Music, poetry, and film in one deliberate hub."
        body="The creative side of the brand has a focused destination for releases, writing, film ideas, and studio process."
        image="/images/work-creative.png"
        primaryHref="/services"
        primaryLabel="Collaborate on a Project"
      />

      <section className="bg-cream px-5 py-20 text-ink md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Archive"
            title="A preview of the creative lanes."
            body="Each lane can expand into releases, writing, embeds, or behind-the-scenes material when the content is ready."
            tone="dark"
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-3" data-stagger>
            {workCategories.map((category) => {
              const Icon = category.icon;

              return (
                <article
                  key={category.title}
                  className="overflow-hidden rounded-lg border border-ink/10 bg-white shadow-soft"
                  data-reveal="card"
                >
                  <div className="relative aspect-[4/3]">
                    <SafeImage
                      src={category.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <span className="grid h-11 w-11 place-items-center rounded-md bg-red-600 text-white">
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <h2 className="mt-6 font-display text-3xl font-black">
                      {category.title}
                    </h2>
                    <p className="mt-3 leading-7 text-ink/82">
                      {category.summary}
                    </p>
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

      <section className="bg-charcoal px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Next"
              title="Creative material has a place to land."
              body="The Work hub can hold embeds, release notes, video trailers, poetry text, and project campaigns as each piece becomes ready."
            />
            <div className="mt-8">
              <ActionLink href="/services" variant="secondary">
                Build a Creative Project
              </ActionLink>
            </div>
          </div>
          <a
            href={`mailto:${contact.email}?subject=${encodeURIComponent(
              "Creative project inquiry",
            )}`}
            className="motion-sheen group flex min-h-40 items-center justify-between gap-5 overflow-hidden rounded-lg border border-cream/12 bg-red-700 p-6 text-white transition hover:bg-red-600"
            data-reveal="card"
          >
            <div>
              <p className="text-sm font-bold uppercase text-white/82">
                Contact
              </p>
              <p className="mt-3 font-display text-3xl font-black leading-none">
                Send a creative brief.
              </p>
            </div>
            <ArrowRight
              aria-hidden="true"
              className="h-8 w-8 shrink-0 transition group-hover:translate-x-1"
            />
          </a>
        </div>
      </section>
    </>
  );
}
