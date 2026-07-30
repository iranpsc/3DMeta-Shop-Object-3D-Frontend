import type { Metadata } from "next";
import { RequireAuth } from "@/components/auth/RequireAuth";
import OrdersPageClient from "./OrdersPageClient";

export const metadata: Metadata = {
  title: "سفارشات",
};

export default function OrdersPage() {
  return (
    <RequireAuth>
      <OrdersPageClient />
    </RequireAuth>
  );
}
