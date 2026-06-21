type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  body?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
};

export function SectionHeading({
  eyebrow,
  title,
  body,
  align = "left",
  tone = "light",
}: SectionHeadingProps) {
  const isCenter = align === "center";
  const titleColor = tone === "dark" ? "text-ink" : "text-cream";
  const bodyColor = tone === "dark" ? "text-ink/82" : "text-cream/82";
  const eyebrowColor = tone === "dark" ? "text-red-700" : "text-red-500";

  return (
    <div
      className={isCenter ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}
      data-reveal="heading"
    >
      {eyebrow ? (
        <p className={`mb-4 text-sm font-bold uppercase ${eyebrowColor}`}>
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={`font-display text-4xl font-black leading-none text-balance md:text-6xl ${titleColor}`}
      >
        {title}
      </h2>
      {body ? (
        <p
          className={`mt-5 text-base leading-8 md:text-lg ${bodyColor} ${
            isCenter ? "mx-auto max-w-2xl" : "max-w-2xl"
          }`}
        >
          {body}
        </p>
      ) : null}
    </div>
  );
}
