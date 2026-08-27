import type { Metadata } from "next";
import { privatePageMetadata } from "@/lib/page-metadata";
import { RequireAuth } from "@/components/auth/RequireAuth";
import AdminContactMessagesPageClient from "./AdminContactMessagesPageClient";

export const metadata: Metadata = privatePageMetadata("پیام های دریافتی");

export default function AdminContactMessagesPage() {
  return (
    <RequireAuth requireAdmin>
      <AdminContactMessagesPageClient />
    </RequireAuth>
  );
}
