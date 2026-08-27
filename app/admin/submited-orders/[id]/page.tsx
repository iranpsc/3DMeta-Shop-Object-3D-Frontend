import type { Metadata } from "next";
import { privatePageMetadata } from "@/lib/page-metadata";
import { RequireAuth } from "@/components/auth/RequireAuth";
import AdminSubmitOrderShowPageClient from "./AdminSubmitOrderShowPageClient";

export const metadata: Metadata = privatePageMetadata("جزئیات سفارش");

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminSubmitOrderShowPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <RequireAuth requireAdmin>
      <AdminSubmitOrderShowPageClient orderId={Number(id)} />
    </RequireAuth>
  );
}
