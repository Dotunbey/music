"use client";

import Link from "next/link";
import Image from "next/image";
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
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();

  const close = useCallback(() => {
    setOpen(false);
    setExpandedMenu(null);
  }, []);

  useEffect(() => {
    function dismissOutside(event: PointerEvent) {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) {
        setExpandedMenu(null);
      }
    }
    document.addEventListener("pointerdown", dismissOutside);
    return () => document.removeEventListener("pointerdown", dismissOutside);
  }, []);

  useEffect(() => {
    if (!open) return;

    const panel = menuRef.current;
    if (!panel) return;

    const links = panel.querySelectorAll<HTMLAnchorElement | HTMLButtonElement>("a, button");
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

  const linkClasses = `nav-glass rounded-full px-4 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-cream/75 backdrop-blur-md backdrop-saturate-150 ${interactiveStateClasses}`;

  return (
    <header
      ref={headerRef}
      onKeyDown={(event) => {
        if (event.key === "Escape" && expandedMenu) {
          const toggle = headerRef.current?.querySelector<HTMLButtonElement>('button[data-dropdown-toggle][aria-expanded="true"]');
          setExpandedMenu(null);
          toggle?.focus();
        }
      }}
      className="fixed inset-x-0 top-0 z-50 border-b border-cream/8 bg-white/72 shadow-[0_1px_20px_rgba(24,24,20,0.04)] backdrop-blur-xl backdrop-saturate-150"
    >
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-5 md:px-8">
        <Link prefetch={true}
          href="/"
          className={`flex items-center gap-3 rounded-md text-cream ${interactiveStateClasses}`}
          onClick={close}
        >
          <Image
            src="/images/tami-bedford-logo.png"
            alt="Tami Bedford"
            width={64}
            height={64}
            priority
            className="h-14 w-14 object-contain brightness-0"
          />
        </Link>

        <nav
          className={`hidden items-center gap-1 md:absolute md:left-1/2 md:flex md:-translate-x-1/2 ${
            isHome ? "" : "relative"
          }`}
          aria-label="Main"
        >
          {navItems.map((item) =>
            item.children ? (
              <div key={item.href} className="relative"
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) setExpandedMenu(null);
                }}
              >
                <div
                  data-active={isActive(pathname, item.href) ? "true" : "false"}
                  className="nav-glass flex items-center rounded-full text-cream/75 backdrop-blur-md backdrop-saturate-150"
                >
                <Link prefetch={true}
                  href={item.href}
                  data-active={isActive(pathname, item.href) ? "true" : "false"}
                  className={`inline-flex min-h-11 items-center rounded-l-full py-2.5 pl-4 pr-1 text-xs font-medium uppercase tracking-[0.18em] ${interactiveStateClasses}`}
                  onClick={close}
                >
                  {item.label}
                </Link>
                <button
                  type="button"
                  data-dropdown-toggle
                  aria-label={`Toggle ${item.label} submenu`}
                  aria-expanded={expandedMenu === item.href}
                  aria-controls={`desktop-submenu-${item.href.slice(1)}`}
                  onClick={() => setExpandedMenu((current) => current === item.href ? null : item.href)}
                  className={`grid h-11 w-9 place-items-center rounded-r-full ${interactiveStateClasses}`}
                >
                  <ChevronDown
                    aria-hidden="true"
                    className={`h-3.5 w-3.5 transition-transform duration-300 ${expandedMenu === item.href ? "rotate-180" : ""}`}
                  />
                </button>
                </div>
                <div id={`desktop-submenu-${item.href.slice(1)}`} hidden={expandedMenu !== item.href} className="absolute left-1/2 top-full -translate-x-1/2 pt-3">
                  <div className="min-w-[210px] overflow-hidden rounded-md border border-cream/12 bg-ink/95 p-2 shadow-soft backdrop-blur-xl">
                    {item.children.map((child) => (
                      <Link prefetch={true}
                        key={child.href}
                        href={child.href}
                        onClick={close}
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
              <Link prefetch={true}
                key={item.href}
                href={item.href}
                data-active={isActive(pathname, item.href) ? "true" : "false"}
                className={linkClasses}
                onClick={close}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <button
          ref={buttonRef}
          type="button"
          className={`grid h-11 w-11 place-items-center rounded-md border border-cream/20 text-cream hover:border-red-500 hover:text-red-700 md:hidden ${interactiveStateClasses}`}
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
                  <div className="mx-auto flex w-fit items-center justify-center rounded-full">
                  <Link prefetch={true}
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
                    <button
                      type="button"
                      data-dropdown-toggle
                      aria-label={`Toggle ${item.label} submenu`}
                      aria-expanded={expandedMenu === item.href}
                      aria-controls={`mobile-submenu-${item.href.slice(1)}`}
                      onClick={() => setExpandedMenu((current) => current === item.href ? null : item.href)}
                      className={`grid h-11 w-9 place-items-center rounded-r-full ${interactiveStateClasses}`}
                    >
                      <ChevronDown aria-hidden="true" className={`h-4 w-4 transition-transform ${expandedMenu === item.href ? "rotate-180" : ""}`} />
                    </button>
                  ) : null}
                  </div>
                  {item.children ? (
                    <div id={`mobile-submenu-${item.href.slice(1)}`} hidden={expandedMenu !== item.href}>
                    <div className="grid gap-1 pb-4">
                      {item.children.map((child) => (
                        <Link prefetch={true}
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
