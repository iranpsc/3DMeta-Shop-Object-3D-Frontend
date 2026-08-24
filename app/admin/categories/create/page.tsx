import type { Metadata } from "next";
import { RequireAuth } from "@/components/auth/RequireAuth";
import CreateCategoryPageClient from "./CreateCategoryPageClient";

export const metadata: Metadata = {
  title: "ایجاد دسته بندی",
};

export default function CreateCategoryPage() {
  return (
    <RequireAuth requireAdmin>
      <CreateCategoryPageClient />
    </RequireAuth>
  );
}
