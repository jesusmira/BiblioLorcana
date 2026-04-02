"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePasswordResetRequest } from "./_hooks/usePasswordResetRequest";
import { ArrowLeftIcon, EnvelopeIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

export default function OlvideContrasenaPage() {
  const { email, isSubmitting, isSuccess, error, setEmail, handleSubmit } = usePasswordResetRequest();

  const inputClass =
    "w-full rounded-[12px] border border-[var(--stroke)] bg-[var(--surface-strong)] px-4 py-3 text-base text-[var(--ink)] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--surface-strong)]";

  const labelClass = "mb-2 block text-[0.82rem] uppercase tracking-[1px] text-[var(--muted)]";

  return (
    <main className="mx-auto w-full max-w-[1200px] px-8 pb-[72px] pt-[100px] max-[720px]:px-3 max-[720px]:pt-[88px] max-[720px]:pb-14">
      <section className="mx-auto max-w-[480px] rounded-[18px] border border-[var(--stroke)] bg-[var(--surface)] p-8 shadow-[var(--panel-shadow)] max-[600px]:p-6">
        <div className="mb-8 text-center">
          <h1 className="lorcana-title text-[clamp(1.8rem,3vw,2.4rem)] text-shadow-gold">¿Olvidaste tu contraseña?</h1>
          <p className="mt-2 text-[var(--muted)]">
            {isSuccess
              ? "Te hemos enviado un email con instrucciones"
              : "Ingresa tu email para recibir instrucciones"}
          </p>
        </div>

        {isSuccess ? (
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="rounded-full bg-green-100 p-4">
                <CheckCircleIcon className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <div className="rounded-lg bg-[var(--surface-soft)] p-4 text-[var(--muted)]">
              <p>Si existe una cuenta con ese email, recibirás un enlace para restablecer tu contraseña.</p>
              <p className="mt-2 text-sm">El enlace caduca en 1 hora.</p>
            </div>
            <Link
              href="/login"
              className="block w-full rounded-full bg-[var(--accent)] px-6 py-3 text-base font-semibold text-white text-center"
            >
              Volver al login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg bg-[var(--alert-surface)] p-3 text-[0.9rem] text-[var(--alert-ink)]">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className={labelClass}>
                Email
              </label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--muted)]" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${inputClass} pl-12 ${error ? "border-[var(--alert-ink)]" : ""}`}
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-[var(--accent)] px-6 py-3 text-base font-semibold text-white shadow-[0_12px_24px_rgba(197,138,60,0.35)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(197,138,60,0.45)] disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {isSubmitting ? "Enviando..." : "Enviar instrucciones"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-[0.9rem] text-[var(--muted)]">
          Recordaste tu contraseña?{" "}
          <Link href="/login" className="text-[var(--accent)] hover:underline">
            Iniciar sesión
          </Link>
        </p>
      </section>
    </main>
  );
}