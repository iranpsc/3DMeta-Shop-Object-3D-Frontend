import type { Metadata } from "next";
import { RequireAuth } from "@/components/auth/RequireAuth";
import AdminCategoriesPageClient from "./AdminCategoriesPageClient";

export const metadata: Metadata = {
  title: "دسته بندی ها",
};

export default function AdminCategoriesPage() {
  return (
    <RequireAuth requireAdmin>
      <AdminCategoriesPageClient />
    </RequireAuth>
  );
}
