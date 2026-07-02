import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, Mail, MessageCircle } from "lucide-react";
import { ErrorBoundary } from "@/components/error-boundary";
import { InquiryForm } from "@/components/inquiry-form";
import { PageHero } from "@/components/page-hero";
import { SafeImage } from "@/components/safe-image";
import { contact, getSession, services } from "@/lib/content";
import { interactiveStateClasses } from "@/lib/ui";

type ApplyPageProps = {
  searchParams: Promise<{ track?: string }>;
};

export const metadata: Metadata = {
  title: "Apply",
  description:
    "Apply for Tami Bedford sessions or send a production service inquiry.",
  openGraph: {
    title: "Apply | Tami Bedford",
    description:
      "Apply for Tami Bedford sessions or send a production service inquiry.",
  },
  twitter: {
    title: "Apply | Tami Bedford",
    description:
      "Apply for Tami Bedford sessions or send a production service inquiry.",
  },
};

export default async function ApplyPage({ searchParams }: ApplyPageProps) {
  const { track } = await searchParams;
  const selectedSession = track ? getSession(track) : undefined;
  const selectedService = track
    ? services.find((service) => service.title === track)
    : undefined;

  return (
    <>
      <PageHero
        eyebrow="Apply"
        title="Start the conversation."
        body="Share your current level, preferred schedule, and the session or service you need. We capture your inquiry and send it to the team."
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
            <div className="mt-6 grid gap-5">
              {[
                {
                  icon: Mail,
                  title: "Your inquiry is captured",
                  text: "Your inquiry is captured now, and we also provide quick follow-up links for email or WhatsApp if you want to continue there.",
                },
                {
                  icon: CalendarDays,
                  title: "Schedule is confirmed manually",
                  text: "The team can review your goals and agree on timing before any payment conversation.",
                },
                {
                  icon: MessageCircle,
                  title: "Use WhatsApp for speed",
                  text: `You can also message ${contact.phone} directly if you prefer a faster first touch.`,
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex gap-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-brass text-ink">
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <div>
                      <h2 className="font-display text-2xl font-black">
                        {item.title}
                      </h2>
                      <p className="mt-2 leading-7 text-cream/82">
                        {item.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>

          <div data-reveal="card">
            <p className="mb-4 text-sm font-bold uppercase text-red-400">
              Application form
            </p>
            <h2 className="font-display text-4xl font-black leading-none text-balance md:text-6xl">
              Tell us what you want to build.
            </h2>
            <p className="mt-5 max-w-2xl leading-8 text-cream/82">
              A few details help the team understand your goals, current level,
              and preferred timing before the first reply.
            </p>

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

            {selectedService ? (
              <div className="mt-8 flex flex-col gap-3 rounded-lg border border-brass/40 bg-cream/[0.05] p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-brass">
                    You are inquiring about
                  </p>
                  <p className="mt-1 font-display text-2xl font-black text-cream">
                    {selectedService.title}
                  </p>
                </div>
                <Link
                  href="/services"
                  className={`inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md border border-cream/24 px-4 text-sm font-bold uppercase text-cream hover:border-red-500 hover:text-white ${interactiveStateClasses}`}
                >
                  View Services
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
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
