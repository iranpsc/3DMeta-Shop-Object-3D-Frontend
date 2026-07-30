"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getUser, logout as apiLogout, type AuthUser } from "@/lib/auth";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthContextValue = {
  user: AuthUser | null;
  status: AuthStatus;
  refresh: () => Promise<AuthUser | null>;
  setUser: (user: AuthUser | null) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  const refresh = useCallback(async () => {
    try {
      const current = await getUser();
      setUser(current);
      setStatus(current ? "authenticated" : "unauthenticated");
      return current;
    } catch {
      setUser(null);
      setStatus("unauthenticated");
      return null;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    getUser()
      .then((current) => {
        if (cancelled) return;
        setUser(current);
        setStatus(current ? "authenticated" : "unauthenticated");
      })
      .catch(() => {
        if (cancelled) return;
        setUser(null);
        setStatus("unauthenticated");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } finally {
      // Hard-navigate home without flipping local auth to "unauthenticated" first.
      // On protected pages, that state change races with RequireAuth and sends the
      // user back through /auth/redirect with the current URL as `intended`.
      window.location.assign("/");
    }
  }, []);

  const value = useMemo(
    () => ({ user, status, refresh, setUser, logout }),
    [user, status, refresh, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
