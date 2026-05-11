"use client";

import { useState, useCallback, useEffect } from "react";
import { saveCardToUser, translateText } from "@/actions";
import { searchCard } from "@/services/lorcastService";
import { useAuth } from "@/lib/auth";
import { STORAGE_KEYS } from "@/lib/constants";
import type { LorcanaCard } from "@/types";

interface OcrData {
  name: string;
  subtitle: string;
  number: string;
  isPromo: boolean;
}

interface UseImageSearchReturn {
  imageData: string | null;
  isProcessing: boolean;
  isSearching: boolean;
  isSaving: boolean;
  isTranslating: boolean;
  saveSuccess: string | null;
  error: string | null;
  ocrData: OcrData | null;
  isSpecialCard: boolean;
  foundCard: LorcanaCard | null;
  translatedText: string | null;
  translatedFlavor: string | null;
  processImage: () => Promise<void>;
  handleSaveCard: () => Promise<void>;
  handleTranslateClick: () => Promise<void>;
}

export function useImageSearch(): UseImageSearchReturn {
  const [imageData, setImageData] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ocrData, setOcrData] = useState<OcrData | null>(null);
  const [isSpecialCard, setIsSpecialCard] = useState(false);
  const [foundCard, setFoundCard] = useState<LorcanaCard | null>(null);
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [translatedFlavor, setTranslatedFlavor] = useState<string | null>(null);

  useEffect(() => {
    const storedImage = localStorage.getItem(STORAGE_KEYS.OCR_IMAGE);
    if (storedImage) {
      setImageData(storedImage);
      localStorage.removeItem(STORAGE_KEYS.OCR_IMAGE);
    }
  }, []);

  const processImage = useCallback(async () => {
    if (!imageData) return;

    setIsProcessing(true);
    setError(null);
    setFoundCard(null);
    setSaveSuccess(null);
    setIsSpecialCard(false);

    try {
      const response = await fetch("/api/ocr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: imageData }),
      });

      const resultData = await response.json();

      if (!resultData.success || !resultData.data) {
        setError(resultData.error || "Error al procesar la imagen");
        setIsProcessing(false);
        return;
      }

      const { name, subtitle, number, isPromo } = resultData.data;
      setOcrData({ name, subtitle, number, isPromo });

      if (name) {
        setIsSearching(true);
        const searchResult = await searchCard({ name, subtitle, number, isPromo });
        setIsSearching(false);

        if (searchResult.card) {
          setFoundCard(searchResult.card);
          setIsSpecialCard(searchResult.isSpecialCard);
        } else if (searchResult.error) {
          setError(searchResult.error);
        }
      } else {
        setError("No se pudo identificar el nombre de la carta.");
      }
    } catch (err) {
      setError("Error al procesar la imagen");
    } finally {
      setIsProcessing(false);
    }
  }, [imageData]);

  const handleSaveCard = useCallback(async () => {
    if (!foundCard) return;
    setIsSaving(true);
    const result = await saveCardToUser(foundCard);
    setIsSaving(false);
    if (result.success) {
      setSaveSuccess("Carta guardada en tu colección");
    } else {
      setError(result.error || "Error al guardar la carta");
    }
  }, [foundCard]);

  const handleTranslateClick = useCallback(async () => {
    if (!foundCard) return;
    const cardText = foundCard.text || foundCard.abilities || "";
    const cardFlavor = foundCard.flavorText || foundCard.flavor_text || "";
    if (!cardText && !cardFlavor) return;

    if (translatedText !== null || translatedFlavor !== null) {
      setTranslatedText(null);
      setTranslatedFlavor(null);
      return;
    }

    setIsTranslating(true);
    const textsToTranslate = [
      cardText ? translateText(cardText, "en", "es") : null,
      cardFlavor ? translateText(cardFlavor, "en", "es") : null,
    ];
    const results = await Promise.all(textsToTranslate);
    const textResult = results[0];
    const flavorResult = results[1];
    if (textResult?.translatedText) setTranslatedText(textResult.translatedText);
    if (flavorResult?.translatedText) setTranslatedFlavor(flavorResult.translatedText);
    setIsTranslating(false);
  }, [foundCard, translatedText, translatedFlavor]);

  useEffect(() => {
    if (imageData) {
      processImage();
    }
  }, [imageData, processImage]);

  return {
    imageData,
    isProcessing,
    isSearching,
    isSaving,
    isTranslating,
    saveSuccess,
    error,
    ocrData,
    isSpecialCard,
    foundCard,
    translatedText,
    translatedFlavor,
    processImage,
    handleSaveCard,
    handleTranslateClick,
  };
}
