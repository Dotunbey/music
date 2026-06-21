import { SafeImage } from "./safe-image";
import { ActionLink } from "./action-link";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  body: string;
  image: string;
  primaryHref?: string;
  primaryLabel?: string;
};

export function PageHero({
  eyebrow,
  title,
  body,
  image,
  primaryHref,
  primaryLabel,
}: PageHeroProps) {
  return (
    <section className="relative isolate min-h-[520px] overflow-hidden bg-ink px-5 pt-32 text-cream md:px-8">
      <SafeImage
        src={image}
        alt=""
        fill
        priority
        sizes="100vw"
        data-parallax="0.16"
        className="parallax-media object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,11,9,0.92),rgba(12,11,9,0.62),rgba(12,11,9,0.2))]" />
      <div className="relative mx-auto flex min-h-[388px] w-full max-w-7xl items-center">
        <div className="max-w-3xl animate-fade-up" data-reveal="hero">
          <p className="mb-5 text-sm font-bold uppercase text-red-400">
            {eyebrow}
          </p>
          <h1 className="font-display text-5xl font-black leading-none text-balance md:text-7xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-cream/82 md:text-xl">
            {body}
          </p>
          {primaryHref && primaryLabel ? (
            <div className="mt-8">
              <ActionLink href={primaryHref}>{primaryLabel}</ActionLink>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
