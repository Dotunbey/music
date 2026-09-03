import type { Metadata } from "next";
import { SafeImage } from "@/components/safe-image";
import { ArrowRight, MessageCircle, Music2 } from "lucide-react";
import { GhostWord } from "@/components/brand-motifs";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { contact, servicePortfolio, services } from "@/lib/content";
import { interactiveStateClasses } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Music arrangement, production, vocal arrangement, and recording support from Tami Bedford.",
  openGraph: {
    title: "Services | Tami Bedford",
    description:
      "Music arrangement, production, vocal arrangement, and recording support from Tami Bedford.",
  },
  twitter: {
    title: "Services | Tami Bedford",
    description:
      "Music arrangement, production, vocal arrangement, and recording support from Tami Bedford.",
  },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Studio work, presented without noise."
        body="Vocal production, vocal arrangement, and music production for artists who need a refined ear on the record."
        image="/images/studio-production.png"
        primaryHref={`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(
          "Hello Tami Bedford team, I would like to ask about production services.",
        )}`}
        primaryLabel="Message Us"
      />

      <section className="relative overflow-hidden bg-cream px-5 py-20 text-ink md:px-8 md:py-28">
        <GhostWord word="Services" tone="dark" className="-right-10 top-10 text-[16vw]" />
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Offerings"
            title="Three ways into the record."
            body="Simple cards, clear lanes, and one contact path. The conversation can carry the details."
            tone="dark"
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-3" data-stagger>
            {services.map((service) => {
              const Icon = service.icon;
              const whatsappMessage = `Hello Tami Bedford team, I would like to ask about ${service.title}.`;

              return (
                <article
                  key={service.title}
                  className="card-lift relative overflow-hidden rounded-lg border border-ink/10 bg-white shadow-soft"
                  data-reveal="card"
                >
                  <div className="relative aspect-[4/5]">
                    <SafeImage
                      src={service.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <span className="grid h-11 w-11 place-items-center rounded-md bg-ink text-cream">
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <h2 className="mt-6 font-display text-3xl font-black leading-none">
                      {service.title}
                    </h2>
                    <ul className="mt-6 grid gap-3">
                      {service.deliverables.map((deliverable) => (
                        <li key={deliverable} className="flex gap-3">
                          <Music2
                            aria-hidden="true"
                            className="mt-1 h-4 w-4 shrink-0 text-red-700"
                          />
                          <span className="leading-7 text-ink/82">
                            {deliverable}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <a
                      href={`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(
                        whatsappMessage,
                      )}`}
                      className={`motion-sheen mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-md bg-red-600 px-5 py-3 text-sm font-bold uppercase text-white hover:bg-red-500 ${interactiveStateClasses}`}
                    >
                      <MessageCircle aria-hidden="true" className="h-4 w-4" />
                      Message Us
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-charcoal px-5 py-20 md:px-8 md:py-28">
        <GhostWord word="Portfolio" className="-left-8 bottom-10 text-[15vw]" />
        <div className="relative mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Portfolio"
            title="Selected work will live under the service it proves."
            body="Songs, albums, recorded vocals, and arrangements can be linked here as Michael curates the credits."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3" data-stagger>
            {servicePortfolio.map((item) => (
              <article
                key={item.title}
                className="card-lift relative overflow-hidden rounded-lg border border-cream/12 bg-cream/[0.04]"
                data-reveal="card"
              >
                <div className="relative aspect-[4/3]">
                  <SafeImage
                    src={item.image}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h2 className="font-display text-3xl font-black leading-none">
                    {item.title}
                  </h2>
                  <p className="mt-5 border-t border-cream/12 pt-5 text-sm font-bold uppercase leading-6 text-brass">
                    {item.status}
                  </p>
                </div>
              </article>
            ))}
          </div>
          <a
            href={`mailto:${contact.email}?subject=${encodeURIComponent(
              "Service inquiry",
            )}`}
            className={`motion-sheen mt-10 inline-flex min-h-12 items-center justify-center gap-2 overflow-hidden rounded-md border border-cream/25 px-5 py-3 text-sm font-bold uppercase text-cream hover:border-red-500 hover:text-white ${interactiveStateClasses}`}
            data-reveal="card"
          >
            Email Us
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </a>
        </div>
      </section>
    </>
  );
}
