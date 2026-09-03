import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { GhostWord } from "@/components/brand-motifs";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { SessionCard } from "@/components/session-card";
import { sessions } from "@/lib/content";
import { interactiveStateClasses } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Sessions",
  description:
    "Compare Tami Bedford piano, choral, organ, and music production sessions.",
  openGraph: {
    title: "Sessions | Tami Bedford",
    description:
      "Compare Tami Bedford piano, choral, organ, and music production sessions.",
  },
  twitter: {
    title: "Sessions | Tami Bedford",
    description:
      "Compare Tami Bedford piano, choral, organ, and music production sessions.",
  },
};

const comparisonRows = [
  {
    label: "Monthly price",
    values: sessions.map((session) => `${session.price} ${session.cadence}`),
  },
  {
    label: "Format",
    values: sessions.map((session) => session.format),
  },
  {
    label: "Focus",
    values: sessions.map((session) => session.eyebrow),
  },
  {
    label: "Best for",
    values: sessions.map((session) => session.whoFor[0]),
  },
  {
    label: "Materials",
    values: sessions.map((session) => session.materials),
  },
] as const;

export default function SessionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Sessions"
        title="Music learning with a clear weekly path."
        body="Choose the session that matches your instrument, creative goal, and current stage. Each path includes live guidance, practice materials, and practical outcomes."
        image="/images/organ-keys.jpg"
        primaryHref="/apply"
        primaryLabel="Apply for Sessions"
      />

      <section className="bg-cream px-5 py-20 text-ink md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Compare"
            title="Four focused ways to grow."
            body="The sessions are built for different musical needs, but every path is structured, practical, and focused on real use."
            tone="dark"
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4" data-stagger>
            {sessions.map((session) => (
              <SessionCard key={session.slug} session={session} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-ink px-5 py-20 md:px-8 md:py-28">
        <GhostWord word="Compare" className="-right-8 top-8 text-[15vw]" />
        <div className="relative mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Side by side"
            title="Every path at a glance."
            body="Same commitment, same standards — the difference is the instrument and the musical outcome you are building toward."
          />
          <div
            className="mt-12 overflow-x-auto rounded-lg border border-cream/12 bg-cream/[0.03]"
            data-reveal="card"
          >
            <table className="w-full min-w-[980px] border-collapse text-left">
              <thead>
                <tr className="border-b border-cream/12">
                  <th scope="col" className="p-5 md:p-6">
                    <span className="sr-only">Feature</span>
                  </th>
                  {sessions.map((session) => (
                    <th
                      key={session.slug}
                      scope="col"
                      className="p-5 align-bottom md:p-6"
                    >
                      <p className="font-display text-2xl font-black leading-none text-cream">
                        {session.title}
                      </p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.label} className="border-b border-cream/10">
                    <th
                      scope="row"
                      className="p-5 align-top text-sm font-bold uppercase text-brass md:p-6"
                    >
                      {row.label}
                    </th>
                    {row.values.map((value, index) => (
                      <td
                        key={sessions[index].slug}
                        className="p-5 align-top leading-7 text-cream/82 md:p-6"
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <td className="p-5 md:p-6" />
                  {sessions.map((session) => (
                    <td key={session.slug} className="p-5 align-top md:p-6">
                      <Link
                        href={`/apply?track=${session.slug}`}
                        className={`motion-sheen inline-flex min-h-11 items-center justify-center gap-2 overflow-hidden rounded-md bg-red-600 px-4 py-2 text-sm font-bold uppercase text-white hover:bg-red-500 ${interactiveStateClasses}`}
                      >
                        Apply
                        <ArrowRight aria-hidden="true" className="h-4 w-4" />
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="surface-grid bg-charcoal px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <SectionHeading
            eyebrow="Included"
            title="What every session path gives you."
            body="Students get more than a weekly call. The structure around each lesson makes the work easier to repeat, review, and apply."
          />
          <div className="grid gap-4 sm:grid-cols-2" data-stagger>
            {[
              "One 1-hour online session per week",
              "A clear progression from your current level",
              "Curated learning materials and guides",
              "Practice direction between sessions",
              "Practical Gospel and Contemporary application",
              "Direct feedback on musical decisions",
            ].map((item) => (
              <div
                key={item}
                className="flex gap-3 rounded-lg border border-cream/12 bg-cream/[0.04] p-4"
                data-reveal="card"
              >
                <CheckCircle2
                  aria-hidden="true"
                  className="mt-1 h-5 w-5 shrink-0 text-brass"
                />
                <p className="leading-7 text-cream/82">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
