import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Camera,
  Clapperboard,
  Feather,
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

export type NavChild = { href: string; label: string };
export type NavItem = {
  href: string;
  label: string;
  children?: NavChild[];
};

// Per the owner brief, "Apply" is not a top-level item — applying happens
// under Sessions (you apply for a specific program). "Sessions" is a dropdown
// that reveals the programs and the Apply action, matching the owner's request:
// "when you click educational, you see everything under sessions."
export const navItems: NavItem[] = [
  { href: "/", label: "Home" },
  {
    href: "/sessions",
    label: "Sessions",
    children: [
      { href: "/sessions/piano", label: "Piano" },
      { href: "/sessions/choral", label: "Choral" },
      { href: "/sessions/organ", label: "Organ" },
      { href: "/sessions/production", label: "Music Production" },
      { href: "/apply", label: "Apply" },
    ],
  },
  { href: "/services", label: "Services" },
  {
    href: "/gallery",
    label: "Gallery",
    children: [
      { href: "/gallery#music", label: "Music" },
      { href: "/gallery#books", label: "Books" },
      { href: "/gallery#poetry", label: "Poetry" },
      { href: "/gallery#short-films", label: "Short Films" },
    ],
  },
  { href: "/about", label: "About" },
];

export type SessionSlug = "piano" | "choral" | "organ" | "production";

export type Session = {
  slug: SessionSlug;
  title: string;
  eyebrow: string;
  price: string;
  cadence: string;
  format: string;
  image: string;
  icon: LucideIcon;
  /** Currently running — used to feature only active sessions on the home page. */
  active: boolean;
  summary: string;
  outcomes: string[];
  materials: string;
  requirements: string[];
  whoFor: string[];
  faqs: { question: string; answer: string }[];
};

export const sessions: Session[] = [
  {
    slug: "piano",
    active: true,
    title: "Piano Sessions",
    eyebrow: "Technique, harmony, and expressive playing",
    price: "₦50,000",
    cadence: "per month",
    format: "4 weekly online sessions + full access to materials",
    image: "/images/piano-keys.jpg",
    icon: Piano,
    summary:
      "Build practical piano fluency for Gospel and Contemporary music through a structured path from fundamentals to confident accompaniment.",
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
    slug: "choral",
    active: true,
    title: "Choral Sessions",
    eyebrow: "Choir blend, parts, harmony, and vocal discipline",
    price: "₦50,000",
    cadence: "per month",
    format: "4 weekly online sessions + full access to materials",
    image: "/images/service-vocal.jpg",
    icon: Users,
    summary:
      "Develop practical choir musicianship through harmony, blend, part learning, and confident group vocal direction.",
    outcomes: [
      "Part learning for soprano, alto, tenor, and bass contexts",
      "Harmony awareness and cleaner vocal movement",
      "Blend, balance, diction, and ensemble discipline",
      "Choir rehearsal habits and leadership cues",
      "Practical Gospel and Contemporary choral application",
    ],
    materials:
      "Access to curated choral guides, ear-training prompts, harmony references, and practice direction.",
    requirements: [
      "A voice recorder or phone for practice review",
      "Stable internet access for online lessons",
      "A willingness to sing and review between sessions",
    ],
    whoFor: [
      "Choir singers who want stronger harmony and blend",
      "Worship teams that need cleaner parts",
      "Musicians who want better vocal leadership language",
    ],
    faqs: [
      {
        question: "Is this for solo singers or choirs?",
        answer: "Both can benefit, but the path focuses on the habits and musical language needed for ensemble singing.",
      },
      {
        question: "Do I need to read staff notation?",
        answer: "No. Reading can help, but the sessions build practical part learning and harmony awareness from your current level.",
      },
    ],
  },
  {
    slug: "organ",
    active: false,
    title: "Organ Sessions",
    eyebrow: "Flow, worship support, and musical leadership",
    price: "₦50,000",
    cadence: "per month",
    format: "4 weekly online sessions + full access to materials",
    image: "/images/organ-keys.jpg",
    icon: Music2,
    summary:
      "Develop organ-style control, harmonic movement, and worship accompaniment for real playing environments.",
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
    active: false,
    title: "Music Production Sessions",
    eyebrow: "DAW workflow, arrangement, recording, and mix foundations",
    price: "₦50,000",
    cadence: "per month",
    format: "4 weekly online sessions + full access to materials",
    image: "/images/production-session.jpg",
    icon: SlidersHorizontal,
    summary:
      "Move from rough ideas to organized sessions, confident recording, and release-ready production habits.",
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
    title: "Vocal Production",
    image: "/images/service-vocal.jpg",
    icon: Mic2,
    deliverables: [
      "Vocal recording",
      "Performance direction",
      "Editing and comping",
      "Session vocal polish",
    ],
  },
  {
    title: "Vocal Arrangement",
    image: "/images/creation-hands.jpg",
    icon: Users,
    deliverables: [
      "Background vocal arrangements",
      "Harmony stacks",
      "Choir-style parts",
      "Vocal movement maps",
    ],
  },
  {
    title: "Music Production",
    image: "/images/studio-production.png",
    icon: Headphones,
    deliverables: [
      "Songs and instrumentals",
      "Tracking and recording of keys",
      "Stems production",
      "Arrangement direction",
      "Production guidance",
    ],
  },
] as const;

