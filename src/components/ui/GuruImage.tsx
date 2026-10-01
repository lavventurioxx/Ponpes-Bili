"use client";

import { useState } from "react";

type GuruImageProps = {
  src: string;
  fallback: string;
  alt: string;
  className: string;
};

export default function GuruImage({ src, fallback, alt, className }: GuruImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [fallbackTried, setFallbackTried] = useState(false);
  const initials = alt
    .replace(/^(Ustz?|K\.H\.|Mas)\s+/i, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((name) => name[0])
    .join('')
    .toUpperCase();

  if (fallbackTried && imageSrc === fallback) {
    return (
      <div className={`${className} flex items-center justify-center bg-emerald-100 text-4xl font-bold text-emerald-700`} role="img" aria-label={alt}>
        {initials || '?'}
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      onError={() => {
        setImageSrc(fallback);
        setFallbackTried(true);
      }}
      className={className}
    />
  );
}
