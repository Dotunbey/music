import type { Metadata } from "next";
import { SafeImage } from "@/components/safe-image";
import { ScriptHero } from "@/components/script-hero";
import { team } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description: "Meet musician, producer, arranger, and mentor Tami Bedford.",
  openGraph: {
    title: "About | Tami Bedford",
    description: "Meet musician, producer, arranger, and mentor Tami Bedford.",
  },
  twitter: {
    title: "About | Tami Bedford",
    description: "Meet musician, producer, arranger, and mentor Tami Bedford.",
  },
};

export default function AboutPage() {
  const tami = team[0];

  return (
    <>
      <ScriptHero title="About" image="/images/creation-hands.jpg" />

      <section className="gallery-wall relative overflow-hidden px-5 py-24 text-ink md:px-8 md:py-36">
        <div className="relative mx-auto grid max-w-6xl gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <div className="gallery-frame relative aspect-[4/5] overflow-hidden" data-reveal="card">
            <SafeImage src={tami.image} alt={tami.name} fill sizes="(min-width: 768px) 45vw, 100vw" className="object-cover object-[50%_20%]" />
          </div>
          <div data-reveal="card">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-700">Musician · Producer · Mentor</p>
            <h1 className="mt-5 font-display text-5xl font-black leading-none md:text-7xl">{tami.name}</h1>
            <p className="gallery-caption mt-8 max-w-xl pt-7 font-display text-2xl leading-relaxed text-ink/75 md:text-3xl">{tami.bio}</p>
            <ul className="mt-8 flex flex-wrap gap-2">{tami.disciplines.map((discipline) => <li key={discipline} className="rounded-full border border-ink/14 px-3 py-1 text-xs font-bold uppercase tracking-wide text-ink/70">{discipline}</li>)}</ul>
          </div>
        </div>
      </section>
    </>
  );
}
