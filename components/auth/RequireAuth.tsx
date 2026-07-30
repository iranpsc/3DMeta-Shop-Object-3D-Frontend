"use client";

import { useEffect, type ReactNode } from "react";
import { loginRedirect, type AuthUser } from "@/lib/auth";
import { useAuth } from "@/lib/auth-context";
import { PageLoading } from "@/components/ui/page-loading";

type RequireAuthProps = {
  children: ReactNode | ((user: AuthUser) => ReactNode);
  requireAdmin?: boolean;
};

/**
 * Client-side auth gate for Sanctum cookie sessions.
 * Server proxy cannot forward API-origin cookies (localhost:8000 vs :3000),
 * so protected routes must verify via browser fetch with credentials.
 * Uses AuthProvider so AppShell and gated pages share one getUser() call.
 */
export function RequireAuth({ children, requireAdmin = false }: RequireAuthProps) {
  const { user, status } = useAuth();

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated" || !user) {
      loginRedirect();
      return;
    }

    if (requireAdmin && user.role !== "admin") {
      window.location.href = "/";
    }
  }, [status, user, requireAdmin]);

  if (status === "loading") {
    return <PageLoading />;
  }

  if (!user || (requireAdmin && user.role !== "admin")) {
    return null;
  }

  return typeof children === "function" ? children(user) : children;
}
