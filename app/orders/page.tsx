import type { Metadata } from "next";
import { RequireAuth } from "@/components/auth/RequireAuth";
import OrdersPageClient from "./OrdersPageClient";

export const metadata: Metadata = {
  title: "خریدها",
};

export default function OrdersPage() {
  return (
    <RequireAuth>
      <OrdersPageClient />
    </RequireAuth>
  );
}
