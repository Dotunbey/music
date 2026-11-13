import type { Metadata } from "next";
import { Fraunces, Manrope, Dancing_Script, Great_Vibes } from "next/font/google";
import "./globals.css";
import { absoluteUrl, getSiteUrl } from "@/lib/site-url";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-body",
  display: "swap",
});

const script = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-script",
  display: "swap",
});

const art = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-art",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  alternates: { canonical: "/" },
  title: {
    default: "Tami Bedford | Premium Music Sessions & Creative Studio",
    template: "%s | Tami Bedford",
  },
  description:
    "Premium piano, choral, organ, and music production sessions plus creative studio services and gallery work from Tami Bedford.",
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: "Tami Bedford",
    title: "Tami Bedford | Premium Music Sessions & Creative Studio",
    description:
      "Premium piano, choral, organ, and music production sessions plus creative studio services and gallery work from Tami Bedford.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Tami Bedford" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tami Bedford | Premium Music Sessions & Creative Studio",
    description:
      "Premium piano, choral, organ, and music production sessions plus creative studio services and gallery work from Tami Bedford.",
    images: ["/opengraph-image"],
  },
  robots: process.env.NODE_ENV === "production"
    ? { index: true, follow: true }
    : { index: false, follow: false },
  icons: {
    icon: "/favicon.ico",
    apple: [{ url: "/images/tami-bedford.jpeg", sizes: "180x180", type: "image/jpeg" }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Person", "@id": `${getSiteUrl()}/#tami`, name: "Tami Bedford", url: getSiteUrl(), image: absoluteUrl("/images/tami-bedford.jpeg"), jobTitle: "Musician, producer and tutor", sameAs: ["https://www.instagram.com/tami.bedford", "https://youtube.com/@tamibedford"] },
    { "@type": ["Organization", "EducationalOrganization"], "@id": `${getSiteUrl()}/#organization`, name: "Tami Bedford Sessions", url: getSiteUrl(), founder: { "@id": `${getSiteUrl()}/#tami` }, contactPoint: { "@type": "ContactPoint", telephone: "+2348156154708", contactType: "customer service", email: "support@tamibedford.com" } },
    { "@type": "Service", name: "Music production and vocal services", provider: { "@id": `${getSiteUrl()}/#organization` }, url: absoluteUrl("/services") },
    ...["piano", "choral", "organ", "production"].map((slug) => ({ "@type": "Course", name: `${slug[0].toUpperCase()}${slug.slice(1)} Sessions`, provider: { "@id": `${getSiteUrl()}/#organization` }, url: absoluteUrl(`/sessions/${slug}`) })),
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`h-full antialiased ${fraunces.variable} ${manrope.variable} ${script.variable} ${art.variable}`}
    >
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        {children}
      </body>
    </html>
  );
}
