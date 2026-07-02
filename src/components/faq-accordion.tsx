"use client";

import { useId, useState } from "react";
import { Plus } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { interactiveStateClasses } from "@/lib/ui";

const fluidEase = [0.16, 1, 0.3, 1] as const;

type FaqAccordionProps = {
  items: readonly { question: string; answer: string }[];
};

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const reduceMotion = useReducedMotion();
  const baseId = useId();

  return (
    <div className="grid gap-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `${baseId}-faq-panel-${index}`;
        const buttonId = `${baseId}-faq-button-${index}`;

        return (
          <article
            key={item.question}
            className="overflow-hidden rounded-lg border border-cream/12 bg-cream/[0.04]"
            data-reveal="card"
          >
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className={`flex w-full items-center justify-between gap-4 p-5 text-left md:p-6 ${interactiveStateClasses}`}
              >
                <span className="font-display text-xl font-black text-cream md:text-2xl">
                  {item.question}
                </span>
                <motion.span
                  aria-hidden="true"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-cream/18 text-brass"
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.3, ease: fluidEase }}
                >
                  <Plus className="h-4 w-4" />
                </motion.span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  key="panel"
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.34, ease: fluidEase }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 leading-7 text-cream/82 md:px-6 md:pb-6">
                    {item.answer}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </article>
        );
      })}
    </div>
  );
}
