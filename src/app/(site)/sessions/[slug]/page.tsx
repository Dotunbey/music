import type { Metadata } from "next";
import Link from "next/link";
import { SafeImage } from "@/components/safe-image";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { ActionLink } from "@/components/action-link";
import { FaqAccordion } from "@/components/faq-accordion";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { getSession, sessions } from "@/lib/content";
import { interactiveStateClasses } from "@/lib/ui";

type SessionDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return sessions.map((session) => ({ slug: session.slug }));
}

export async function generateMetadata({
  params,
}: SessionDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const session = getSession(slug);

  if (!session) {
    return {};
  }

  return {
    title: session.title,
    description: session.summary,
    openGraph: {
      title: `${session.title} | Tami Bedford`,
      description: session.summary,
    },
    twitter: {
      title: `${session.title} | Tami Bedford`,
      description: session.summary,
    },
  };
}

export default async function SessionDetailPage({
  params,
}: SessionDetailPageProps) {
  const { slug } = await params;
  const session = getSession(slug);

  if (!session) {
    notFound();
  }

  return (
    <>
      <PageHero
        eyebrow={session.eyebrow}
        title={session.title}
        body={session.summary}
        image={session.image}
      />

      <section className="bg-cream px-5 py-16 text-ink md:px-8 md:py-20">
        <div
          className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.78fr_1.22fr]"
          data-stagger
        >
          <aside
            className="rounded-lg border border-ink/10 bg-white p-6 shadow-soft lg:sticky lg:top-28 lg:self-start"
            data-reveal="card"
          >
            <p className="font-display text-5xl font-black text-red-700">
              {session.price}
            </p>
            <p className="mt-1 text-sm font-bold uppercase text-ink/82">
              {session.cadence}
            </p>
            <p className="mt-5 leading-7 text-ink/82">{session.format}</p>
            <div className="mt-7">
              <ActionLink href={`/apply?track=${session.slug}`} className="w-full">
                Apply Now
              </ActionLink>
            </div>
          </aside>

          <div
            className="rounded-lg border border-ink/10 bg-white p-6 shadow-soft md:p-8"
            data-reveal="card"
          >
            <SectionHeading title="Who this is for." tone="dark" />
            <div className="mt-10 grid gap-4 sm:grid-cols-2" data-stagger>
              {session.whoFor.map((item) => (
                <div
                  key={item}
                  className="flex gap-3 border-t border-ink/12 pt-4"
                  data-reveal="card"
                >
                  <CheckCircle2
                    aria-hidden="true"
                    className="mt-1 h-5 w-5 shrink-0 text-red-700"
                  />
                  <p className="font-bold leading-7 text-ink/82">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-charcoal px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-start">
          <div>
            <SectionHeading eyebrow="Outcomes" title="What you will learn." />
            <ol className="mt-10 grid" data-stagger>
              {session.outcomes.map((outcome, index) => (
                <li
                  key={outcome}
                  className="relative flex gap-5 pb-8 last:pb-0"
                  data-reveal="card"
                >
                  {index < session.outcomes.length - 1 ? (
                    <span
                      aria-hidden="true"
                      className="absolute left-[22px] top-12 h-[calc(100%-3rem)] w-px bg-cream/14"
                    />
                  ) : null}
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md border border-brass/40 bg-brass/10 font-display text-lg font-black text-brass">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="pt-2 leading-7 text-cream/82">{outcome}</p>
                </li>
              ))}
            </ol>
          </div>

          <div
            className="overflow-hidden rounded-lg border border-cream/12 bg-cream/[0.04]"
            data-reveal="card"
          >
            <div className="relative aspect-[4/3]">
              <SafeImage
                  src={session.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 38vw, 100vw"
                  className="object-cover"
                />
            </div>
            <div className="p-6">
              <h3 className="font-display text-3xl font-black">
                Learning materials and guides
              </h3>
              <p className="mt-4 leading-8 text-cream/82">
                {session.materials}
              </p>
              <div className="mt-7 border-t border-cream/12 pt-6">
                <p className="text-sm font-bold uppercase text-red-400">
                  Requirements
                </p>
                <ul className="mt-4 grid gap-3">
                  {session.requirements.map((requirement) => (
                    <li
                      key={requirement}
                      className="flex gap-3 text-cream/82"
                    >
                      <CheckCircle2
                        aria-hidden="true"
                        className="mt-1 h-4 w-4 shrink-0 text-brass"
                      />
                      {requirement}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ink px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="Questions"
            title="Before you apply."
            align="center"
          />
          <div className="mt-10">
            <FaqAccordion items={session.faqs} />
          </div>
          <div className="mt-10 text-center">
            <ActionLink href={`/apply?track=${session.slug}`}>
              Apply for {session.title}
            </ActionLink>
          </div>
        </div>
      </section>

      <div className="h-20 md:hidden" aria-hidden="true" />
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-cream/12 bg-ink/92 px-5 py-3 backdrop-blur-xl md:hidden">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase text-cream">
              {session.title}
            </p>
            <p className="text-sm text-brass">
              {session.price} {session.cadence}
            </p>
          </div>
          <Link
            href={`/apply?track=${session.slug}`}
            className={`motion-sheen inline-flex min-h-11 items-center justify-center gap-2 overflow-hidden rounded-md bg-red-600 px-4 py-2 text-sm font-bold uppercase text-white hover:bg-red-500 ${interactiveStateClasses}`}
          >
            Apply
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </>
  );
}
