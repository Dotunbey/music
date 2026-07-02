"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const revealSelector = "[data-reveal]";
const parallaxSelector = "[data-parallax]";

export function MotionRuntime() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    root.classList.add("motion-ready");

    const revealElements = Array.from(
      document.querySelectorAll<HTMLElement>(revealSelector),
    );

    if (reduceMotion) {
      revealElements.forEach((element) => element.classList.add("is-visible"));
      return () => {
        root.classList.remove("motion-ready");
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );

    revealElements.forEach((element) => observer.observe(element));

    const parallaxElements = Array.from(
      document.querySelectorAll<HTMLElement>(parallaxSelector),
    );
    let ticking = false;

    function updateParallax() {
      const viewportHeight = window.innerHeight || 1;

      parallaxElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const strength = Number(element.dataset.parallax || 0.14);
        const progress =
          (viewportHeight - rect.top) / (viewportHeight + rect.height) - 0.5;
        const offset = Math.max(-1, Math.min(1, progress)) * strength * 70;

        element.style.setProperty("--parallax-y", `${offset.toFixed(2)}px`);
      });

      ticking = false;
    }

    function requestParallaxUpdate() {
      if (ticking) {
        return;
      }

      ticking = true;
      window.requestAnimationFrame(updateParallax);
    }

    updateParallax();
    window.addEventListener("scroll", requestParallaxUpdate, { passive: true });
    window.addEventListener("resize", requestParallaxUpdate);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", requestParallaxUpdate);
      window.removeEventListener("resize", requestParallaxUpdate);
      root.classList.remove("motion-ready");
    };
  }, [pathname]);

  return null;
}
