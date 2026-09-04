import { ArrowUpRight, MessageCircle } from "lucide-react";
import { ActionLink } from "@/components/action-link";
import { Equalizer, GhostWord, Marquee, ScrollCue } from "@/components/brand-motifs";
import { MotionImageFrame } from "@/components/motion-primitives";
import { SafeImage } from "@/components/safe-image";
import { SectionHeading } from "@/components/section-heading";
import { SessionCard } from "@/components/session-card";
import { contact, galleryCategories, services, sessions } from "@/lib/content";
import { interactiveStateClasses } from "@/lib/ui";

const marqueeItems = [
  "Piano",
  "Organ",
  "Choral",
  "Music Production",
  "Gospel",
  "Contemporary",
  "Worship",
  "Arrangement",
  "Vocal Production",
] as const;

export default function Home() {
  return (
    <>
      <section className="grain relative isolate min-h-[92svh] overflow-hidden bg-ink px-5 pb-28 pt-28 text-cream md:px-8">
        <MotionImageFrame className="absolute inset-0" parallax={30}>
          <SafeImage
            src="/images/hero-lesson.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="animate-ken-burns object-cover object-center [filter:brightness(0.88)_contrast(1.04)_saturate(0.88)]"
          />
        </MotionImageFrame>
        <div className="absolute inset-0 bg-[radial-gradient(130%_130%_at_50%_42%,transparent,rgba(82,75,66,0.26)_68%,rgba(82,75,66,0.8))]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(82,75,66,0.58),transparent_30%,transparent_58%,rgba(82,75,66,0.92))]" />
        <div className="relative mx-auto flex min-h-[calc(92svh-13rem)] w-full max-w-7xl items-center">
          <div className="absolute inset-0 z-10 grid place-items-center px-5 text-center">
            <div>
              <h1 className="font-display text-3xl font-medium uppercase tracking-[0.34em] text-cream md:text-6xl md:tracking-[0.4em]">
                Tami Bedford
              </h1>
              <p className="font-script mx-auto mt-6 max-w-2xl text-2xl leading-tight text-cream/85 md:mt-8 md:text-4xl">
                &ldquo;&hellip;Turn these dreams into prophesies.&rdquo;
              </p>
              <p className="font-script mt-1 text-lg text-cream/55 md:text-2xl">
                &mdash; Tami Bedford
              </p>
            </div>
          </div>
        </div>
        <ScrollCue className="absolute bottom-28 left-1/2 hidden -translate-x-1/2 md:flex" />
      </section>

      <Marquee
        items={marqueeItems}
        className="mt-16 border-y border-cream/10 bg-ink py-5 text-cream/30"
      />

      <section className="relative overflow-hidden bg-charcoal px-5 py-20 md:px-8 md:py-28">
        <GhostWord word="Sessions" className="-right-10 top-10 text-[18vw]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              eyebrow="Sessions"
              title="Choose a path with structure."
            />
            <ActionLink href="/sessions" variant="secondary">
              Compare Sessions
            </ActionLink>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4" data-stagger>
            {sessions.map((session, index) => (
              <div key={session.slug} className={index % 2 === 1 ? "xl:-translate-y-6" : ""}>
                <SessionCard session={session} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="gallery-wall relative overflow-hidden px-5 py-24 text-ink md:px-8 md:py-36">
        <GhostWord word="Studio" tone="dark" className="-left-8 bottom-8 text-[17vw]" />
        <div className="relative mx-auto grid max-w-7xl gap-16 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div>
            <p className="mb-4 text-sm font-bold uppercase text-red-700">
              Services
            </p>
            <h2 className="font-display text-5xl font-black leading-none text-balance md:text-7xl">
              Made in the studio.
            </h2>
            <p className="gallery-caption mt-8 max-w-md pt-5 text-xs font-bold uppercase leading-6 text-ink/62">
              Vocal production / vocal arrangement / music production
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ActionLink href="/services">View Services</ActionLink>
              <a
                href={`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(
                  "Hello Tami Bedford team, I would like to ask about music production services.",
                )}`}
                className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-ink/20 px-5 py-3 text-sm font-bold uppercase hover:border-red-600 hover:text-red-700 ${interactiveStateClasses}`}
              >
                <MessageCircle aria-hidden="true" className="h-4 w-4" />
                Message Us
              </a>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3" data-stagger>
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <article
                  key={service.title}
                  className={`gallery-frame card-lift relative overflow-hidden ${
                    index === 1 ? "sm:translate-y-12" : ""
                  }`}
                  data-reveal="card"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <SafeImage
                      src={service.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 22vw, 50vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5 md:p-6">
                    <span className="grid h-9 w-9 place-items-center rounded-md bg-ink text-cream">
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <h3 className="mt-5 font-display text-2xl font-black leading-none md:text-3xl">
                      {service.title}
                    </h3>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-ink px-5 py-20 md:px-8 md:py-28">
        <GhostWord word="Archive" className="-right-8 top-12 text-[16vw]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div
            className="relative aspect-[4/3] overflow-hidden rounded-lg border border-cream/12"
            data-reveal="card"
          >
            <SafeImage
              src="/images/work-creative.png"
              alt=""
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <SectionHeading
              eyebrow="Gallery"
              title="Personal projects in a quieter room."
            />
            <div className="mt-8 grid gap-5 sm:grid-cols-3" data-stagger>
              {galleryCategories.slice(0, 3).map((category) => {
                const Icon = category.icon;
                return (
                  <div
                    key={category.title}
                    className="card-lift relative overflow-hidden rounded-lg border border-cream/12 bg-cream/[0.04]"
                    data-reveal="card"
                  >
                    <div className="relative aspect-[4/5]">
                      <SafeImage
                        src={category.cover}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 18vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="p-5">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-red-600 text-white">
                        <Icon aria-hidden="true" className="h-5 w-5" />
                      </span>
                      <h3 className="font-display text-2xl font-black">
                        {category.title}
                      </h3>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-8">
              <a
                href="/gallery"
                className={`motion-sheen inline-flex min-h-12 items-center justify-center gap-2 overflow-hidden rounded-md border border-cream/30 bg-cream px-5 py-3 text-sm font-bold uppercase text-ink hover:bg-white ${interactiveStateClasses}`}
              >
                Visit Gallery
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-red-700 px-5 py-14 text-white md:px-8">
        <div
          className="relative mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between"
          data-reveal="card"
        >
          <div>
            <div className="flex items-center gap-4">
              <Equalizer className="h-5" barClassName="bg-white/70" />
              <p className="text-sm font-bold uppercase text-white/82">
                Ready for structure?
              </p>
            </div>
            <h2 className="mt-2 font-display text-4xl font-black leading-none md:text-5xl">
              Start with the path that fits your music.
            </h2>
          </div>
          <a
            href="/apply"
            className={`motion-sheen inline-flex min-h-12 items-center justify-center gap-2 overflow-hidden rounded-md bg-white px-5 py-3 text-sm font-bold uppercase text-red-700 hover:bg-cream ${interactiveStateClasses}`}
          >
            Apply Now
          </a>
        </div>
      </section>
    </>
  );
}
