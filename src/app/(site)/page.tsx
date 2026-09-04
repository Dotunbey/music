import { MessageCircle } from "lucide-react";
import { ActionLink } from "@/components/action-link";
import { Marquee, ScrollCue } from "@/components/brand-motifs";
import { MotionImageFrame } from "@/components/motion-primitives";
import { SafeImage } from "@/components/safe-image";
import { SessionCard } from "@/components/session-card";
import { contact, services, sessions } from "@/lib/content";
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
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <h2
              className="font-display text-6xl font-black leading-none text-cream md:text-8xl"
              data-reveal="heading"
            >
              Sessions
            </h2>
            <ActionLink href="/sessions" variant="secondary">
              Compare Sessions
            </ActionLink>
          </div>
          <div className="grid gap-6 sm:grid-cols-2" data-stagger>
            {sessions
              .filter((session) => session.active)
              .map((session) => (
                <SessionCard key={session.slug} session={session} />
              ))}
          </div>
        </div>
      </section>

      <section className="gallery-wall relative overflow-hidden px-5 py-24 text-ink md:px-8 md:py-36">
        <div className="relative mx-auto grid max-w-7xl gap-16 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div>
            <h2
              className="font-display text-6xl font-black leading-none md:text-8xl"
              data-reveal="heading"
            >
              Services
            </h2>
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

          <div data-stagger>
            {services
              .filter((service) => service.title === "Music Production")
              .map((service) => (
                <article
                  key={service.title}
                  className="gallery-frame card-lift group relative overflow-hidden"
                  data-reveal="card"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <SafeImage
                      src={service.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 55vw, 100vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6 md:p-8">
                    <h3 className="font-display text-3xl font-black leading-none md:text-4xl">
                      {service.title}
                    </h3>
                  </div>
                </article>
              ))}
          </div>
        </div>
      </section>


    </>
  );
}
