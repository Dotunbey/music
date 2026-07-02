import { SafeImage } from "./safe-image";
import { ActionLink } from "./action-link";
import { Equalizer } from "./brand-motifs";
import { MotionHeadline, MotionImageFrame } from "./motion-primitives";

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
    <section className="grain relative isolate min-h-[520px] overflow-hidden bg-ink px-5 pt-32 text-cream md:px-8">
      <MotionImageFrame className="absolute inset-0" parallax={28}>
        <SafeImage
          src={image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="animate-ken-burns object-cover object-center"
        />
      </MotionImageFrame>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,11,9,0.92),rgba(12,11,9,0.62),rgba(12,11,9,0.2))]" />
      <div className="relative mx-auto flex min-h-[388px] w-full max-w-7xl items-center">
        <div className="max-w-3xl pb-14">
          <div
            className="animate-fade-up mb-5 flex items-center gap-4"
            style={{ animationDelay: "60ms" }}
          >
            <Equalizer className="h-5" />
            <p className="text-sm font-bold uppercase text-red-400">
              {eyebrow}
            </p>
          </div>
          <MotionHeadline
            text={title}
            className="font-display text-5xl font-black leading-none text-balance md:text-7xl"
            delay={0.12}
          />
          <p
            className="animate-fade-up mt-6 max-w-2xl text-lg leading-8 text-cream/82 md:text-xl"
            style={{ animationDelay: "420ms" }}
          >
            {body}
          </p>
          {primaryHref && primaryLabel ? (
            <div
              className="animate-fade-up mt-8"
              style={{ animationDelay: "560ms" }}
            >
              <ActionLink href={primaryHref}>{primaryLabel}</ActionLink>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
