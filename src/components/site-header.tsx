"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { navItems } from "@/lib/content";
import { interactiveStateClasses } from "@/lib/ui";

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();

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

  const linkClasses = `nav-glass rounded-full px-4 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-cream/75 hover:backdrop-blur-md hover:backdrop-saturate-150 focus-visible:backdrop-blur-md data-[active=true]:backdrop-blur-md data-[active=true]:backdrop-saturate-150 ${interactiveStateClasses}`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b ${
        isHome
          ? "border-transparent bg-transparent"
          : "border-cream/10 bg-ink/78 backdrop-blur-xl"
      }`}
    >
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-5 md:px-8">
        <Link
          href="/"
          className={`flex items-center gap-3 rounded-md text-cream ${interactiveStateClasses}`}
          onClick={close}
        >
          <span className="font-script text-4xl leading-none text-cream">tb</span>
          <span className="hidden text-sm font-medium uppercase tracking-[0.18em] sm:inline">
            Tami Bedford
          </span>
        </Link>

        <nav
          className={`hidden items-center gap-1 md:absolute md:left-1/2 md:flex md:-translate-x-1/2 ${
            isHome ? "" : "relative"
          }`}
          aria-label="Main"
        >
          {navItems.map((item) =>
            item.children ? (
              <div key={item.href} className="group relative">
                <Link
                  href={item.href}
                  data-active={isActive(pathname, item.href) ? "true" : "false"}
                  className={`inline-flex items-center gap-1.5 ${linkClasses}`}
                >
                  {item.label}
                  <ChevronDown
                    aria-hidden="true"
                    className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180 group-focus-within:rotate-180"
                  />
                </Link>
                <div className="pointer-events-none absolute left-1/2 top-full -translate-x-1/2 translate-y-1 pt-3 opacity-0 transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100">
                  <div className="min-w-[210px] overflow-hidden rounded-md border border-cream/12 bg-ink/95 p-2 shadow-soft backdrop-blur-xl">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`block rounded-md px-4 py-2.5 text-xs font-medium uppercase tracking-[0.16em] ${interactiveStateClasses} ${
                          isActive(pathname, child.href)
                            ? "bg-cream/10 text-cream"
                            : "text-cream/65 hover:bg-cream/8 hover:text-cream"
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                data-active={isActive(pathname, item.href) ? "true" : "false"}
                className={linkClasses}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <button
          ref={buttonRef}
          type="button"
          className={`grid h-11 w-11 place-items-center rounded-md border border-cream/20 text-cream hover:border-red-500 hover:text-white md:hidden ${interactiveStateClasses}`}
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-navigation"
        >
          <span className="sr-only">Toggle navigation</span>
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {open ? (
          <motion.div
            ref={menuRef}
            id="mobile-navigation"
            className="max-h-[calc(100svh-5rem)] overflow-y-auto overscroll-contain border-t border-cream/10 bg-ink px-5 pb-6 pt-3 md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={reduceMotion ? false : { opacity: 0, y: -8, scaleY: 0.97 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8, scaleY: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <nav className="grid py-4 text-center" aria-label="Mobile main">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  className="border-b border-cream/10 last:border-b-0"
                  initial={reduceMotion ? false : { opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.24,
                    delay: reduceMotion ? 0 : index * 0.04,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <Link
                    href={item.href}
                    onClick={close}
                    className={`block py-4 font-display text-2xl font-medium uppercase tracking-[0.14em] ${interactiveStateClasses} ${
                      isActive(pathname, item.href)
                        ? "text-cream"
                        : "text-cream/80 hover:text-cream"
                    }`}
                  >
                    {item.label}
                  </Link>
                  {item.children ? (
                    <div className="grid gap-1 pb-4">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={close}
                          className={`block py-1.5 text-xs font-medium uppercase tracking-[0.24em] ${interactiveStateClasses} ${
                            isActive(pathname, child.href)
                              ? "text-brass"
                              : "text-cream/50 hover:text-cream/85"
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </motion.div>
              ))}
              <div className="mx-auto mt-8 max-w-xs">
                <p className="font-script text-2xl leading-tight text-cream/75">
                  &ldquo;&hellip;Turn these dreams into prophesies.&rdquo;
                </p>
                <p className="font-script mt-1 text-lg text-cream/50">
                  &mdash; Tami Bedford
                </p>
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
