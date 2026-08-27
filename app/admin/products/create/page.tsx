import type { Metadata } from "next";
import { privatePageMetadata } from "@/lib/page-metadata";
import { RequireAuth } from "@/components/auth/RequireAuth";
import CreateProductPageClient from "./CreateProductPageClient";

export const metadata: Metadata = privatePageMetadata("ایجاد محصول");

export default function CreateProductPage() {
  return (
    <RequireAuth requireAdmin>
      <CreateProductPageClient />
    </RequireAuth>
  );
}
