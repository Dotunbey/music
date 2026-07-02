"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

type MotionRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  amount?: number;
};

const fluidEase = [0.16, 1, 0.3, 1] as const;

export function MotionReveal({
  children,
  className = "",
  delay = 0,
  amount = 0.22,
}: MotionRevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 22, scale: 0.985 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.58, delay, ease: fluidEase }}
    >
      {children}
    </motion.div>
  );
}

type MotionImageFrameProps = {
  children: ReactNode;
  className?: string;
  mediaClassName?: string;
  parallax?: number;
};

export function MotionImageFrame({
  children,
  className = "",
  mediaClassName = "",
  parallax = 22,
}: MotionImageFrameProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [0, 0] : [-parallax, parallax],
  );

  return (
    <motion.div
      ref={ref}
      className={`overflow-hidden ${className}`}
    >
      <motion.div
        className={`absolute inset-0 scale-[1.05] ${mediaClassName}`}
        style={{ y }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

type MotionHeadlineProps = {
  text: string;
  className?: string;
  delay?: number;
};

export function MotionHeadline({
  text,
  className = "",
  delay = 0,
}: MotionHeadlineProps) {
  const reduceMotion = useReducedMotion();
  const words = text.split(" ");

  if (reduceMotion) {
    return <h1 className={className}>{text}</h1>;
  }

  return (
    <h1 className={className} aria-label={text}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} aria-hidden="true">
          <span className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em] align-bottom">
            <motion.span
              className="inline-block"
              initial={{ y: "112%", rotate: 4, opacity: 0 }}
              animate={{ y: 0, rotate: 0, opacity: 1 }}
              transition={{
                duration: 0.72,
                delay: delay + index * 0.09,
                ease: fluidEase,
              }}
            >
              {word}
            </motion.span>
          </span>
          {index < words.length - 1 ? " " : null}
        </span>
      ))}
    </h1>
  );
}

type CountUpProps = {
  value: string;
  className?: string;
  duration?: number;
};

export function CountUp({ value, className = "", duration = 1.4 }: CountUpProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const match = value.match(/^(\d+)(.*)$/);
  const target = match ? Number(match[1]) : 0;
  const suffix = match ? match[2] : "";
  const [display, setDisplay] = useState(reduceMotion || !match ? value : `0${suffix}`);

  useEffect(() => {
    if (!inView || reduceMotion || !match) {
      return;
    }

    const controls = animate(0, target, {
      duration,
      ease: fluidEase,
      onUpdate: (latest) => setDisplay(`${Math.round(latest)}${suffix}`),
    });

    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduceMotion, target, suffix, duration]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}

type AnimatedErrorProps = {
  message?: string;
  id?: string;
};

export function AnimatedError({ message, id }: AnimatedErrorProps) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      {message ? (
        <motion.p
          key={message}
          id={id}
          role="alert"
          aria-live="polite"
          className="overflow-hidden text-sm text-red-300"
          initial={{ height: 0, opacity: 0, y: -4 }}
          animate={{ height: "auto", opacity: 1, y: 0 }}
          exit={{ height: 0, opacity: 0, y: -4 }}
          transition={{ duration: 0.22, ease: fluidEase }}
        >
          {message}
        </motion.p>
      ) : null}
    </AnimatePresence>
  );
}

type AnimatedTurnstileSlotProps = {
  children: ReactNode;
};

export function AnimatedTurnstileSlot({ children }: AnimatedTurnstileSlotProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: fluidEase }}
    >
      {children}
    </motion.div>
  );
}
