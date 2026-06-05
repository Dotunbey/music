import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Session } from "@/lib/content";
import { ActionLink } from "./action-link";

type SessionCardProps = {
  session: Session;
};

export function SessionCard({ session }: SessionCardProps) {
  const Icon = session.icon;

  return (
    <article
      className="group overflow-hidden rounded-lg border border-ink/10 bg-cream text-ink shadow-soft"
      data-reveal="card"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-charcoal">
        <Image
          src={session.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
      </div>
      <div className="p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <span className="grid h-11 w-11 place-items-center rounded-md bg-red-600 text-white">
            <Icon aria-hidden="true" className="h-5 w-5" />
          </span>
          <span className="text-right text-sm font-bold uppercase text-red-700">
            {session.price} {session.cadence}
          </span>
        </div>
        <h3 className="font-display text-3xl font-black leading-none">
          {session.title}
        </h3>
        <p className="mt-3 min-h-20 leading-7 text-ink/68">{session.summary}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <ActionLink
            href={`/sessions/${session.slug}`}
            className="w-full"
            variant="primary"
          >
            View Session
          </ActionLink>
          <Link
            href={`/apply?track=${session.slug}`}
            className="motion-sheen inline-flex min-h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-md border border-ink/18 px-4 py-3 text-sm font-bold uppercase transition hover:border-red-600 hover:text-red-700"
          >
            Apply
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