export const servicePortfolio = [
  {
    title: "Recorded vocals",
    image: "/images/service-vocal.jpg",
    status: "Selected songs and credits will be linked here.",
  },
  {
    title: "Produced projects",
    image: "/images/studio-production.png",
    status: "Albums and artist projects are being curated.",
  },
  {
    title: "Arranged work",
    image: "/images/production-session.jpg",
    status: "Streaming links and project notes will be added.",
  },
] as const;

export type GalleryMediaType = "image" | "video" | "text";

export type GalleryItem = {
  title: string;
  type: GalleryMediaType;
  /** Image src, or the poster frame for a video. */
  image?: string;
  /** A hosted/local video file (e.g. /videos/clip.mp4) — plays inline. */
  src?: string;
  /** External link for a video with no file (Instagram / YouTube) — links out. */
  href?: string;
  /** Body copy for a text/poem piece. */
  excerpt?: string;
  /** Small caption, e.g. the source or year. */
  meta?: string;
};

export type GalleryPurchase = {
  /** Shown as the heading of the buy card (e.g. the book title). */
  title: string;
  /** Display price, e.g. "₦3,000". */
  price: string;
  /** Checkout link — paste the Selar product URL here. */
  href: string;
  /** Small reassurance line under the button. */
  note?: string;
};

export type GalleryCategory = {
  title: string;
  slug: string;
  icon: LucideIcon;
  blurb: string;
  /** Representative image for the home preview and section header. */
  cover: string;
  /** Optional "buy" call-to-action rendered under the category. */
  purchase?: GalleryPurchase;
  items: GalleryItem[];
};

