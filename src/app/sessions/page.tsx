import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { SessionCard } from "@/components/session-card";
import { sessions } from "@/lib/content";

export const metadata: Metadata = {
  title: "Sessions",
  description:
    "Compare Tami Bedford piano, organ, and music production sessions.",
};

export default function SessionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Sessions"
        title="Music learning with a clear weekly path."
        body="Choose the session that matches your instrument, creative goal, and current stage. Each path includes live guidance, practice materials, and practical outcomes."
        image="/images/hero-lesson.png"
        primaryHref="/apply"
        primaryLabel="Apply for Sessions"
      />

      <section className="bg-cream px-5 py-20 text-ink md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Compare"
            title="Three focused ways to grow."
            body="The sessions are built for different musical needs, but every path is structured, practical, and focused on real use."
            tone="dark"
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-3" data-stagger>
            {sessions.map((session) => (
              <SessionCard key={session.slug} session={session} />
            ))}
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
                <p className="leading-7 text-cream/74">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
