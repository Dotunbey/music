import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { interactiveStateClasses } from "@/lib/ui";

type ActionLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

const variants = {
  primary: "bg-red-600 text-white hover:bg-red-500",
  secondary: "border border-cream/30 bg-white/70 text-cream hover:bg-white/90",
  ghost:
    "border border-cream/25 text-cream hover:border-red-500 hover:text-red-700",
};

export function ActionLink({
  href,
  children,
  variant = "primary",
  className = "",
}: ActionLinkProps) {
  return (
    <Link
      href={href}
      prefetch={true}
      className={`motion-sheen inline-flex min-h-12 items-center justify-center gap-2 overflow-hidden rounded-md px-5 py-3 text-sm font-bold uppercase ${interactiveStateClasses} ${variants[variant]} ${className}`}
    >
      <span>{children}</span>
      <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
    </Link>
  );
}
