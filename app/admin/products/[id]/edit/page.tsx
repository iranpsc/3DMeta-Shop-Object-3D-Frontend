import type { Metadata } from "next";
import { privatePageMetadata } from "@/lib/page-metadata";
import { RequireAuth } from "@/components/auth/RequireAuth";
import EditProductPageClient from "./EditProductPageClient";

export const metadata: Metadata = privatePageMetadata("ویرایش محصول");

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <RequireAuth requireAdmin>
      <EditProductPageClient productId={Number(id)} />
    </RequireAuth>
  );
}
