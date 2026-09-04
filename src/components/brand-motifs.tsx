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

export function Flourish({ className = "" }: { className?: string }) {
  // Ornate, symmetric filigree — one half is drawn, then mirrored about x=110.
  const arm = (
    <>
      <path d="M110 22 C 127 22 137 9 155 13 C 171 16.5 171 31 154 28 C 143 26 147 17 157 20" />
      <path d="M155 13 C 175 8 197 13 207 23 C 211 28 206 33 200 30 C 195 27.5 199 21 205 22" />
      <path d="M124 24 C 131 30 141 30 146 25 C 139 23 130 22 124 24" />
    </>
  );
  const leaf = <path d="M121 18 C 127 10 136 10 139 16 C 132 19 124 20 121 18 Z" />;
  return (
    <svg
      viewBox="0 0 220 44"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <g
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {arm}
        <g transform="matrix(-1 0 0 1 220 0)">{arm}</g>
      </g>
      <g fill="currentColor" stroke="none">
        <path d="M110 9 C 114 15 114 29 110 35 C 106 29 106 15 110 9 Z" />
        {leaf}
        <g transform="matrix(-1 0 0 1 220 0)">{leaf}</g>
        <circle cx="110" cy="4" r="1.7" />
      </g>
    </svg>
  );
}

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
