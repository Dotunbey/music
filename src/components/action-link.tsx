import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

type ActionLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

const variants = {
  primary:
    "bg-red-600 text-white hover:bg-red-500 focus-visible:outline-red-300",
  secondary:
    "border border-cream/30 bg-cream text-ink hover:bg-white focus-visible:outline-cream",
  ghost:
    "border border-cream/25 text-cream hover:border-red-500 hover:text-white focus-visible:outline-red-300",
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
      className={`motion-sheen inline-flex min-h-12 items-center justify-center gap-2 overflow-hidden rounded-md px-5 py-3 text-sm font-bold uppercase transition ${variants[variant]} ${className}`}
    >
      <span>{children}</span>
      <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
    </Link>
  );
}
