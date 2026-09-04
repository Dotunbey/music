import type { Metadata } from "next";
import { Fraunces, Manrope, Dancing_Script, Great_Vibes } from "next/font/google";
import "./globals.css";

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
  metadataBase: new URL("https://tamibedford.com"),
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
    images: [{ url: "/images/tami-bedford.jpeg", width: 800, height: 800 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tami Bedford | Premium Music Sessions & Creative Studio",
    description:
      "Premium piano, choral, organ, and music production sessions plus creative studio services and gallery work from Tami Bedford.",
    images: ["/images/tami-bedford.jpeg"],
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
  "@type": "Organization",
  name: "Tami Bedford",
  url: "https://tamibedford.com",
  logo: "https://tamibedford.com/images/tami-bedford.jpeg",
  description:
    "Premium music sessions and creative production studio for musicians who want structure, clarity, and standards.",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+2348156154708",
    contactType: "customer service",
    email: "support@tamibedford.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${fraunces.variable} ${manrope.variable} ${script.variable} ${art.variable}`}
    >
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
