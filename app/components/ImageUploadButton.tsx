"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { CameraIcon } from "@heroicons/react/24/outline";
import imageCompression from "browser-image-compression";

const IMAGE_STORAGE_KEY = "ocr_image_data";

interface ImageUploadButtonProps {
  className?: string;
}

function convertToJpeg(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL("image/jpeg", 0.85));
        } else {
          reject(new Error("No se pudo crear el contexto"));
        }
      };
      img.onerror = () => reject(new Error("Error al cargar la imagen"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Error al leer el archivo"));
    reader.readAsDataURL(file);
  });
}

async function compressImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1500,
    useWebWorker: true,
    fileType: "image/jpeg",
    initialQuality: 0.9,
  };
  return imageCompression(file, options);
}

export default function ImageUploadButton({ className = "" }: ImageUploadButtonProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const compressedFile = await compressImage(file);
        const jpegData = await convertToJpeg(compressedFile);
        localStorage.setItem(IMAGE_STORAGE_KEY, jpegData);
        router.push("/buscar-imagen");
      } catch (error) {
        console.error("Error al procesar imagen:", error);
        alert("Error al procesar la imagen");
      }
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
        capture="environment"
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
