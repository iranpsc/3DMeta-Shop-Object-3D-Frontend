import type { Metadata } from "next";
import { privatePageMetadata } from "@/lib/page-metadata";
import { RequireAuth } from "@/components/auth/RequireAuth";
import OrderDetailsPageClient from "./OrderDetailsPageClient";

export const metadata: Metadata = privatePageMetadata("جزئیات سفارش");

type Props = {
  params: Promise<{ order: string }>;
};

export default async function OrderDetailsPage({ params }: Props) {
  const { order } = await params;
  return (
    <RequireAuth>
      <OrderDetailsPageClient orderId={order} />
    </RequireAuth>
  );
}
