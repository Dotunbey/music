import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { ActionLink } from "@/components/action-link";
import { Equalizer, GhostWord, Marquee, ScrollCue } from "@/components/brand-motifs";
import { CountUp, MotionHeadline, MotionImageFrame } from "@/components/motion-primitives";
import { SafeImage } from "@/components/safe-image";
import { SectionHeading } from "@/components/section-heading";
import { SessionCard } from "@/components/session-card";
import { contact, proofPoints, services, sessions, values, workCategories } from "@/lib/content";
import { interactiveStateClasses } from "@/lib/ui";

const marqueeItems = [
  "Piano",
  "Organ",
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
      <section className="grain relative isolate min-h-[88svh] overflow-hidden bg-ink px-5 pb-28 pt-28 text-cream md:px-8">
        <MotionImageFrame className="absolute inset-0" parallax={30}>
          <SafeImage
            src="/images/hero-lesson.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="animate-ken-burns object-cover object-center"
          />
        </MotionImageFrame>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,11,9,0.96),rgba(12,11,9,0.72),rgba(12,11,9,0.18))]" />
        <div className="relative mx-auto flex min-h-[calc(88svh-13rem)] w-full max-w-7xl items-center">
          <div className="max-w-3xl py-16">
            <div
              className="animate-fade-up mb-5 flex items-center gap-4"
              style={{ animationDelay: "80ms" }}
            >
              <Equalizer className="h-6" />
              <p className="text-sm font-bold uppercase text-red-400">
                Premium music academy and creative studio
              </p>
            </div>
            <MotionHeadline
              text="Tami Bedford Sessions"
              className="font-display text-5xl font-black leading-none text-balance md:text-7xl"
              delay={0.15}
            />
            <p
              className="animate-fade-up mt-6 max-w-2xl text-lg leading-8 text-cream/80 md:text-xl"
              style={{ animationDelay: "480ms" }}
            >
              Structured piano, organ, and music production training for
              musicians who want practical fluency, creative confidence, and
              professional standards.
            </p>
            <div
              className="animate-fade-up mt-8 flex flex-col gap-3 sm:flex-row"
              style={{ animationDelay: "620ms" }}
            >
              <ActionLink href="/apply">Apply for Sessions</ActionLink>
              <ActionLink href="/sessions" variant="ghost">
                Explore Sessions
              </ActionLink>
            </div>
          </div>
        </div>
        <ScrollCue className="absolute bottom-28 left-1/2 hidden -translate-x-1/2 md:flex" />
      </section>

      <section className="relative z-10 -mt-20 px-5 md:px-8">
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-lg border border-ink/10 bg-cream text-ink shadow-soft md:grid-cols-3">
          {proofPoints.map((point) => (
            <div
              key={point.value}
              className="border-b border-ink/10 px-7 py-7 md:border-b-0 md:border-r md:last:border-r-0"
            >
              <p className="font-display text-5xl font-black text-red-700">
                <CountUp value={point.value} />
              </p>
              <p className="mt-2 max-w-xs text-sm font-bold uppercase leading-6 text-ink/82">
                {point.label}
              </p>
            </div>
          ))}
        </div>
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
              body="Each session path is designed for weekly progress, direct application, and guided practice between meetings."
            />
            <ActionLink href="/sessions" variant="secondary">
              Compare Sessions
            </ActionLink>
          </div>
          <div className="grid gap-6 lg:grid-cols-3" data-stagger>
            {sessions.map((session, index) => (
              <div key={session.slug} className={index === 1 ? "lg:-translate-y-6" : ""}>
                <SessionCard session={session} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="surface-grid relative overflow-hidden bg-cream px-5 py-20 text-ink md:px-8 md:py-28">
        <GhostWord word="Studio" tone="dark" className="-left-8 bottom-8 text-[17vw]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="mb-4 text-sm font-bold uppercase text-red-700">
              Services
            </p>
            <h2 className="font-display text-4xl font-black leading-none text-balance md:text-6xl">
              Production support for songs that need direction.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-ink/82">
               Arrangement, tracking, vocal production, and practical studio
               direction for artists who need the music to move with intention.
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

          <div className="grid gap-4 sm:grid-cols-2" data-stagger>
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <article
                  key={service.title}
                  className={`card-lift relative overflow-hidden rounded-lg border border-ink/10 bg-white shadow-soft ${
                    index === 1 ? "sm:translate-y-8" : ""
                  }`}
                  data-reveal="card"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <SafeImage
                      src={service.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <span className="grid h-10 w-10 place-items-center rounded-md bg-ink text-cream">
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <h3 className="mt-5 font-display text-2xl font-black leading-none">
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
              eyebrow="Work"
              title="A creative archive with room to grow."
              body="Music, poetry, and short-film material share one intentional hub for releases, writing, visual work, and process notes."
            />
            <div className="mt-8 grid gap-4" data-stagger>
              {workCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <div
                    key={category.title}
                    className="card-lift relative flex gap-4 overflow-hidden rounded-lg border border-cream/12 bg-cream/[0.04] p-4"
                    data-reveal="card"
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-red-600 text-white">
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-display text-2xl font-black">
                        {category.title}
                      </h3>
                      <p className="mt-1 leading-7 text-cream/82">
                        {category.summary}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-8">
              <ActionLink href="/work" variant="secondary">
                Visit Work Hub
              </ActionLink>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-smoke px-5 py-20 md:px-8 md:py-28">
        <GhostWord word="Craft" className="-left-6 top-10 text-[17vw]" />
        <div className="relative mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Why it works"
            title="Teaching that stays close to real music."
            body="The brand serves musicians through structured learning, studio craft, and creative direction that stay close to real musical use."
            align="center"
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3" data-stagger>
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <article
                  key={value.title}
                  className="card-lift relative overflow-hidden rounded-lg border border-cream/12 bg-cream/[0.04] p-6"
                  data-reveal="card"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-md bg-brass text-ink">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <h3 className="mt-6 font-display text-2xl font-black">
                    {value.title}
                  </h3>
                  <p className="mt-3 leading-7 text-cream/82">{value.text}</p>
                </article>
              );
            })}
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
          <Link
            href="/apply"
            className={`motion-sheen inline-flex min-h-12 items-center justify-center gap-2 overflow-hidden rounded-md bg-white px-5 py-3 text-sm font-bold uppercase text-red-700 hover:bg-cream ${interactiveStateClasses}`}
          >
            Apply Now
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
