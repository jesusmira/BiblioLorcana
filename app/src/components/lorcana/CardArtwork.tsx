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
  const isValidUrl = (url: string): boolean => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === "https:" && parsed.hostname.length > 0;
    } catch {
      return false;
    }
  };

  const getHostname = (url: string): string => {
    try {
      return new URL(url).hostname.toLowerCase();
    } catch {
      return "";
    }
  };

  const allowedHosts = [
    "lorcast.com",
    "lorcast.io",
    "cards.lorcast.io",
    "api.lorcast.com",
    "wiki.mushureport.com",
    "cardtrader.com",
  ];

  const hostname = getHostname(image);
  const isAllowed = allowedHosts.some(
    (host) => hostname === host || hostname.endsWith(`.${host}`),
  );

  if (!isValidUrl(image) || !isAllowed) {
    return (
      <div
        className={`${wrapperClassName} relative flex items-center justify-center bg-[var(--surface-soft)]`}
      >
        <img src={image} alt={alt} className={imageClassName} />
      </div>
    );
  }

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
