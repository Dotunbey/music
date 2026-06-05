import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Camera,
  Clapperboard,
  Headphones,
  Mic2,
  Music2,
  Piano,
  SlidersHorizontal,
  Sparkles,
  Users,
} from "lucide-react";

export const contact = {
  phone: "+234 815 615 4708",
  whatsapp: "2348156154708",
  email: "support@tamibedford.com",
  instagram: "https://www.instagram.com/tami.bedford?igsh=MXRubDMzOTg0dWVkbw==",
  youtube: "https://youtube.com/@tamibedford?si=g35Z_Bc0xD1NIycH",
};

export const navItems = [
  { href: "/", label: "Home" },
  { href: "/sessions", label: "Sessions" },
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/apply", label: "Apply" },
] as const;

export type SessionSlug = "piano" | "organ" | "production";

export type Session = {
  slug: SessionSlug;
  title: string;
  eyebrow: string;
  price: string;
  cadence: string;
  format: string;
  image: string;
  icon: LucideIcon;
  summary: string;
  promise: string;
  outcomes: string[];
  materials: string;
  requirements: string[];
  whoFor: string[];
  faqs: { question: string; answer: string }[];
};

export const sessions: Session[] = [
  {
    slug: "piano",
    title: "Piano Sessions",
    eyebrow: "Technique, harmony, and expressive playing",
    price: "₦50,000",
    cadence: "per month",
    format: "4 weekly online sessions + full access to materials",
    image: "/images/piano-keys.jpg",
    icon: Piano,
    summary:
      "Build practical piano fluency for Gospel and Contemporary music through a structured path from fundamentals to confident accompaniment.",
    promise:
      "Piano Sessions guide students from foundational technique and harmony through confident accompaniment, musical fluency, and expressive independent playing.",
    outcomes: [
      "Proper technique, coordination, and control",
      "Scales, chords, and practical harmony",
      "Smooth chord movement and voice-leading",
      "Playing songs and accompanying vocals",
      "Musical expression, confidence, and consistency",
    ],
    materials:
      "Access to curated piano materials, practice guides, and resources focused on Gospel and Contemporary music.",
    requirements: [
      "A keyboard or piano for weekly practice",
      "Stable internet access for online lessons",
      "A willingness to practice between sessions",
    ],
    whoFor: [
      "Beginners who need a clear foundation",
      "Church and contemporary musicians who want stronger accompaniment",
      "Intermediate players who want better control and musical vocabulary",
    ],
    faqs: [
      {
        question: "How often do we meet?",
        answer: "One 1-hour online session each week, with materials to guide practice between lessons.",
      },
      {
        question: "Do I need advanced theory first?",
        answer: "No. The path starts from your current level and builds theory through practical playing.",
      },
    ],
  },
  {
    slug: "organ",
    title: "Organ Sessions",
    eyebrow: "Flow, worship support, and musical leadership",
    price: "₦50,000",
    cadence: "per month",
    format: "4 weekly online sessions + full access to materials",
    image: "/images/organ-keys.jpg",
    icon: Music2,
    summary:
      "Develop organ-style control, harmonic movement, and worship accompaniment for real playing environments.",
    promise:
      "Organ Sessions develop students from foundational organ technique through flowing accompaniment, worship application, and confident expressive musicianship.",
    outcomes: [
      "Organ-style technique and musical flow",
      "Harmony, chord movement, and progression awareness",
      "Accompaniment, pads, and worship support",
      "Reharmonization and smooth transitions",
      "Expressive control, phrasing, and musical leadership",
    ],
    materials:
      "Access to curated organ and keyboard resources focused on Gospel, worship, and Contemporary music application.",
    requirements: [
      "A Hammond-style organ or keyboard with organ sounds",
      "Stable internet access for online lessons",
      "Basic keyboard familiarity is helpful but not mandatory",
    ],
    whoFor: [
      "Keyboardists moving into organ-style playing",
      "Worship musicians who need stronger flow and transitions",
      "Players who want better harmonic confidence",
    ],
    faqs: [
      {
        question: "Can I learn on a normal keyboard?",
        answer: "Yes, as long as it has usable organ sounds. A dedicated organ is helpful but not required for v1 learning.",
      },
      {
        question: "Is this only for church musicians?",
        answer: "No. The language is useful for worship, Gospel, and contemporary performance contexts.",
      },
    ],
  },
  {
    slug: "production",
    title: "Music Production Sessions",
    eyebrow: "DAW workflow, arrangement, recording, and mix foundations",
    price: "₦50,000",
    cadence: "per month",
    format: "4 weekly online sessions + full access to materials",
    image: "/images/production-session.jpg",
    icon: SlidersHorizontal,
    summary:
      "Move from rough ideas to organized sessions, confident recording, and release-ready production habits.",
    promise:
      "Music Production Sessions take students from foundational DAW skills and beat-making through recording, mixing, arrangement, and independent release-ready production.",
    outcomes: [
      "Confident DAW workflow and session setup",
      "Beat-making, arrangement, and sound selection",
      "Recording, editing, and vocal production",
      "Mixing fundamentals and music translation",
      "Finishing, exporting, and release-ready production",
    ],
    materials:
      "Access to structured production guides, practice prompts, session templates, and listening references.",
    requirements: [
      "A laptop or desktop that can run your DAW",
      "Headphones or studio monitors",
      "A DAW installed before the first session",
    ],
    whoFor: [
      "Songwriters who want to produce their own ideas",
      "Beginners who need a clear DAW workflow",
      "Musicians who want stronger arrangement and production decisions",
    ],
    faqs: [
      {
        question: "Which DAW should I use?",
        answer: "Any professional DAW can work. The first session can help align your tools with your goals.",
      },
      {
        question: "Will I finish a song?",
        answer: "The goal is practical progress. Students work toward finished ideas while building repeatable production habits.",
      },
    ],
  },
];

