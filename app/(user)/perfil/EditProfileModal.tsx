"use client";

import { useState, useRef } from "react";
import { updatePerfil } from "./actions";
import { CameraIcon } from "@heroicons/react/24/outline";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: {
    name: string;
    bio: string | null;
    avatarUrl: string | null;
  };
  onSuccess: (data: { name: string; bio: string | null; avatarUrl: string | null }) => void;
}

export function EditProfileModal({ isOpen, onClose, initialData, onSuccess }: EditProfileModalProps) {
  const [name, setName] = useState(initialData.name);
  const [bio, setBio] = useState(initialData.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(initialData.avatarUrl || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Por favor selecciona una imagen");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("La imagen debe ser menor a 2MB");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setAvatarUrl(result);
        setIsUploading(false);
      };
      reader.onerror = () => {
        setError("Error al leer la imagen");
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setError("Error al procesar la imagen");
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    const result = await updatePerfil({
      name: name.trim(),
      bio: bio.trim() || undefined,
      avatarUrl: avatarUrl || undefined,
    });

    setIsSaving(false);

    if (result.success && result.user) {
      onSuccess({
        name: result.user.name,
        bio: result.user.bio,
        avatarUrl: result.user.avatarUrl,
      });
      onClose();
    } else {
      setError(result.error || "Error al guardar");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-[18px] border border-[var(--stroke)] bg-[var(--surface)] p-6 shadow-[var(--panel-shadow)]">
        <h2 className="mb-6 text-xl font-semibold text-[var(--ink)]">Editar perfil</h2>

        <div className="space-y-4">
          {/* Avatar */}
          <div className="flex justify-center">
            <div className="relative">
              <div
                onClick={handleAvatarClick}
                className="flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[var(--surface-strong)] ring-2 ring-[var(--stroke)] hover:ring-[var(--accent)]"
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[var(--accent)] text-[2rem] font-bold text-white">
                    {name.charAt(0).toUpperCase()}
                  </div>
                )}
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  </div>
                )}
              </div>
              <div className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[var(--accent)] text-white shadow-lg hover:opacity-90">
                <CameraIcon className="h-4 w-4" />
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          <div>
            <label htmlFor="name" className="mb-2 block text-sm text-[var(--muted)]">
              Nombre
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-[12px] border border-[var(--stroke)] bg-[var(--surface-strong)] px-4 py-3 text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              placeholder="Tu nombre"
            />
          </div>

          <div>
            <label htmlFor="bio" className="mb-2 block text-sm text-[var(--muted)]">
              Biografía
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full rounded-[12px] border border-[var(--stroke)] bg-[var(--surface-strong)] px-4 py-3 text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-none"
              placeholder="Cuéntanos algo sobre ti..."
              maxLength={500}
            />
            <p className="mt-1 text-xs text-[var(--muted)]">{bio.length}/500</p>
          </div>

          {error && (
            <p className="text-sm text-[var(--alert-ink)]">{error}</p>
          )}
        </div>

        <div className="mt-6 flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="rounded-full border border-[var(--stroke)] px-6 py-2 text-sm font-medium text-[var(--ink)] transition hover:border-[var(--stroke-strong)] disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !name.trim()}
            className="rounded-full bg-[var(--accent)] px-6 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {isSaving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}
