"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EditProfileModal } from "./EditProfileModal";
import { deleteAccount } from "./actions";
import { AuthGuard, PageHeader, ConfirmationDialog } from "@/components";
import { UserIcon } from "@heroicons/react/24/outline";

interface PerfilData {
  name: string;
  email: string;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: string;
}

export default function PerfilPage() {
  const { user, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [perfilData, setPerfilData] = useState<PerfilData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

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

  const handleEditSuccess = (data: {
    name: string;
    bio: string | null;
    avatarUrl: string | null;
  }) => {
    setPerfilData((prev) =>
      prev
        ? { ...prev, name: data.name, bio: data.bio, avatarUrl: data.avatarUrl }
        : null,
    );
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setDeleteError(null);

    const result = await deleteAccount();

    if (result.success) {
      await logout();
      router.push("/");
    } else {
      setDeleteError(result.error || "Error al eliminar la cuenta");
      setIsDeleting(false);
    }
  };

  const createdAt = perfilData?.createdAt
    ? new Date(perfilData.createdAt)
    : new Date();

  return (
    <AuthGuard
      title="Mi Perfil"
      description="Inicia sesión para ver tu perfil y gestionar tu cuenta de Lorcana."
      icon={<UserIcon className="h-12 w-12" />}
      isLoading={isLoading}
      loadingMessage="Cargando tu perfil..."
    >
      <main className="mx-auto flex min-h-screen flex-col px-4 pb-12 pt-24 max-w-2xl font-[var(--font-sans)]">
        <PageHeader
          title="Mi Perfil"
          description="Gestiona tu información personal y cuenta"
          icon={<UserIcon className="h-8 w-8" />}
        />

        <section className="rounded-[24px] border border-[var(--stroke)] bg-[var(--surface)] p-8 shadow-[var(--card-shadow)]">
          <div className="flex flex-col items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              {perfilData?.avatarUrl || user?.image ? (
                <img
                  src={perfilData?.avatarUrl || user?.image || ""}
                  alt={perfilData?.name || user?.name || ""}
                  className="h-24 w-24 rounded-full object-cover ring-2 ring-[var(--stroke)]"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[var(--accent)] text-[2rem] font-bold text-white">
                  {(perfilData?.name || user?.name || "U")
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}
            </div>

            {/* Nombre y Email */}
            <div className="text-center">
              <h2 className="text-xl font-semibold text-[var(--ink)]">
                {perfilData?.name || user?.name}
              </h2>
              <p className="text-[var(--muted)]">
                {perfilData?.email || user?.email}
              </p>
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
            <div className="mt-4 flex flex-wrap justify-center gap-4">
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

            {/* Eliminar cuenta */}
            <div className="mt-8 pt-6 border-t border-[var(--stroke)] w-full max-w-md text-center">
              <p className="text-[var(--muted)] text-sm mb-4">
                ¿Quieres eliminar tu cuenta? Esta acción es permanente.
              </p>
              <button
                onClick={() => setIsDeleting(true)}
                className="rounded-full border border-[var(--alert-ink)] px-6 py-2 text-sm font-medium text-[var(--alert-ink)] transition hover:bg-[var(--alert-ink)] hover:text-white"
              >
                Eliminar mi cuenta
              </button>
              {deleteError && (
                <p className="text-sm text-[var(--alert-ink)] mt-2">
                  {deleteError}
                </p>
              )}
            </div>
          </div>
        </section>

        <ConfirmationDialog
          isOpen={isDeleting}
          title="¿Eliminar cuenta?"
          message="¿Estás seguro de que quieres eliminar tu cuenta? Esta acción es permanente y eliminará todos tus datos, incluyendo tu colección y favoritos."
          confirmLabel="Eliminar cuenta"
          cancelLabel="Cancelar"
          onConfirm={handleDeleteAccount}
          onCancel={() => setIsDeleting(false)}
          isDestructive={true}
        />

        {user && (
          <EditProfileModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            initialData={{
              name: perfilData?.name || user.name || "",
              bio: perfilData?.bio || null,
              avatarUrl: perfilData?.avatarUrl || user.image || null,
            }}
            onSuccess={handleEditSuccess}
          />
        )}
      </main>
    </AuthGuard>
  );
}
