import type { Metadata } from "next";
import { privatePageMetadata } from "@/lib/page-metadata";
import { RequireAuth } from "@/components/auth/RequireAuth";
import EditCategoryPageClient from "./EditCategoryPageClient";

export const metadata: Metadata = privatePageMetadata("ویرایش دسته بندی");

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCategoryPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <RequireAuth requireAdmin>
      <EditCategoryPageClient categoryId={Number(id)} />
    </RequireAuth>
  );
}
