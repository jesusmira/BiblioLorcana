"use client";

import { useState, useCallback } from "react";
import { requestPasswordReset } from "@/app/actions";

interface UsePasswordResetRequestReturn {
  email: string;
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string;
  setEmail: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export function usePasswordResetRequest(): UsePasswordResetRequestReturn {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (!email.trim()) {
      setError("El email es requerido");
      setIsSubmitting(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Email inválido");
      setIsSubmitting(false);
      return;
    }

    const result = await requestPasswordReset(email);

    if (result.success) {
      setIsSuccess(true);
    } else {
      setError(result.error || "Error al solicitar el restablecimiento");
    }

    setIsSubmitting(false);
  }, [email]);

  return {
    email,
    isSubmitting,
    isSuccess,
    error,
    setEmail,
    handleSubmit,
  };
}