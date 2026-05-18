"use client";

import { useState, createContext, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "./supabase-client";

interface User {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  image?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  loginWithProvider: (provider: "google" | "github") => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setUser({
          id: session.user.id,
          name:
            session.user.user_metadata.full_name ||
            session.user.email?.split("@")[0] ||
            "Usuario",
          email: session.user.email!,
          role: session.user.user_metadata.role || "USER",
          image:
            session.user.user_metadata.avatar_url ||
            session.user.user_metadata.picture,
        });
      } else {
        // Intentar con sesión legacy
        try {
          const res = await fetch("/api/auth/me");
          if (res.ok) {
            const data = await res.json();
            if (data.user) {
              setUser(data.user);
            }
          }
        } catch (error) {
          console.error("Error fetching legacy session:", error);
        }
      }
      setIsLoading(false);
    };

    fetchUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        if (session.user.email) {
          localStorage.setItem("last_login_email", session.user.email);
        }
        setUser({
          id: session.user.id,
          name:
            session.user.user_metadata.full_name ||
            session.user.email?.split("@")[0] ||
            "Usuario",
          email: session.user.email!,
          role: session.user.user_metadata.role || "USER",
          image:
            session.user.user_metadata.avatar_url ||
            session.user.user_metadata.picture,
        });
      } else if (_event === "SIGNED_OUT") {
        setUser(null);
      } else if (_event === "INITIAL_SESSION" && !session) {
        // No hacer nada, fetchUser se encarga de la sesión legacy
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // 1. Intentar con Supabase (email real)
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error) {
        router.push("/");
        router.refresh();
        return;
      }

      // 2. Si falla o no es email, intentar con API legacy
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Credenciales inválidas");
      }

      const data = await res.json();
      setUser(data.user);
      router.push("/");
      router.refresh();
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: "USER",
          },
        },
      });

      if (error) throw error;

      // Supabase usually requires email verification, but we can configure it otherwise.
      // For now, assume it works or user is informed.
      router.push("/login?message=Verifica tu email para continuar");
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithProvider = async (provider: "google" | "github") => {
    try {
      const lastEmail =
        typeof window !== "undefined"
          ? localStorage.getItem("last_login_email")
          : null;

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
          queryParams: {
            ...(provider === "google" && lastEmail
              ? { login_hint: lastEmail }
              : {}),
            prompt: "select_account",
          },
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error(`Error with ${provider} login:`, error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout error:", error);
    }
    setUser(null);
    router.push("/");
    router.refresh();
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, register, loginWithProvider, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
