"use client";

import { useState } from "react";
import { ShareIcon, CheckIcon } from "@heroicons/react/24/outline";

interface ShareButtonProps {
  url: string;
  title: string;
  description?: string;
  className?: string;
}

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const LinkIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
    />
  </svg>
);

export default function ShareButton({
  url,
  title,
  description = "",
  className = "",
}: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const getAbsoluteUrl = () => {
    if (url.startsWith("http")) return url;
    if (typeof window !== "undefined") return `${window.location.origin}${url}`;
    return url;
  };

  const handleTwitter = () => {
    const text = encodeURIComponent(`${title}\n${getAbsoluteUrl()}`);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}`,
      "_blank",
      "noopener,noreferrer,width=600,height=400"
    );
    setOpen(false);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `${title}${description ? `\n${description}` : ""}\n${getAbsoluteUrl()}`
    );
    window.open(
      `https://wa.me/?text=${text}`,
      "_blank",
      "noopener,noreferrer"
    );
    setOpen(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getAbsoluteUrl());
      setCopied(true);
      setOpen(false);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback para navegadores sin clipboard API
      const el = document.createElement("input");
      el.value = getAbsoluteUrl();
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setOpen(false);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const itemClass =
    "flex w-full items-center gap-3 rounded-[8px] px-3 py-2 text-sm text-[var(--ink)] transition hover:bg-[var(--surface-strong)] hover:text-[var(--accent)]";

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-full border border-[var(--stroke)] bg-[var(--surface-strong)] px-3 py-1.5 text-[0.8rem] text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
        aria-label="Compartir"
      >
        {copied ? (
          <CheckIcon className="h-3.5 w-3.5 text-green-500" />
        ) : (
          <ShareIcon className="h-3.5 w-3.5" />
        )}
        <span>{copied ? "¡Copiado!" : "Compartir"}</span>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 top-full z-20 mt-2 w-44 rounded-[12px] border border-[var(--stroke)] bg-[var(--surface)] p-1 shadow-[var(--panel-shadow)]">
            <button onClick={handleTwitter} className={itemClass}>
              <XIcon />
              Twitter / X
            </button>
            <button onClick={handleWhatsApp} className={itemClass}>
              <WhatsAppIcon />
              WhatsApp
            </button>
            <div className="my-1 h-px bg-[var(--stroke)]" />
            <button onClick={handleCopy} className={itemClass}>
              <LinkIcon />
              Copiar enlace
            </button>
          </div>
        </>
      )}
    </div>
  );
}
