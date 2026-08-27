import type { Metadata } from "next";
import { privatePageMetadata } from "@/lib/page-metadata";
import { RequireAuth } from "@/components/auth/RequireAuth";
import AdminSubmitOrdersPageClient from "./AdminSubmitOrdersPageClient";

export const metadata: Metadata = privatePageMetadata("سفارشات ثبت شده");

export default function AdminSubmitOrdersPage() {
  return (
    <RequireAuth requireAdmin>
      <AdminSubmitOrdersPageClient />
    </RequireAuth>
  );
}
