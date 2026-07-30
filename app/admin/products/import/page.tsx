import type { Metadata } from "next";
import { RequireAuth } from "@/components/auth/RequireAuth";
import ImportProductsPageClient from "./ImportProductsPageClient";

export const metadata: Metadata = {
  title: "درون ریزی محصولات",
};

export default function ImportProductsPage() {
  return (
    <RequireAuth requireAdmin>
      <ImportProductsPageClient />
    </RequireAuth>
  );
}
