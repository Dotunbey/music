import type { Metadata } from "next";
import { SafeImage } from "@/components/safe-image";
import { Award, CircleCheck, Users } from "lucide-react";
import { ActionLink } from "@/components/action-link";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { team, values } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet Tami Bedford and the session guides behind the music academy and creative studio.",
  openGraph: {
    title: "About | Tami Bedford",
    description:
      "Meet Tami Bedford and the session guides behind the music academy and creative studio.",
  },
  twitter: {
    title: "About | Tami Bedford",
    description:
      "Meet Tami Bedford and the session guides behind the music academy and creative studio.",
  },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Guides with real music and studio experience."
        body="Sessions is led by musicians who understand performance, production, mentoring, and the standards required for long-term creative growth."
        image="/images/creation-hands.jpg"
        primaryHref="/apply"
        primaryLabel="Start Learning"
      />

      <section className="bg-cream px-5 py-20 text-ink md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Team"
            title="Meet the session guides."
            body="The teaching team brings performance, production, and mentoring experience into a focused learning environment."
            tone="dark"
          />
          <div className="mt-12 grid gap-8" data-stagger>
            {team.map((member, index) => (
              <article
                key={member.name}
                className="grid overflow-hidden rounded-lg border border-ink/10 bg-white shadow-soft lg:grid-cols-[0.8fr_1.2fr]"
                data-reveal="card"
              >
                <div
                  className={`relative aspect-[4/5] bg-ink/5 sm:aspect-[3/4] lg:aspect-auto lg:min-h-[520px] ${
                    index % 2 === 1 ? "lg:order-2" : ""
                  }`}
                >
                  <SafeImage
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="(min-width: 1024px) 42vw, 100vw"
                      className="object-cover object-top"
                    />
                </div>
                <div className="flex flex-col justify-center p-6 md:p-10">
                  <p className="text-sm font-bold uppercase text-red-700">
                    {member.role}
                  </p>
                  <h2 className="mt-3 font-display text-4xl font-black leading-none md:text-5xl">
                    {member.name}
                  </h2>
                  <p className="mt-6 max-w-3xl leading-8 text-ink/82">
                    {member.bio}
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    {[
                      "Music education",
                      "Performance context",
                      "Production standards",
                    ].map((item) => (
                      <span
                        key={item}
                        className="inline-flex items-center gap-2 rounded-md border border-ink/12 px-3 py-2 text-sm font-bold text-ink/82"
                      >
                        <CircleCheck
                          aria-hidden="true"
                          className="h-4 w-4 text-red-700"
                        />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-charcoal px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <SectionHeading
            eyebrow="Foundation"
            title="Built around standards, not shortcuts."
            body="Sessions is a serious learning environment, and the studio practice gives students a practical creative standard to grow toward."
          />
          <div className="grid gap-4 sm:grid-cols-2" data-stagger>
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <article
                  key={value.title}
                  className="rounded-lg border border-cream/12 bg-cream/[0.04] p-5"
                  data-reveal="card"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-md bg-brass text-ink">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 font-display text-2xl font-black">
                    {value.title}
                  </h3>
                  <p className="mt-3 leading-7 text-cream/82">{value.text}</p>
                </article>
              );
            })}
            <article
              className="rounded-lg border border-cream/12 bg-red-700 p-5 text-white"
              data-reveal="card"
            >
              <span className="grid h-11 w-11 place-items-center rounded-md bg-white text-red-700">
                <Award aria-hidden="true" className="h-5 w-5" />
              </span>
              <h3 className="mt-5 font-display text-2xl font-black">
                MUSON-certified leadership
              </h3>
              <p className="mt-3 leading-7 text-white/84">
                Tami brings formal theory and piano training into a practical,
                artist-facing teaching environment.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-ink px-5 py-16 md:px-8">
        <div
          className="mx-auto flex max-w-7xl flex-col gap-6 rounded-lg border border-cream/12 bg-cream/[0.04] p-6 md:flex-row md:items-center md:justify-between md:p-8"
          data-reveal="card"
        >
          <div className="flex gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-red-600">
              <Users aria-hidden="true" className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-bold uppercase text-red-400">
                Sessions
              </p>
              <h2 className="mt-2 font-display text-3xl font-black leading-none">
                Find the right guide for your next stage.
              </h2>
            </div>
          </div>
          <ActionLink href="/apply" variant="secondary">
            Apply Now
          </ActionLink>
        </div>
      </section>
    </>
  );
}
