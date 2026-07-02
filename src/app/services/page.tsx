import type { Metadata } from "next";
import { SafeImage } from "@/components/safe-image";
import { MessageCircle, Music2 } from "lucide-react";
import { ActionLink } from "@/components/action-link";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { contact, services } from "@/lib/content";
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
        title="Creative production with clearer musical direction."
        body="Arrangement, tracking, vocal production, and studio guidance for artists who need their ideas shaped with taste and structure."
        image="/images/studio-production.png"
        primaryHref="/apply?track=Music%20Arrangement%20%26%20Production"
        primaryLabel="Start an Inquiry"
      />

      <section className="bg-cream px-5 py-20 text-ink md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Offerings"
            title="Two practical ways to move the music forward."
            body="The services are shaped around songs, vocals, and the production decisions that help a project feel complete."
            tone="dark"
          />
          <div className="mt-12 grid gap-8 lg:grid-cols-2" data-stagger>
            {services.map((service) => {
              const Icon = service.icon;
              const whatsappMessage = `Hello Tami Bedford team, I would like to ask about ${service.title}.`;

              return (
                <article
                  key={service.title}
                  className="overflow-hidden rounded-lg border border-ink/10 bg-white shadow-soft"
                  data-reveal="card"
                >
                  <div className="relative aspect-[16/11]">
                    <SafeImage
                      src={service.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6 md:p-8">
                    <span className="grid h-12 w-12 place-items-center rounded-md bg-red-600 text-white">
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <h2 className="mt-6 font-display text-4xl font-black leading-none">
                      {service.title}
                    </h2>
                    <p className="mt-5 leading-8 text-ink/82">
                      {service.summary}
                    </p>
                    <ul className="mt-7 grid gap-3">
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
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                      <ActionLink
                        href={`/apply?track=${encodeURIComponent(service.title)}`}
                      >
                        Request Service
                      </ActionLink>
                      <a
                        href={`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(
                          whatsappMessage,
                        )}`}
                        className={`motion-sheen inline-flex min-h-12 items-center justify-center gap-2 overflow-hidden rounded-md border border-ink/20 px-5 py-3 text-sm font-bold uppercase hover:border-red-600 hover:text-red-700 ${interactiveStateClasses}`}
                      >
                        <MessageCircle aria-hidden="true" className="h-4 w-4" />
                        Message Us
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-charcoal px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <SectionHeading
            eyebrow="Process"
            title="Simple enough to start, specific enough to be useful."
            body="The first inquiry gathers the creative need, timeline, and current material. From there, the service can be scoped around the song, vocal, or production outcome."
          />
          <div className="grid gap-4" data-stagger>
            {[
              "Share the song, reference, or production goal.",
              "Clarify the deliverable, timeline, and session needs.",
              "Receive arrangement, recording, or production direction.",
              "Review the work with practical next steps.",
            ].map((step, index) => (
              <div
                key={step}
                className="flex gap-4 rounded-lg border border-cream/12 bg-cream/[0.04] p-5"
                data-reveal="card"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-brass font-bold text-ink">
                  {index + 1}
                </span>
                <p className="leading-7 text-cream/82">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