export const services = [
  {
    title: "Music Arrangement & Production",
    image: "/images/studio-production.png",
    icon: Headphones,
    summary:
      "End-to-end arrangement and production support for artists, worship projects, and release-focused songs.",
    deliverables: [
      "Songs and instrumentals",
      "Tracking and recording of keys",
      "Arrangement direction for clearer musical movement",
      "Production guidance from idea to export",
    ],
  },
  {
    title: "Vocal Arrangement & Production",
    image: "/images/service-vocal.jpg",
    icon: Mic2,
    summary:
      "Vocal direction, background vocal planning, and recording support for cleaner, more intentional performances.",
    deliverables: [
      "Background vocal arrangements",
      "Vocal recording and production",
      "Harmony and stacking direction",
      "Performance coaching inside the session",
    ],
  },
] as const;

export const workCategories = [
  {
    title: "Music",
    icon: Music2,
    image: "/images/production-session.jpg",
    status: "Curated releases and production notes are being prepared.",
    summary:
      "A focused home for released music, arrangements, instrumentals, and production credits.",
  },
  {
    title: "Poetry",
    icon: BookOpen,
    image: "/images/work-creative.png",
    status: "Selected written and spoken pieces will be published here.",
    summary:
      "Poetic sketches, spoken-word ideas, and reflective writing connected to the wider creative practice.",
  },
  {
    title: "Short Films",
    icon: Clapperboard,
    image: "/images/creation-hands.jpg",
    status: "Film concepts, scores, and visual work will be added as they are ready.",
    summary:
      "A preview space for visual storytelling, music-led film concepts, and behind-the-scenes process.",
  },
] as const;

export const team = [
  {
    name: "Tami Bedford",
    role: "Owner / Session Guide",
    image: "/images/tami-bedford.jpeg",
    bio: "Tami Bedford is a music producer, educator, and creative director with over a decade of experience in music performance, composition, theory, and creative production. MUSON certified in Music Theory and Piano Practical, he combines technical excellence with real-world artistry while mentoring musicians across Gospel, Contemporary, and Jazz.",
  },
  {
    name: "Joseph Agbai",
    role: "Session Guide",
    image: "/images/joseph-agbai.png",
    bio: "Joseph Agbai is a musician with over 10 years of experience. He has collaborated with artists and songwriters in Nigeria and abroad as a pianist, arranger, and producer, and actively mentors young musicians on industry standards and practical musicianship.",
  },
] as const;

export const proofPoints = [
  { value: "10+", label: "years of teaching and production experience" },
  { value: "3", label: "structured session paths for musicians" },
  { value: "4", label: "weekly sessions per month with materials" },
] as const;

export const values = [
  {
    title: "Structured growth",
    icon: Sparkles,
    text: "Each path moves from foundation to application so students always know what skill they are building next.",
  },
  {
    title: "Real music context",
    icon: Users,
    text: "Lessons focus on the way musicians actually play, accompany, arrange, record, and lead in live or studio settings.",
  },
  {
    title: "Creative standards",
    icon: Camera,
    text: "The wider studio practice keeps the learning connected to professional production, performance, and storytelling.",
  },
] as const;

export function getSession(slug: string) {
  return sessions.find((session) => session.slug === slug);
}