// Gallery is a mix of media from several sources. Instagram supplies mostly
// video, so most items are videos (poster + link out) until real files land.
// Placeholder covers reuse existing studio imagery and should be swapped for
// Tami's own work.
export const galleryCategories: GalleryCategory[] = [
  {
    title: "Music",
    slug: "music",
    icon: Music2,
    blurb: "Releases, arrangements, and production.",
    cover: "/images/production-session.jpg",
    items: [
      {
        title: "Studio session",
        type: "video",
        image: "/images/production-session.jpg",
        href: contact.instagram,
        meta: "Instagram",
      },
      {
        title: "Produced record",
        type: "image",
        image: "/images/studio-production.png",
        meta: "Cover art",
      },
      {
        title: "Live take",
        type: "video",
        image: "/images/piano-keys.jpg",
        href: contact.instagram,
        meta: "Instagram",
      },
    ],
  },
  {
    title: "Books",
    slug: "books",
    icon: BookOpen,
    blurb: "Long-form writing in progress.",
    cover: "/images/work-creative.png",
    // TODO: paste the Selar product link into `href` and set the real title/price.
    purchase: {
      title: "The book",
      price: "₦3,000",
      href: "#",
      note: "Secure checkout on Selar · instant download",
    },
    items: [
      {
        title: "Untitled book",
        type: "image",
        image: "/images/work-creative.png",
        meta: "In progress",
      },
      {
        title: "From the manuscript",
        type: "text",
        excerpt:
          "An excerpt from the writing will live here — a few lines that set the tone of the work, room to breathe.",
        meta: "Excerpt",
      },
    ],
  },
  {
    title: "Poetry",
    slug: "poetry",
    icon: Feather,
    blurb: "Written and spoken pieces.",
    cover: "/images/creation-hands.jpg",
    // Real poetry files (public/poetry) — a mix of images and video reels from
    // the Instagram highlight, in chronological order. Videos play inline.
    items: [
      { title: "I", type: "image", image: "/poetry/tami.bedford_1607429774_highlight18176536909127087.jpg" },
      { title: "II", type: "image", image: "/poetry/tami.bedford_1626718384_highlight18176536909127087.jpg" },
      { title: "III", type: "image", image: "/poetry/tami.bedford_1654178711_highlight18176536909127087.webp" },
      { title: "IV", type: "image", image: "/poetry/tami.bedford_1654251719_highlight18176536909127087.webp" },
      { title: "V", type: "video", src: "/poetry/tami.bedford_1675445562_highlight18176536909127087.mp4" },
      { title: "VI", type: "video", src: "/poetry/tami.bedford_1728509318_highlight18176536909127087.mp4" },
      { title: "VII", type: "video", src: "/poetry/tami.bedford_1729767970_highlight18176536909127087.mp4" },
      { title: "VIII", type: "video", src: "/poetry/tami.bedford_1732633580_highlight18176536909127087.mp4" },
      { title: "IX", type: "video", src: "/poetry/tami.bedford_1753429449_highlight18176536909127087.mp4" },
      { title: "X", type: "video", src: "/poetry/tami.bedford_1757365425_highlight18176536909127087.mp4" },
    ],
  },
  {
    title: "Short Films",
    slug: "short-films",
    icon: Clapperboard,
    blurb: "Visual storytelling and film concepts.",
    cover: "/images/tami-bedford.jpeg",
    items: [
      {
        title: "Haunted by the Hunter",
        type: "video",
        image: "https://i.ytimg.com/vi/fx34GwTKtac/hqdefault.jpg",
        href: "https://youtu.be/fx34GwTKtac",
        meta: "YouTube",
      },
      {
        title: "The Mad and The Riddle",
        type: "video",
        image: "https://i.ytimg.com/vi/UrXOKEo2vi4/hqdefault.jpg",
        href: "https://youtu.be/UrXOKEo2vi4",
        meta: "YouTube",
      },
    ],
  },
];

export const team = [
  {
    name: "Tami Bedford",
    role: "Owner / Session Guide",
    image: "/images/tami-bedford.jpeg",
    bio: "A decade of performance, production, and mentoring across Gospel, Contemporary, and Jazz.",
    disciplines: ["Production", "Piano", "MUSON certified"],
  },
  {
    name: "Joseph Agbai",
    role: "Session Guide",
    image: "/images/joseph-agbai.png",
    bio: "Ten years arranging, producing, and playing with artists across Nigeria and abroad.",
    disciplines: ["Arrangement", "Piano", "Mentoring"],
  },
] as const;

export const proofPoints = [
  { value: "10+", label: "years of teaching and production experience" },
  { value: "4", label: "structured session paths for musicians" },
  { value: "4", label: "weekly sessions per month with materials" },
] as const;

export const values = [
  {
    title: "Structured growth",
    icon: Sparkles,
    text: "Every path moves from foundation to real application.",
  },
  {
    title: "Real music context",
    icon: Users,
    text: "Built on how musicians actually play, arrange, and record.",
  },
  {
    title: "Creative standards",
    icon: Camera,
    text: "Learning stays tied to professional production and performance.",
  },
] as const;

export function getSession(slug: string) {
  return sessions.find((session) => session.slug === slug);
}
