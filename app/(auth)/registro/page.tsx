"use client";

import { useAuth } from "@/lib/auth";
import Link from "next/link";
import { useRegistro } from "./_hooks/useRegistro";
import { inputError } from "@/lib/styles";

export default function RegistroPage() {
  const { isLoading: authLoading } = useAuth();
  const { formData, errors, isSubmitting, apiError, handleChange, handleSubmit } = useRegistro();

  const inputClass =
    "w-full rounded-[12px] border border-[var(--stroke)] bg-[var(--surface-strong)] px-4 py-2.5 text-base text-[var(--ink)] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none";

  const labelClass = "mb-2 block text-[0.82rem] uppercase tracking-[1px] text-[var(--muted)]";

  return (
    <main className="mx-auto w-full max-w-[1200px] px-8 pb-[72px] pt-[100px] max-[720px]:px-3 max-[720px]:pt-[88px] max-[720px]:pb-14">
      <section className="mx-auto max-w-[480px] rounded-[18px] border border-[var(--stroke)] bg-[var(--surface)] p-8 shadow-[var(--panel-shadow)] max-[600px]:p-6">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-wide text-[var(--accent)] sm:text-4xl" style={{ fontFamily: "var(--font-title)" }}>Registro</h1>
          <p className="mt-2 text-[var(--muted)]">Crea tu cuenta para acceder a la galeria</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {apiError && (
            <div className="rounded-lg bg-[var(--alert-surface)] p-3 text-[0.9rem] text-[var(--alert-ink)]">
              {apiError}
            </div>
          )}
          <div>
            <label htmlFor="name" className={labelClass}>
              Nombre completo
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={inputError(inputClass, !!errors.name)}
              placeholder="Tu nombre"
            />
            {errors.name && errors.name.map((msg, i) => (
              <p key={i} className="mt-1 text-[0.8rem] text-[var(--alert-ink)]">{msg}</p>
            ))}
          </div>

          <div>
            <label htmlFor="email" className={labelClass}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className={inputError(inputClass, !!errors.email)}
              placeholder="tu@email.com"
            />
            {errors.email && errors.email.map((msg, i) => (
              <p key={i} className="mt-1 text-[0.8rem] text-[var(--alert-ink)]">{msg}</p>
            ))}
          </div>

          <div>
            <label htmlFor="password" className={labelClass}>
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              className={inputError(inputClass, !!errors.password)}
              placeholder="Mínimo 8 caracteres, mayúscula, minúscula, número y especial"
            />
            {errors.password && errors.password.map((msg, i) => (
              <p key={i} className="mt-1 text-[0.8rem] text-[var(--alert-ink)]">{msg}</p>
            ))}
          </div>

          <div>
            <label htmlFor="confirmPassword" className={labelClass}>
              Confirmar contraseña
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              className={inputError(inputClass, !!errors.confirmPassword)}
              placeholder="Repite tu contraseña"
            />
            {errors.confirmPassword && errors.confirmPassword.map((msg, i) => (
              <p key={i} className="mt-1 text-[0.8rem] text-[var(--alert-ink)]">{msg}</p>
            ))}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || authLoading}
            className="w-full rounded-full bg-[var(--accent)] px-6 py-3 text-base font-semibold text-white shadow-[0_12px_24px_rgba(197,138,60,0.35)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(197,138,60,0.45)] disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {isSubmitting ? "Creando cuenta..." : "Registrarse"}
          </button>
        </form>

        <p className="mt-6 text-center text-[0.9rem] text-[var(--muted)]">
          Ya tienes cuenta?{" "}
          <Link href="/login" className="text-[var(--accent)] hover:underline">
            Iniciar sesión
          </Link>
        </p>
      </section>
    </main>
  );
}
