import type { Metadata } from "next";
import { SafeImage } from "@/components/safe-image";
import { ArrowRight, MessageCircle, Music2 } from "lucide-react";
import { GhostWord } from "@/components/brand-motifs";
import { ScriptHero } from "@/components/script-hero";
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
      <ScriptHero title="Tami Services" image="/images/studio-production.png" />

      <section className="gallery-wall relative overflow-hidden px-5 py-24 text-ink md:px-8 md:py-36">
        <GhostWord word="Services" tone="dark" className="-right-10 top-10 text-[16vw]" />
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-3" data-stagger>
            {services.map((service, index) => {
              const Icon = service.icon;
              const whatsappMessage = `Hello Tami Bedford team, I would like to ask about ${service.title}.`;

              return (
                <article
                  key={service.title}
                  className="gallery-frame card-lift relative overflow-hidden"
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
                  <div className="p-6 md:p-7">
                    <div className="flex items-center justify-between">
                      <span className="grid h-11 w-11 place-items-center rounded-md bg-ink text-cream">
                        <Icon aria-hidden="true" className="h-5 w-5" />
                      </span>
                      <span className="font-display text-sm font-black text-ink/25">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h2 className="mt-6 break-words font-display text-2xl font-black leading-tight md:text-3xl">
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
            title="Work, placed under service."
          />
          <div className="mt-16 grid gap-8 md:grid-cols-3" data-stagger>
            {servicePortfolio.map((item) => (
              <article
                key={item.title}
                className="card-lift relative overflow-hidden border border-cream/12 bg-cream/[0.04]"
                data-reveal="card"
              >
                <div className="relative aspect-[3/4]">
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
