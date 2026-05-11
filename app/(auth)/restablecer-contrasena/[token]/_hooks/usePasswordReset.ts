"use client";

import { useState, useEffect, useCallback } from "react";
import { resetPassword, validateResetToken } from "@/actions";

interface FormErrors {
  password?: string[];
  confirmPassword?: string[];
}

interface UsePasswordResetReturn {
  token: string;
  isValid: boolean | null;
  loading: boolean;
  formData: { password: string; confirmPassword: string };
  errors: FormErrors;
  isSubmitting: boolean;
  isSuccess: boolean;
  apiError: string;
  handleChange: (field: "password" | "confirmPassword", value: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export function usePasswordReset(tokenFromParams: string): UsePasswordResetReturn {
  const [token, setToken] = useState(tokenFromParams);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const validateToken = async () => {
      const valid = await validateResetToken(token);
      setIsValid(valid);
      setLoading(false);
    };
    validateToken();
  }, [token]);

  const handleChange = useCallback((field: "password" | "confirmPassword", value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
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
  }, [token, formData]);

  return {
    token,
    isValid,
    loading,
    formData,
    errors,
    isSubmitting,
    isSuccess,
    apiError,
    handleChange,
    handleSubmit,
  };
}