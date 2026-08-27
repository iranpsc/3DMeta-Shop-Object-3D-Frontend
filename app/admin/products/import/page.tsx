import type { Metadata } from "next";
import { privatePageMetadata } from "@/lib/page-metadata";
import { RequireAuth } from "@/components/auth/RequireAuth";
import ImportProductsPageClient from "./ImportProductsPageClient";

export const metadata: Metadata = privatePageMetadata("درون ریزی محصولات");

export default function ImportProductsPage() {
  return (
    <RequireAuth requireAdmin>
      <ImportProductsPageClient />
    </RequireAuth>
  );
}
