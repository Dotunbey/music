import { MotionImageFrame } from "./motion-primitives";
import { SafeImage } from "./safe-image";

/**
 * A quiet, gallery-style hero: a single title set in the art script, centred
 * over a darkened image. Generous line-height and top padding keep the tall
 * script glyphs clear of the fixed header (no clipping).
 */
export function ScriptHero({ title, image }: { title: string; image: string }) {
  return (
    <section className="grain relative isolate flex min-h-[58svh] items-center justify-center overflow-hidden bg-ink px-5 pt-24 pb-10 text-cream md:px-8">
      <MotionImageFrame className="absolute inset-0" parallax={28}>
        <SafeImage
          src={image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="animate-ken-burns object-cover object-center [filter:brightness(0.6)_contrast(1.05)_saturate(0.8)]"
        />
      </MotionImageFrame>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(28,24,21,0.58),rgba(28,24,21,0.34)_45%,rgba(28,24,21,0.72))]" />
      <h1 className="animate-fade-up relative text-balance px-2 text-center font-art leading-[1.3] text-cream [text-shadow:0_4px_44px_rgba(0,0,0,0.5)] text-6xl md:text-8xl">
        {title}
      </h1>
    </section>
  );
}
