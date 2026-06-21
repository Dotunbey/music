"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { navItems } from "@/lib/content";

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    const panel = menuRef.current;
    if (!panel) return;

    const links = panel.querySelectorAll<HTMLAnchorElement>("a");
    const first = links[0];
    const last = links[links.length - 1];

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        close();
        buttonRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    first?.focus();

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, close]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-cream/10 bg-ink/78 backdrop-blur-xl">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-5 md:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 text-cream"
          onClick={close}
        >
          <span className="grid h-10 w-10 place-items-center rounded-md border border-cream/20 bg-cream/8 font-display text-xl font-black">
            tb
          </span>
          <span className="hidden text-sm font-bold uppercase sm:inline">
            Tami Bedford
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-md px-4 py-3 text-sm font-bold uppercase transition ${
                isActive(pathname, item.href)
                  ? "bg-cream text-ink"
                  : "text-cream/82 hover:bg-cream/10 hover:text-cream"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          ref={buttonRef}
          type="button"
          className="grid h-11 w-11 place-items-center rounded-md border border-cream/20 text-cream transition hover:border-red-500 hover:text-white md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-navigation"
        >
          <span className="sr-only">Toggle navigation</span>
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      {open ? (
        <div
          ref={menuRef}
          id="mobile-navigation"
          className="mobile-menu-panel border-t border-cream/10 bg-ink px-5 pb-6 pt-3 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <nav className="grid gap-2" aria-label="Mobile main">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                style={{ animationDelay: `${index * 42}ms` }}
                className={`mobile-menu-link rounded-md px-4 py-4 text-base font-bold uppercase ${
                  isActive(pathname, item.href)
                    ? "bg-cream text-ink"
                    : "bg-cream/6 text-cream"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
