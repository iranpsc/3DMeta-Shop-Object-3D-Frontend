import type { Metadata } from "next";
import { RequireAuth } from "@/components/auth/RequireAuth";
import AdminDashboardPageClient from "./AdminDashboardPageClient";

export const metadata: Metadata = {
  title: "داشبورد مدیریت",
};

export default function AdminDashboardPage() {
  return (
    <RequireAuth requireAdmin>
      <AdminDashboardPageClient />
    </RequireAuth>
  );
}
