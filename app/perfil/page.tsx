"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../lib/auth";
import Link from "next/link";
import { EditProfileModal } from "./EditProfileModal";

interface PerfilData {
  name: string;
  email: string;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: string;
}

export default function PerfilPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [perfilData, setPerfilData] = useState<PerfilData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    async function fetchPerfil() {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setPerfilData({
            name: data.user?.name || user.name,
            email: data.user?.email || user.email,
            bio: data.user?.bio || null,
            avatarUrl: data.user?.avatarUrl || null,
            createdAt: data.user?.createdAt || new Date().toISOString(),
          });
        }
      } catch (error) {
        console.error("Error fetching perfil:", error);
        setPerfilData({
          name: user.name,
          email: user.email,
          bio: null,
          avatarUrl: null,
          createdAt: new Date().toISOString(),
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchPerfil();
  }, [user]);

  const handleEditSuccess = (data: { name: string; bio: string | null; avatarUrl: string | null }) => {
    setPerfilData((prev) => prev ? { ...prev, name: data.name, bio: data.bio, avatarUrl: data.avatarUrl } : null);
  };

  if (authLoading || isLoading) {
    return (
      <main className="mx-auto mt-8 w-full max-w-[800px] px-8 pb-[72px] pt-[100px] max-[720px]:px-3 max-[720px]:pt-[88px]">
        <section className="rounded-[18px] border border-[var(--stroke)] bg-[var(--surface)] p-8 shadow-[var(--panel-shadow)]">
          <div className="mb-8 text-center">
            <h1 className="lorcana-title text-[clamp(1.8rem,3vw,2.4rem)] text-shadow-gold">
              Mi Perfil
            </h1>
          </div>

          <div className="flex flex-col items-center gap-6">
            <div className="h-24 w-24 rounded-full bg-[var(--surface-soft)] animate-pulse" />
            <div className="text-center">
              <div className="h-6 w-32 rounded bg-[var(--surface-soft)] animate-pulse mb-2" />
              <div className="h-4 w-48 rounded bg-[var(--surface-soft)] animate-pulse" />
            </div>
            <div className="w-full max-w-md">
              <div className="h-4 w-64 mx-auto rounded bg-[var(--surface-soft)] animate-pulse" />
            </div>
            <div className="flex gap-8">
              <div>
                <div className="h-3 w-20 rounded bg-[var(--surface-soft)] animate-pulse mb-1" />
                <div className="h-4 w-24 rounded bg-[var(--surface-soft)] animate-pulse" />
              </div>
            </div>
            <div className="mt-4 flex gap-4">
              <div className="h-10 w-28 rounded-full bg-[var(--surface-soft)] animate-pulse" />
              <div className="h-10 w-36 rounded-full bg-[var(--surface-soft)] animate-pulse" />
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto mt-8 flex w-full flex-col items-center justify-center px-8 pb-[72px] pt-[100px] max-[720px]:px-3 max-[720px]:pt-[88px]">
        <p className="text-[var(--muted)]">Debes iniciar sesión para ver tu perfil</p>
        <Link href="/login" className="mt-4 text-[var(--accent)] hover:underline">
          Iniciar sesión
        </Link>
      </main>
    );
  }

  const createdAt = perfilData?.createdAt ? new Date(perfilData.createdAt) : new Date();

  return (
    <main className="mx-auto mt-8 w-full max-w-[800px] px-8 pb-[72px] pt-[100px] max-[720px]:px-3 max-[720px]:pt-[88px]">
      <section className="rounded-[18px] border border-[var(--stroke)] bg-[var(--surface)] p-8 shadow-[var(--panel-shadow)]">
        <div className="mb-8 text-center">
          <h1 className="lorcana-title text-[clamp(1.8rem,3vw,2.4rem)] text-shadow-gold">
            Mi Perfil
          </h1>
        </div>

        <div className="flex flex-col items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            {perfilData?.avatarUrl ? (
              <img
                src={perfilData.avatarUrl}
                alt={perfilData.name}
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[var(--accent)] text-[2rem] font-bold text-white">
                {perfilData?.name?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
          </div>

          {/* Nombre y Email */}
          <div className="text-center">
            <h2 className="text-xl font-semibold text-[var(--ink)]">
              {perfilData?.name || user.name}
            </h2>
            <p className="text-[var(--muted)]">{perfilData?.email || user.email}</p>
          </div>

          {/* Bio */}
          <div className="w-full max-w-md">
            <p className="text-center text-[var(--muted)] italic">
              {perfilData?.bio || "Sin biografía todavía"}
            </p>
          </div>

          {/* Info */}
          <div className="flex gap-8 text-center">
            <div>
              <p className="text-xs uppercase tracking-wider text-[var(--muted)]">
                Miembro desde
              </p>
              <p className="font-semibold text-[var(--ink)]">
                {createdAt.toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Acciones */}
          <div className="mt-4 flex gap-4">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="rounded-full border border-[var(--stroke)] px-6 py-2 text-sm font-medium text-[var(--ink)] transition hover:border-[var(--stroke-strong)]"
            >
              Editar perfil
            </button>
            <Link
              href="/perfil/cambiar-contrasena"
              className="rounded-full bg-[var(--accent)] px-6 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Cambiar contraseña
            </Link>
          </div>
        </div>
      </section>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={{
          name: perfilData?.name || user.name,
          bio: perfilData?.bio || null,
          avatarUrl: perfilData?.avatarUrl || null,
        }}
        onSuccess={handleEditSuccess}
      />
    </main>
  );
}
