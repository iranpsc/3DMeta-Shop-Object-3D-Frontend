import type { Metadata } from "next";
import { RequireAuth } from "@/components/auth/RequireAuth";
import AdminUsersPageClient from "./AdminUsersPageClient";

export const metadata: Metadata = {
  title: "کاربران",
};

export default function AdminUsersPage() {
  return (
    <RequireAuth requireAdmin>
      <AdminUsersPageClient />
    </RequireAuth>
  );
}
