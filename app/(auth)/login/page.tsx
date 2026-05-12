"use client";

import { useState } from "react";
import Link from "next/link";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/lib/auth";
import { useLogin } from "./_hooks/useLogin";
import { inputError } from "@/lib/styles";

export default function LoginPage() {
  const { isLoading: authLoading, loginWithProvider } = useAuth();
  const { formData, errors, isSubmitting, apiError, handleChange, handleSubmit } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const handleProviderLogin = async (provider: "google" | "github") => {
    try {
      await loginWithProvider(provider);
    } catch (error) {
      // Error is handled in context or logged
    }
  };

  const inputClass =
    "w-full rounded-[12px] border border-[var(--stroke)] bg-[var(--surface-strong)] px-4 py-2.5 text-base text-[var(--ink)] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none";

  const labelClass = "mb-2 block text-[0.82rem] uppercase tracking-[1px] text-[var(--muted)]";

  return (
    <main className="mx-auto w-full max-w-[1200px] px-8 pb-[72px] pt-[100px] max-[720px]:px-3 max-[720px]:pt-[88px] max-[720px]:pb-14">
      <section className="mx-auto max-w-[480px] rounded-[18px] border border-[var(--stroke)] bg-[var(--surface)] p-8 shadow-[var(--panel-shadow)] max-[600px]:p-6">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-wide text-[var(--accent)] sm:text-4xl" style={{ fontFamily: "var(--font-title)" }}>Login</h1>
          <p className="mt-2 text-[var(--muted)]">Accede a tu cuenta</p>
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => handleProviderLogin("google")}
            className="flex items-center justify-center gap-3 rounded-[12px] border border-[var(--stroke)] bg-[var(--surface-strong)] px-4 py-3 text-sm font-medium text-[var(--ink)] transition-all hover:bg-[var(--surface-hover)] hover:border-[var(--accent)] hover:shadow-sm"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"
              />
              <path
                fill="#FBBC05"
                d="M16.04 18.013c-1.09.693-2.43 1.078-3.94 1.078a7.077 7.077 0 0 1-6.723-4.823L1.24 17.382c1.958 3.953 6.031 6.65 10.76 6.65 2.952 0 5.711-1.059 7.73-2.855l-3.69-3.164Z"
              />
              <path
                fill="#4285F4"
                d="M19.834 21.177c2.52-2.226 3.996-5.549 3.996-9.177 0-.83-.09-1.637-.259-2.409H12v4.582h6.758a5.782 5.782 0 0 1-2.509 3.791l3.585 3.213Z"
              />
              <path
                fill="#34A853"
                d="M5.266 14.235A7.077 7.077 0 0 1 4.909 12c0-.782.127-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.24 5.382l4.026-3.147Z"
              />
            </svg>
            Google
          </button>

          <button
            onClick={() => handleProviderLogin("github")}
            className="flex items-center justify-center gap-3 rounded-[12px] border border-[var(--stroke)] bg-[var(--surface-strong)] px-4 py-3 text-sm font-medium text-[var(--ink)] transition-all hover:bg-[var(--surface-hover)] hover:border-[var(--accent)] hover:shadow-sm"
          >
            <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
            GitHub
          </button>
        </div>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-[var(--stroke)]"></span>
          </div>
          <div className="relative flex justify-center text-[0.8rem] uppercase tracking-widest text-[var(--muted)]">
            <span className="bg-[var(--surface)] px-4">OR</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {apiError && (
            <div className="rounded-lg bg-[var(--alert-surface)] p-3 text-[0.9rem] text-[var(--alert-ink)]">
              {apiError}
            </div>
          )}
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
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className={inputError(inputClass, !!errors.password)}
                placeholder="Tu contraseña"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <EyeSlashIcon className="h-[18px] w-[18px]" /> : <EyeIcon className="h-[18px] w-[18px]" />}
              </button>
            </div>
            {errors.password && errors.password.map((msg, i) => (
              <p key={i} className="mt-1 text-[0.8rem] text-[var(--alert-ink)]">{msg}</p>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-[0.9rem] text-[var(--muted)]">
              <input type="checkbox" className="h-4 w-4 rounded border-[var(--stroke)] accent-[var(--accent)]" />
              Recordarme
            </label>
            <Link href="/olvide-contrasena" className="text-[0.9rem] text-[var(--accent)] hover:underline">
              Olvidaste tu contraseña?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || authLoading}
            className="w-full rounded-full bg-[var(--accent)] px-6 py-3 text-base font-semibold text-white shadow-[0_12px_24px_rgba(197,138,60,0.35)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(197,138,60,0.45)] disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>
        </form>

        <p className="mt-8 text-center text-[0.9rem] text-[var(--muted)]">
          No tienes cuenta?{" "}
          <Link href="/registro" className="text-[var(--accent)] hover:underline">
            Registrate
          </Link>
        </p>

      </section>
    </main>
  );
}
