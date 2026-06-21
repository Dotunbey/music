"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageOff } from "lucide-react";

type SafeImageProps = {
  src: string;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  sizes?: string;
  "data-parallax"?: string;
};

export function SafeImage({
  src,
  alt,
  fill,
  priority,
  className,
  sizes,
  ...rest
}: SafeImageProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="flex items-center justify-center bg-ink/20 text-cream/40">
        <ImageOff aria-hidden="true" className="h-8 w-8" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      priority={priority}
      className={className}
      sizes={sizes}
      onError={() => setError(true)}
      {...rest}
    />
  );
}
