import type { Metadata } from "next";
import { RequireAuth } from "@/components/auth/RequireAuth";
import CreateProductPageClient from "./CreateProductPageClient";

export const metadata: Metadata = {
  title: "محصول جدید",
};

export default function CreateProductPage() {
  return (
    <RequireAuth requireAdmin>
      <CreateProductPageClient />
    </RequireAuth>
  );
}
