"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/lib/auth";
import { loginSchema, type LoginInput } from "@/lib/schemas";

interface FormErrors {
  email?: string[];
  password?: string[];
}

interface UseLoginReturn {
  formData: LoginInput;
  errors: FormErrors;
  isSubmitting: boolean;
  apiError: string;
  handleChange: (field: keyof LoginInput, value: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export function useLogin(): UseLoginReturn {
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginInput>({ email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = useCallback((field: keyof LoginInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
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
  }, [formData, login]);

  return {
    formData,
    errors,
    isSubmitting,
    apiError,
    handleChange,
    handleSubmit,
  };
}
