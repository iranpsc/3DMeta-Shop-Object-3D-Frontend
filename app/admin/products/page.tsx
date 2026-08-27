import type { Metadata } from "next";
import { privatePageMetadata } from "@/lib/page-metadata";
import { RequireAuth } from "@/components/auth/RequireAuth";
import AdminProductsPageClient from "./AdminProductsPageClient";

export const metadata: Metadata = privatePageMetadata("محصولات");

export default function AdminProductsPage() {
  return (
    <RequireAuth requireAdmin>
      <AdminProductsPageClient />
    </RequireAuth>
  );
}
