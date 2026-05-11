"use client";

import { useState, useCallback } from "react";
import axios from "axios";

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
      const response = await axios.post("/api/ocr", { imageBase64 });
      const data = response.data;

      if (!data.success) {
        setError(data.error || "Error al procesar imagen");
        return { success: false, error: data.error };
      }

      return { success: true, text: data.text };
    } catch (err) {
      const errorMsg = axios.isAxiosError(err) ? err.message : "Error de red";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { extractCardNumber, isLoading, error };
}
