import { MotionRuntime } from "@/components/motion-runtime";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { interactiveStateClasses } from "@/lib/ui";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <MotionRuntime />
      <SiteHeader />
      <a
        href="#main-content"
        className={`sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-red-600 focus:px-4 focus:py-3 focus:text-sm focus:font-bold focus:uppercase focus:text-white focus:outline-none ${interactiveStateClasses}`}
      >
        Skip to content
      </a>
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
