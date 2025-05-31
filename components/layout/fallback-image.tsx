"use client";

import Image from "next/image";

export function FallbackImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.src =
          "https://marketplace.canva.com/EAGLvNcMY10/1/0/1600w/canva-white-and-blue-illustrative-class-logo-mjY8ushmYT4.jpg";
      }}
      fill
      className={className}
    />
  );
}
