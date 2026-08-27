import type { Metadata } from "next";
import { privatePageMetadata } from "@/lib/page-metadata";
import { RequireAuth } from "@/components/auth/RequireAuth";
import CreateCategoryPageClient from "./CreateCategoryPageClient";

export const metadata: Metadata = privatePageMetadata("ایجاد دسته بندی");

export default function CreateCategoryPage() {
  return (
    <RequireAuth requireAdmin>
      <CreateCategoryPageClient />
    </RequireAuth>
  );
}
