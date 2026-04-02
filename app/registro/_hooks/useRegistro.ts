"use client";

import { useState, useCallback } from "react";
import { useAuth } from "../../lib/auth";
import { registerSchema, type RegisterInput } from "../../lib/schemas";

interface FormErrors {
  name?: string[];
  email?: string[];
  password?: string[];
  confirmPassword?: string[];
}

interface UseRegistroReturn {
  formData: RegisterInput;
  errors: FormErrors;
  isSubmitting: boolean;
  apiError: string;
  handleChange: (field: keyof RegisterInput, value: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export function useRegistro(): UseRegistroReturn {
  const { register, isLoading: authLoading } = useAuth();
  const [formData, setFormData] = useState<RegisterInput>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = useCallback((field: keyof RegisterInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    const result = registerSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      const issues = result.error.issues;
      for (const issue of issues) {
        const field = issue.path[0] as keyof RegisterInput;
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
      await register(formData.name, formData.email, formData.password);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Error al registrar usuario");
    }
    setIsSubmitting(false);
  }, [formData, register]);

  return {
    formData,
    errors,
    isSubmitting,
    apiError,
    handleChange,
    handleSubmit,
  };
}