"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { resetPassword, validateResetToken } from "@/app/actions";
import { ArrowLeftIcon, KeyIcon, CheckCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface FormErrors {
  password?: string[];
  confirmPassword?: string[];
}

export default function RestablecerContrasenaPage({ params }: { params: Promise<{ token: string }> }) {
  const router = useRouter();
  const [token, setToken] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const loadParams = async () => {
      const resolved = await params;
      setToken(resolved.token);
      
      const valid = await validateResetToken(resolved.token);
      setIsValid(valid);
      setLoading(false);
    };
    loadParams();
  }, [params]);

  const handleChange = (field: "password" | "confirmPassword", value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    
    if (!formData.password) {
      setErrors({ password: ["La contraseña es requerida"] });
      return;
    }
    
    if (formData.password.length < 8) {
      setErrors({ password: ["Mínimo 8 caracteres"] });
      return;
    }
    
    if (!/[A-Z]/.test(formData.password)) {
      setErrors({ password: ["Al menos una mayúscula"] });
      return;
    }
    
    if (!/[a-z]/.test(formData.password)) {
      setErrors({ password: ["Al menos una minúscula"] });
      return;
    }
    
    if (!/[0-9]/.test(formData.password)) {
      setErrors({ password: ["Al menos un número"] });
      return;
    }
    
    if (!/[^A-Za-z0-9]/.test(formData.password)) {
      setErrors({ password: ["Al menos un carácter especial"] });
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: ["Las contraseñas no coinciden"] });
      return;
    }

    setIsSubmitting(true);
    const result = await resetPassword(token, formData.password, formData.confirmPassword);
    
    if (result.success) {
      setIsSuccess(true);
    } else {
      setApiError(result.error || "Error al restablecer la contraseña");
    }
    
    setIsSubmitting(false);
  };

  const inputClass =
    "w-full rounded-[12px] border border-[var(--stroke)] bg-[var(--surface-strong)] px-4 py-3 text-base text-[var(--ink)] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--surface-strong)]";

  const labelClass = "mb-2 block text-[0.82rem] uppercase tracking-[1px] text-[var(--muted)]";

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-[1200px] px-8 pb-[72px] pt-[100px] max-[720px]:px-3 max-[720px]:pt-[88px] max-[720px]:pb-14">
        <div className="mx-auto max-w-[480px] rounded-[18px] border border-[var(--stroke)] bg-[var(--surface)] p-8 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent mx-auto"></div>
          <p className="mt-4 text-[var(--muted)]">Validando enlace...</p>
        </div>
      </main>
    );
  }

  if (!isValid) {
    return (
      <main className="mx-auto w-full max-w-[1200px] px-8 pb-[72px] pt-[100px] max-[720px]:px-3 max-[720px]:pt-[88px] max-[720px]:pb-14">
        <section className="mx-auto max-w-[480px] rounded-[18px] border border-[var(--stroke)] bg-[var(--surface)] p-8 shadow-[var(--panel-shadow)] max-[600px]:p-6">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="lorcana-title text-[clamp(1.8rem,3vw,2.4rem)] text-shadow-gold">Enlace expirado</h1>
            <p className="mt-2 text-[var(--muted)]">Este enlace ya no es válido o ha expirado.</p>
          </div>
          <Link
            href="/olvide-contrasena"
            className="block w-full rounded-full bg-[var(--accent)] px-6 py-3 text-base font-semibold text-white text-center"
          >
            Solicitar nuevo enlace
          </Link>
          <p className="mt-6 text-center text-[0.9rem] text-[var(--muted)]">
            <Link href="/login" className="text-[var(--accent)] hover:underline flex items-center justify-center gap-2">
              <ArrowLeftIcon className="h-4 w-4" />
              Volver al login
            </Link>
          </p>
        </section>
      </main>
    );
  }

  if (isSuccess) {
    return (
      <main className="mx-auto w-full max-w-[1200px] px-8 pb-[72px] pt-[100px] max-[720px]:px-3 max-[720px]:pt-[88px] max-[720px]:pb-14">
        <section className="mx-auto max-w-[480px] rounded-[18px] border border-[var(--stroke)] bg-[var(--surface)] p-8 shadow-[var(--panel-shadow)] max-[600px]:p-6">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="lorcana-title text-[clamp(1.8rem,3vw,2.4rem)] text-shadow-gold">¡Contraseña actualizada!</h1>
            <p className="mt-2 text-[var(--muted)]">Tu contraseña ha sido restablecida correctamente.</p>
          </div>
          <Link
            href="/login"
            className="block w-full rounded-full bg-[var(--accent)] px-6 py-3 text-base font-semibold text-white text-center"
          >
            Iniciar sesión
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-[1200px] px-8 pb-[72px] pt-[100px] max-[720px]:px-3 max-[720px]:pt-[88px] max-[720px]:pb-14">
      <section className="mx-auto max-w-[480px] rounded-[18px] border border-[var(--stroke)] bg-[var(--surface)] p-8 shadow-[var(--panel-shadow)] max-[600px]:p-6">
        <div className="mb-8 text-center">
          <h1 className="lorcana-title text-[clamp(1.8rem,3vw,2.4rem)] text-shadow-gold">Nueva contraseña</h1>
          <p className="mt-2 text-[var(--muted)]">Ingresa tu nueva contraseña</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {apiError && (
            <div className="rounded-lg bg-[var(--alert-surface)] p-3 text-[0.9rem] text-[var(--alert-ink)]">
              {apiError}
            </div>
          )}

          <div>
            <label htmlFor="password" className={labelClass}>
              Nueva contraseña
            </label>
            <div className="relative">
              <KeyIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--muted)]" />
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className={`${inputClass} pl-12 ${errors.password ? "border-[var(--alert-ink)]" : ""}`}
                placeholder="Mínimo 8 caracteres"
              />
            </div>
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
              className={`${inputClass} ${errors.confirmPassword ? "border-[var(--alert-ink)]" : ""}`}
              placeholder="Repite tu contraseña"
            />
            {errors.confirmPassword && errors.confirmPassword.map((msg, i) => (
              <p key={i} className="mt-1 text-[0.8rem] text-[var(--alert-ink)]">{msg}</p>
            ))}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-[var(--accent)] px-6 py-3 text-base font-semibold text-white shadow-[0_12px_24px_rgba(197,138,60,0.35)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(197,138,60,0.45)] disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {isSubmitting ? "Guardando..." : "Guardar contraseña"}
          </button>
        </form>

        <p className="mt-6 text-center text-[0.9rem] text-[var(--muted)]">
          <Link href="/login" className="text-[var(--accent)] hover:underline flex items-center justify-center gap-2">
            <ArrowLeftIcon className="h-4 w-4" />
            Volver al login
          </Link>
        </p>
      </section>
    </main>
  );
}
