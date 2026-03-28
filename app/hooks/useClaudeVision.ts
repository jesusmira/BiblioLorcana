"use client";

import { useState, useCallback } from "react";

interface ClaudeVisionResult {
  success: boolean;
  text?: string;
  error?: string;
}

interface UseClaudeVisionReturn {
  extractCardNumber: (imageBase64: string) => Promise<ClaudeVisionResult>;
  isLoading: boolean;
  error: string | null;
}

export function useClaudeVision(): UseClaudeVisionReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const extractCardNumber = useCallback(async (imageBase64: string): Promise<ClaudeVisionResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ocr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageBase64 }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || "Error al procesar imagen");
        return { success: false, error: data.error };
      }

      return { success: true, text: data.text };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error de red";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { extractCardNumber, isLoading, error };
}