"use client";

import Image from "next/image";

interface CardArtworkProps {
  image: string;
  alt: string;
  wrapperClassName: string;
  imageClassName: string;
  loading?: "lazy" | "eager";
  sizes?: string;
  priority?: boolean;
  placeholderClassName?: string;
}

export default function CardArtwork({
  image,
  alt,
  wrapperClassName,
  imageClassName,
  loading,
  sizes = "(max-width: 640px) 90vw, (max-width: 980px) 45vw, 320px",
  priority = false,
  placeholderClassName = "text-[0.85rem] text-[var(--muted)]",
}: CardArtworkProps) {
  return (
    <div className={`${wrapperClassName} relative`}>
      {image ? (
        <Image
          src={image}
          alt={alt}
          fill
          sizes={sizes}
          className={imageClassName}
          loading={loading}
          priority={priority}
        />
      ) : (
        <div className={placeholderClassName}>Sin imagen</div>
      )}
    </div>
  );
}
