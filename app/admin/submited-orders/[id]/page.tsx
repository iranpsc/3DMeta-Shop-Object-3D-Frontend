import type { Metadata } from "next";
import { RequireAuth } from "@/components/auth/RequireAuth";
import AdminSubmitOrderShowPageClient from "./AdminSubmitOrderShowPageClient";

export const metadata: Metadata = {
  title: "جزئیات سفارش",
};

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
