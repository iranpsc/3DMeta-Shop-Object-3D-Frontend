import type { Metadata } from "next";
import { RequireAuth } from "@/components/auth/RequireAuth";
import AdminSubmitOrdersPageClient from "./AdminSubmitOrdersPageClient";

export const metadata: Metadata = {
  title: "سفارشات ثبت شده",
};

export default function AdminSubmitOrdersPage() {
  return (
    <RequireAuth requireAdmin>
      <AdminSubmitOrdersPageClient />
    </RequireAuth>
  );
}
