"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { CameraIcon } from "@heroicons/react/24/outline";

interface ImageUploadButtonProps {
  className?: string;
}

export default function ImageUploadButton({ className = "" }: ImageUploadButtonProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(",")[1];
        router.push(`/buscar-imagen?image=${encodeURIComponent(base64)}`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        type="button"
        onClick={handleClick}
        className={`flex h-[52px] w-[52px] items-center justify-center rounded-[12px] border border-[var(--stroke)] bg-[var(--surface-strong)] text-[var(--muted)] transition hover:border-[var(--stroke-strong)] hover:text-[var(--ink)] ${className}`}
        aria-label="Buscar por imagen"
      >
        <CameraIcon className="h-5 w-5" />
      </button>
    </>
  );
}