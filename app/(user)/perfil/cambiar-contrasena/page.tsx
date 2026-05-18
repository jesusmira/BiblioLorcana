"use client";

import { useState } from "react";
import { changePassword } from "../actions";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function CambiarContrasenaPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (newPassword.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    setIsLoading(true);

    const result = await changePassword(oldPassword, newPassword);

    setIsLoading(false);

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error || "Error al cambiar la contraseña");
    }
  };

  if (success) {
    return (
      <main className="mx-auto mt-8 w-full max-w-[800px] px-8 pb-[72px] pt-[100px] max-[720px]:px-3 max-[720px]:pt-[88px]">
        <section className="rounded-[18px] border border-[var(--stroke)] bg-[var(--surface)] p-8 shadow-[var(--panel-shadow)]">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-[var(--ink)]">
              Contraseña cambiada
            </h1>
            <p className="text-[var(--muted)]">
              Tu contraseña ha sido actualizada correctamente.
            </p>
            <Link
              href="/perfil"
              className="mt-4 rounded-full bg-[var(--accent)] px-6 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Volver al perfil
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto mt-8 w-full max-w-[800px] px-8 pb-[72px] pt-[100px] max-[720px]:px-3 max-[720px]:pt-[88px]">
      <section className="rounded-[18px] border border-[var(--stroke)] bg-[var(--surface)] p-8 shadow-[var(--panel-shadow)]">
        <div className="mb-6">
          <Link
            href="/perfil"
            className="flex items-center gap-2 text-[var(--muted)] hover:text-[var(--ink)]"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Volver al perfil
          </Link>
        </div>

        <div className="mb-8 text-center">
          <h1 className="lorcana-title text-[clamp(1.5rem,3vw,2rem)] text-shadow-gold">
            Cambiar contraseña
          </h1>
          <p className="mt-2 text-[var(--muted)]">
            Ingresa tu contraseña actual y luego la nueva
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-4">
          <div>
            <label
              htmlFor="oldPassword"
              className="mb-2 block text-sm text-[var(--muted)]"
            >
              Contraseña actual
            </label>
            <input
              id="oldPassword"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              className="w-full rounded-[12px] border border-[var(--stroke)] bg-[var(--surface-strong)] px-4 py-3 text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>

          <div>
            <label
              htmlFor="newPassword"
              className="mb-2 block text-sm text-[var(--muted)]"
            >
              Nueva contraseña
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full rounded-[12px] border border-[var(--stroke)] bg-[var(--surface-strong)] px-4 py-3 text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
            <p className="mt-1 text-xs text-[var(--muted)]">
              Mínimo 8 caracteres
            </p>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm text-[var(--muted)]"
            >
              Confirmar nueva contraseña
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full rounded-[12px] border border-[var(--stroke)] bg-[var(--surface-strong)] px-4 py-3 text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>

          {error && <p className="text-sm text-[var(--alert-ink)]">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-full bg-[var(--accent)] px-6 py-3 text-base font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {isLoading ? "Cambiando..." : "Cambiar contraseña"}
          </button>
        </form>
      </section>
    </main>
  );
}
