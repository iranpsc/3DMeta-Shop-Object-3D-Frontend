import type { Metadata } from "next";
import { privatePageMetadata } from "@/lib/page-metadata";
import { RequireAuth } from "@/components/auth/RequireAuth";
import OrdersPageClient from "./OrdersPageClient";

export const metadata: Metadata = privatePageMetadata("خریدها");

export default function OrdersPage() {
  return (
    <RequireAuth>
      <OrdersPageClient />
    </RequireAuth>
  );
}
