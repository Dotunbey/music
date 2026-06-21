import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { ActionLink } from "@/components/action-link";
import { SafeImage } from "@/components/safe-image";
import { SectionHeading } from "@/components/section-heading";
import { SessionCard } from "@/components/session-card";
import { contact, proofPoints, services, sessions, values, workCategories } from "@/lib/content";

export default function Home() {
  return (
    <>
      <section className="grain relative isolate min-h-[88svh] overflow-hidden bg-ink px-5 pt-28 text-cream md:px-8">
        <SafeImage
          src="/images/hero-lesson.png"
          alt=""
          fill
          priority
          sizes="100vw"
          data-parallax="0.14"
          className="parallax-media object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,11,9,0.96),rgba(12,11,9,0.72),rgba(12,11,9,0.18))]" />
        <div className="relative mx-auto flex min-h-[calc(88svh-7rem)] w-full max-w-7xl items-center">
          <div className="max-w-3xl animate-fade-up py-16" data-reveal="hero">
            <p className="mb-5 text-sm font-bold uppercase text-red-400">
              Premium music academy and creative studio
            </p>
            <h1 className="font-display text-5xl font-black leading-none text-balance md:text-7xl">
              Tami Bedford Sessions
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-cream/80 md:text-xl">
              Structured piano, organ, and music production training for
              musicians who want practical fluency, creative confidence, and
              professional standards.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ActionLink href="/apply">Apply for Sessions</ActionLink>
              <ActionLink href="/sessions" variant="ghost">
                Explore Sessions
              </ActionLink>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-cream/10 bg-cream text-ink">
        <div className="mx-auto grid max-w-7xl gap-0 px-5 md:grid-cols-3 md:px-8">
          {proofPoints.map((point) => (
            <div
              key={point.value}
              className="border-b border-ink/10 py-7 md:border-b-0 md:border-r md:last:border-r-0"
            >
              <p className="font-display text-5xl font-black text-red-700">
                {point.value}
              </p>
              <p className="mt-2 max-w-xs text-sm font-bold uppercase leading-6 text-ink/82">
                {point.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-charcoal px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
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
            {sessions.map((session) => (
              <SessionCard key={session.slug} session={session} />
            ))}
          </div>
        </div>
      </section>

      <section className="surface-grid bg-cream px-5 py-20 text-ink md:px-8 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
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
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-ink/20 px-5 py-3 text-sm font-bold uppercase transition hover:border-red-600 hover:text-red-700"
              >
                <MessageCircle aria-hidden="true" className="h-4 w-4" />
                Message Us
              </a>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2" data-stagger>
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <article
                  key={service.title}
                  className="overflow-hidden rounded-lg border border-ink/10 bg-white shadow-soft"
                  data-reveal="card"
                >
                  <div className="relative aspect-[4/3]">
                    <SafeImage
                      src={service.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="object-cover"
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

      <section className="bg-ink px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
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
                    className="flex gap-4 rounded-lg border border-cream/12 bg-cream/[0.04] p-4"
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

      <section className="bg-smoke px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
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
                  className="rounded-lg border border-cream/12 bg-cream/[0.04] p-6"
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

      <section className="bg-red-700 px-5 py-14 text-white md:px-8">
        <div
          className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between"
          data-reveal="card"
        >
          <div>
            <p className="text-sm font-bold uppercase text-white/82">
              Ready for structure?
            </p>
            <h2 className="mt-2 font-display text-4xl font-black leading-none md:text-5xl">
              Start with the path that fits your music.
            </h2>
          </div>
          <Link
            href="/apply"
            className="motion-sheen inline-flex min-h-12 items-center justify-center gap-2 overflow-hidden rounded-md bg-white px-5 py-3 text-sm font-bold uppercase text-red-700 transition hover:bg-cream"
          >
            Apply Now
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
