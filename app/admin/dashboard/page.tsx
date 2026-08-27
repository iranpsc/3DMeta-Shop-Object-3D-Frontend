import type { Metadata } from "next";
import { privatePageMetadata } from "@/lib/page-metadata";
import { RequireAuth } from "@/components/auth/RequireAuth";
import AdminDashboardPageClient from "./AdminDashboardPageClient";

export const metadata: Metadata = privatePageMetadata("داشبورد مدیریت");

export default function AdminDashboardPage() {
  return (
    <RequireAuth requireAdmin>
      <AdminDashboardPageClient />
    </RequireAuth>
  );
}
