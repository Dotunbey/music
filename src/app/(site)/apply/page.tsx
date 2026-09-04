import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ErrorBoundary } from "@/components/error-boundary";
import { InquiryForm } from "@/components/inquiry-form";
import { PageHero } from "@/components/page-hero";
import { SafeImage } from "@/components/safe-image";
import { getSession } from "@/lib/content";
import { interactiveStateClasses } from "@/lib/ui";

type ApplyPageProps = {
  searchParams: Promise<{ track?: string }>;
};

export const metadata: Metadata = {
  title: "Apply",
  description:
    "Apply for Tami Bedford piano, choral, organ, or music production sessions.",
  openGraph: {
    title: "Apply | Tami Bedford",
    description:
      "Apply for Tami Bedford piano, choral, organ, or music production sessions.",
  },
  twitter: {
    title: "Apply | Tami Bedford",
    description:
      "Apply for Tami Bedford piano, choral, organ, or music production sessions.",
  },
};

export default async function ApplyPage({ searchParams }: ApplyPageProps) {
  const { track } = await searchParams;
  const selectedSession = track ? getSession(track) : undefined;

  return (
    <>
      <PageHero
        eyebrow="Apply"
        title="Start the conversation."
        image="/images/creation-hands.jpg"
      />

      <section className="bg-ink px-5 py-20 md:px-8 md:py-28">
        <div
          className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start"
          data-stagger
        >
          <aside
            className="rounded-lg border border-cream/12 bg-cream/[0.04] p-6 lg:sticky lg:top-28"
            data-reveal="card"
          >
            <p className="text-sm font-bold uppercase text-red-400">
              What happens next
            </p>
            <div className="mt-6 grid">
              {["Inquiry captured", "Schedule confirmed", "WhatsApp available"].map(
                (step) => (
                  <h2
                    key={step}
                    className="border-t border-cream/12 py-4 font-display text-2xl font-black first:border-t-0 first:pt-0"
                  >
                    {step}
                  </h2>
                ),
              )}
            </div>
          </aside>

          <div data-reveal="card">
            <p className="mb-4 text-sm font-bold uppercase text-red-400">
              Application form
            </p>
            <h2 className="font-display text-4xl font-black leading-none text-balance md:text-6xl">
              Tell us what you want to build.
            </h2>

            {selectedSession ? (
              <div className="mt-8 flex flex-col gap-4 overflow-hidden rounded-lg border border-brass/40 bg-cream/[0.05] sm:flex-row sm:items-center">
                <div className="relative aspect-[16/9] w-full shrink-0 sm:aspect-square sm:w-36">
                  <SafeImage
                    src={selectedSession.image}
                    alt=""
                    fill
                    sizes="(min-width: 640px) 144px, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-3 px-5 pb-5 sm:flex-row sm:items-center sm:justify-between sm:py-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-brass">
                      You are applying for
                    </p>
                    <p className="mt-1 font-display text-2xl font-black text-cream">
                      {selectedSession.title}
                    </p>
                    <p className="mt-1 text-sm font-bold uppercase text-red-400">
                      {selectedSession.price} {selectedSession.cadence}
                    </p>
                  </div>
                  <Link
                    href="/sessions"
                    className={`inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md border border-cream/24 px-4 text-sm font-bold uppercase text-cream hover:border-red-500 hover:text-white ${interactiveStateClasses}`}
                  >
                    Change Session
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ) : null}

            <div className="mt-8">
              <ErrorBoundary>
                <InquiryForm
                  initialTrack={track}
                  sourcePath={`/apply${track ? `?track=${encodeURIComponent(track)}` : ""}`}
                />
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
