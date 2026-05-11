"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";

export function usePerfil() {
  const { user, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [perfilData, setPerfilData] = useState<{
    name: string;
    email: string;
    bio: string | null;
    avatarUrl: string | null;
    createdAt: string;
  } | null>(null);

  useEffect(() => {
    async function fetchPerfil() {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setPerfilData({
            name: data.user?.name || user.name,
            email: data.user?.email || user.email,
            bio: data.user?.bio || null,
            avatarUrl: data.user?.avatarUrl || null,
            createdAt: data.user?.createdAt || new Date().toISOString(),
          });
        }
      } catch (error) {
        console.error("Error fetching perfil:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPerfil();
  }, [user]);

  return {
    user,
    perfilData,
    isLoading: isLoading || authLoading,
  };
}
