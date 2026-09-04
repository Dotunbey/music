import type { Metadata } from "next";
import { SafeImage } from "@/components/safe-image";
import { ActionLink } from "@/components/action-link";
import { ScriptHero } from "@/components/script-hero";
import { SectionHeading } from "@/components/section-heading";
import { team } from "@/lib/content";

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
      <ScriptHero title="About" image="/images/creation-hands.jpg" />

      <section className="gallery-wall relative overflow-hidden px-5 py-24 text-ink md:px-8 md:py-36">
        <div className="relative mx-auto max-w-7xl">
          <SectionHeading title="The guides." tone="dark" />
          <div
            className="mt-16 grid gap-x-10 gap-y-16 md:grid-cols-2"
            data-stagger
          >
            {team.map((member) => (
              <article
                key={member.name}
                className="gallery-frame card-lift relative overflow-hidden"
                data-reveal="card"
              >
                <div className="relative aspect-[4/5]">
                  <SafeImage
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover object-[50%_20%]"
                  />
                </div>
                <div className="p-6 md:p-8">
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-ink/55">
                    {member.role}
                  </span>
                  <h2 className="mt-4 font-display text-4xl font-black leading-none">
                    {member.name}
                  </h2>
                  <p className="gallery-caption mt-5 pt-5 leading-8 text-ink/72">
                    {member.bio}
                  </p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {member.disciplines.map((discipline) => (
                      <li
                        key={discipline}
                        className="rounded-full border border-ink/14 px-3 py-1 text-xs font-bold uppercase tracking-wide text-ink/70"
                      >
                        {discipline}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="gallery-wall px-5 py-16 text-ink md:px-8 md:py-24">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-md font-display text-2xl font-black leading-tight md:text-3xl">
            Find the right guide for your next stage.
          </p>
          <ActionLink href="/apply">Apply Now</ActionLink>
        </div>
      </section>
    </>
  );
}
