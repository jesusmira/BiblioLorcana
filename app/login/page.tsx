"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../lib/auth";
import { loginSchema, type LoginInput } from "../lib/schemas";

interface FormErrors {
  email?: string[];
  password?: string[];
}

export default function LoginPage() {
  const { login, isLoading: authLoading } = useAuth();
  const [formData, setFormData] = useState<LoginInput>({ email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = (field: keyof LoginInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      const issues = result.error.issues;
      for (const issue of issues) {
        const field = issue.path[0] as keyof LoginInput;
        if (!fieldErrors[field]) {
          fieldErrors[field] = [];
        }
        fieldErrors[field]?.push(issue.message);
      }
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await login(formData.email, formData.password);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Error al iniciar sesión");
    }
    setIsSubmitting(false);
  };

  const inputClass =
    "w-full rounded-[12px] border border-[var(--stroke)] bg-[var(--surface-strong)] px-4 py-3 text-base text-[var(--ink)] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--surface-strong)]";

  const labelClass = "mb-2 block text-[0.82rem] uppercase tracking-[1px] text-[var(--muted)]";

  return (
    <main className="mx-auto w-full max-w-[1200px] px-8 pb-[72px] pt-[100px] max-[720px]:px-3 max-[720px]:pt-[88px] max-[720px]:pb-14">
      <section className="mx-auto max-w-[480px] rounded-[18px] border border-[var(--stroke)] bg-[var(--surface)] p-8 shadow-[var(--panel-shadow)] max-[600px]:p-6">
        <div className="mb-8 text-center">
          <h1 className="lorcana-title text-[clamp(1.8rem,3vw,2.4rem)] text-shadow-gold">Login</h1>
          <p className="mt-2 text-[var(--muted)]">Accede a tu cuenta</p>
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
              className={`${inputClass} ${errors.email ? "border-[var(--alert-ink)]" : ""}`}
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
              className={`${inputClass} ${errors.password ? "border-[var(--alert-ink)]" : ""}`}
              placeholder="Tu contraseña"
            />
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

        <p className="mt-6 text-center text-[0.9rem] text-[var(--muted)]">
          No tienes cuenta?{" "}
          <Link href="/registro" className="text-[var(--accent)] hover:underline">
            Registrate
          </Link>
        </p>
      </section>
    </main>
  );
}
