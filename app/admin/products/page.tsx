import type { Metadata } from "next";
import { RequireAuth } from "@/components/auth/RequireAuth";
import AdminProductsPageClient from "./AdminProductsPageClient";

export const metadata: Metadata = {
  title: "محصولات",
};

export default function AdminProductsPage() {
  return (
    <RequireAuth requireAdmin>
      <AdminProductsPageClient />
    </RequireAuth>
  );
}
