import type { Metadata } from "next";
import { SafeImage } from "@/components/safe-image";
import { ActionLink } from "@/components/action-link";
import { ScriptHero } from "@/components/script-hero";
import { team } from "@/lib/content";

export const metadata: Metadata = { title: "Tutors", description: "Meet the tutors behind Tami Bedford music sessions." };

export default function TutorsPage() {
  return <><ScriptHero title="Tutors" image="/images/piano-keys.jpg" /><section className="gallery-wall px-5 py-20 text-ink md:px-8 md:py-28"><div className="mx-auto max-w-6xl"><div className="grid gap-8 md:grid-cols-2" data-stagger>{team.map((tutor) => <article key={tutor.name} className="gallery-frame overflow-hidden" data-reveal="card"><div className="relative aspect-[4/5]"><SafeImage src={tutor.image} alt={tutor.name} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover object-[50%_20%]" /></div><div className="p-6 md:p-8"><p className="text-xs font-bold uppercase tracking-[0.18em] text-red-700">{tutor.role}</p><h2 className="mt-3 font-display text-4xl font-black leading-none">{tutor.name}</h2><p className="mt-5 border-t border-ink/10 pt-5 leading-7 text-ink/70">{tutor.bio}</p><ul className="mt-5 flex flex-wrap gap-2">{tutor.disciplines.map((discipline) => <li key={discipline} className="rounded-full border border-ink/14 px-3 py-1 text-xs font-bold uppercase text-ink/65">{discipline}</li>)}</ul></div></article>)}</div><div className="mt-12 text-center"><ActionLink href="/apply">Apply for Sessions</ActionLink></div></div></section></>;
}
