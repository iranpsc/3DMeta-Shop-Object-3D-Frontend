import type { Metadata } from "next";
import { privatePageMetadata } from "@/lib/page-metadata";
import { RequireAuth } from "@/components/auth/RequireAuth";
import AdminCategoriesPageClient from "./AdminCategoriesPageClient";

export const metadata: Metadata = privatePageMetadata("دسته بندی ها");

export default function AdminCategoriesPage() {
  return (
    <RequireAuth requireAdmin>
      <AdminCategoriesPageClient />
    </RequireAuth>
  );
}
