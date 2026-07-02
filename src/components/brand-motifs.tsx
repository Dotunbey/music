import { ChevronDown } from "lucide-react";

const eqBarHeights = [38, 72, 52, 96, 64, 84, 44, 100, 58, 76, 36, 90];

type EqualizerProps = {
  className?: string;
  barClassName?: string;
};

export function Equalizer({
  className = "",
  barClassName = "bg-red-500",
}: EqualizerProps) {
  return (
    <div
      aria-hidden="true"
      className={`flex h-8 items-end gap-[3px] ${className}`}
    >
      {eqBarHeights.map((height, index) => (
        <span
          key={index}
          className={`eq-bar w-[3px] rounded-full ${barClassName}`}
          style={{
            height: `${height}%`,
            animationDelay: `${index * 90}ms`,
            animationDuration: `${900 + (index % 5) * 140}ms`,
          }}
        />
      ))}
    </div>
  );
}

type MarqueeProps = {
  items: readonly string[];
  className?: string;
};

export function Marquee({ items, className = "" }: MarqueeProps) {
  const row = (hidden: boolean) => (
    <div
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center"
    >
      {items.map((item) => (
        <span key={item} className="flex items-center">
          <span className="px-6 font-display text-2xl font-black uppercase tracking-wide md:px-10 md:text-3xl">
            {item}
          </span>
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-red-600" />
        </span>
      ))}
    </div>
  );

  return (
    <div className={`marquee overflow-hidden ${className}`}>
      <div className="marquee-track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

export function ScrollCue({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`flex flex-col items-center gap-1 text-cream/60 ${className}`}
    >
      <span className="text-[11px] font-bold uppercase tracking-[0.2em]">
        Scroll
      </span>
      <ChevronDown className="scroll-cue h-5 w-5" />
    </div>
  );
}

type GhostWordProps = {
  word: string;
  className?: string;
  tone?: "light" | "dark";
};

export function GhostWord({ word, className = "", tone = "light" }: GhostWordProps) {
  return (
    <span
      aria-hidden="true"
      className={`ghost-word ${tone === "dark" ? "ghost-word--dark" : ""} ${className}`}
    >
      {word}
    </span>
  );
}
