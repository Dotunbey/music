import { SafeImage } from "./safe-image";
import { ActionLink } from "./action-link";
import { Equalizer } from "./brand-motifs";
import { MotionHeadline, MotionImageFrame } from "./motion-primitives";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  body?: string;
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
          className="animate-ken-burns object-cover object-center [filter:brightness(0.82)_contrast(1.04)_saturate(0.85)]"
        />
      </MotionImageFrame>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(82,75,66,0.92),rgba(82,75,66,0.62),rgba(82,75,66,0.24))]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(82,75,66,0.5),transparent_36%,transparent_62%,rgba(82,75,66,0.9))]" />
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
          {body ? (
            <p
              className="animate-fade-up mt-6 max-w-2xl text-lg leading-8 text-cream/82 md:text-xl"
              style={{ animationDelay: "420ms" }}
            >
              {body}
            </p>
          ) : null}
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
