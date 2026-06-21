import type { Metadata } from "next";
import { MotionRuntime } from "@/components/motion-runtime";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://tamibedford.com"),
  title: {
    default: "Tami Bedford | Premium Music Sessions & Creative Studio",
    template: "%s | Tami Bedford",
  },
  description:
    "Premium piano, organ, and music production sessions plus creative studio services from Tami Bedford.",
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: "Tami Bedford",
    title: "Tami Bedford | Premium Music Sessions & Creative Studio",
    description:
      "Premium piano, organ, and music production sessions plus creative studio services from Tami Bedford.",
    images: [{ url: "/images/tami-bedford.jpeg", width: 800, height: 800 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tami Bedford | Premium Music Sessions & Creative Studio",
    description:
      "Premium piano, organ, and music production sessions plus creative studio services from Tami Bedford.",
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
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <MotionRuntime />
        <SiteHeader />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-red-600 focus:px-4 focus:py-3 focus:text-sm focus:font-bold focus:uppercase focus:text-white focus:outline-none"
        >
          Skip to content
        </a>
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
