"use client";

import { useEffect, useCallback, useRef } from "react";
import { useAuth } from "../../lib/auth";
import { useDecksStore } from "../../store";
import { getUserDecksAction, migrateLocalDecksAction } from "../../actions/dbDeckActions";

export function useSyncDecks() {
  const { user } = useAuth();
  const { decks, setDecks, setIsLoading } = useDecksStore();
  const hasSynced = useRef(false);

  const sync = useCallback(async () => {
    if (!user || hasSynced.current) return;

    setIsLoading(true);
    try {
      // 1. Obtener mazos de la DB
      const dbDecks = await getUserDecksAction();
      
      // 2. Comprobar si hay mazos locales que no están en la DB
      // Para simplificar, si la DB está vacía y hay locales, migramos.
      // O podemos comparar IDs (pero los locales tienen IDs temporales)
      const localDecks = decks.filter(d => d.id.startsWith("deck_"));

      if (localDecks.length > 0) {
        console.log("Migrando mazos locales a la base de datos...");
        await migrateLocalDecksAction(localDecks);
        // Volver a cargar después de migrar
        const finalDecks = await getUserDecksAction();
        setDecks(finalDecks);
      } else {
        setDecks(dbDecks);
      }
      
      hasSynced.current = true;
    } catch (error) {
      console.error("Error al sincronizar mazos:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user, decks, setDecks, setIsLoading]);

  useEffect(() => {
    if (user) {
      sync();
    }
  }, [user, sync]);

  return { sync };
}
