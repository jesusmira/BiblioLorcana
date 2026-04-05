"use client";

import { useEffect, useRef, useState } from "react";

interface UseHeaderScrollOptions {
  isMenuOpen: boolean;
}

export function useHeaderScroll({ isMenuOpen }: UseHeaderScrollOptions) {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollRef = useRef(0);
  const tickingRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    lastScrollRef.current = window.scrollY;

    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      window.requestAnimationFrame(() => {
        const current = window.scrollY;
        const last = lastScrollRef.current;
        const delta = current - last;

        if (isMenuOpen) {
          setIsVisible(true);
          lastScrollRef.current = current;
          tickingRef.current = false;
          return;
        }

        if (current > 80 && delta > 8) {
          setIsVisible(false);
        } else if (delta < -8) {
          setIsVisible(true);
        }

        lastScrollRef.current = current;
        tickingRef.current = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMenuOpen]);

  return { isVisible };
}
