"use client";

import { useEffect, useState } from "react";
import { ArrowUpIcon } from "@heroicons/react/24/outline";

interface ScrollToTopProps {
  threshold?: number;
  bottom?: string;
  right?: string;
}

export default function ScrollToTop({
  threshold = 300,
  bottom = "bottom-8",
  right = "right-8",
}: ScrollToTopProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > threshold);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!show) return null;

  return (
    <button
      onClick={scrollToTop}
      className={`fixed ${bottom} ${right} z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent)] text-white shadow-lg transition hover:opacity-90`}
      aria-label="Volver al inicio"
    >
      <ArrowUpIcon className="h-6 w-6" />
    </button>
  );
}
