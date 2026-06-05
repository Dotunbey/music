import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { ActionLink } from "@/components/action-link";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { getSession, sessions } from "@/lib/content";

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

  const Icon = session.icon;

  return (
    <>
      <PageHero
        eyebrow={session.eyebrow}
        title={session.title}
        body={session.summary}
        image={session.image}
        primaryHref={`/apply?track=${session.slug}`}
        primaryLabel="Apply for this Session"
      />

      <section className="bg-cream px-5 py-16 text-ink md:px-8 md:py-20">
        <div
          className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.78fr_1.22fr]"
          data-stagger
        >
          <aside
            className="rounded-lg border border-ink/10 bg-white p-6 shadow-soft"
            data-reveal="card"
          >
            <span className="grid h-12 w-12 place-items-center rounded-md bg-red-600 text-white">
              <Icon aria-hidden="true" className="h-5 w-5" />
            </span>
            <p className="mt-6 font-display text-5xl font-black text-red-700">
              {session.price}
            </p>
            <p className="mt-1 text-sm font-bold uppercase text-ink/58">
              {session.cadence}
            </p>
            <p className="mt-5 leading-7 text-ink/70">{session.format}</p>
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
            <SectionHeading
              eyebrow="Structured learning path"
              title="From foundation to confident application."
              body={session.promise}
              tone="dark"
            />
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
                  <p className="font-bold leading-7 text-ink/78">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-charcoal px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-start">
          <div>
            <SectionHeading
              eyebrow="Outcomes"
              title="What you will learn."
              body="Each topic is taught for use, not just theory. The goal is confident repetition outside the lesson."
            />
            <div className="mt-10 grid gap-4" data-stagger>
              {session.outcomes.map((outcome) => (
                <div
                  key={outcome}
                  className="flex gap-4 rounded-lg border border-cream/12 bg-cream/[0.04] p-4"
                  data-reveal="card"
                >
                  <CheckCircle2
                    aria-hidden="true"
                    className="mt-1 h-5 w-5 shrink-0 text-brass"
                  />
                  <p className="leading-7 text-cream/76">{outcome}</p>
                </div>
              ))}
            </div>
          </div>

          <div
            className="overflow-hidden rounded-lg border border-cream/12 bg-cream/[0.04]"
            data-reveal="card"
          >
            <div className="relative aspect-[4/3]">
              <Image
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
              <p className="mt-4 leading-8 text-cream/72">
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
                      className="flex gap-3 text-cream/72"
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
        <div className="mx-auto max-w-5xl">
          <SectionHeading
            eyebrow="Questions"
            title="Before you apply."
            body="The application starts the conversation. It does not lock you into payment or a schedule."
            align="center"
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2" data-stagger>
            {session.faqs.map((faq) => (
              <article
                key={faq.question}
                className="rounded-lg border border-cream/12 bg-cream/[0.04] p-6"
                data-reveal="card"
              >
                <h3 className="font-display text-2xl font-black">
                  {faq.question}
                </h3>
                <p className="mt-3 leading-7 text-cream/70">{faq.answer}</p>
              </article>
            ))}
          </div>
          <div className="mt-10 text-center">
            <ActionLink href={`/apply?track=${session.slug}`}>
              Apply for {session.title}
            </ActionLink>
          </div>
        </div>
      </section>
    </>
  );
}
