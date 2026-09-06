import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { ScriptHero } from "@/components/script-hero";
import { SectionHeading } from "@/components/section-heading";
import { SessionCard } from "@/components/session-card";
import { ActionLink } from "@/components/action-link";
import { sessions } from "@/lib/content";

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

export default function SessionsPage() {
  return (
    <>
      <ScriptHero title="Sessions" image="/images/organ-keys.jpg" />

      <section className="bg-cream px-5 py-20 text-ink md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4" data-stagger>
            {sessions.map((session) => (
              <SessionCard key={session.slug} session={session} />
            ))}
          </div>
          <div className="mt-10 text-center"><ActionLink href="/sessions/teachers">Meet the Teachers</ActionLink></div>
        </div>
      </section>

      <section className="surface-grid bg-charcoal px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <SectionHeading
            eyebrow="Included"
            title="What every path includes."
          />
          <div className="grid gap-4 sm:grid-cols-2" data-stagger>
            {[
              "One 1-hour online session per week",
              "Level-based progression",
              "Curated materials",
              "Practice direction",
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
