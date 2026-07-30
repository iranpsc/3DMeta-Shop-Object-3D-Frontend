"use client";

import { AuthProvider } from "@/lib/auth-context";
import { CartProvider } from "@/lib/cart-context";
import { AppShell } from "@/components/layout/AppShell";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <AppShell>{children}</AppShell>
      </CartProvider>
    </AuthProvider>
  );
}
