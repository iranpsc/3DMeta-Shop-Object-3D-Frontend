import type { Metadata } from "next";
import { privatePageMetadata } from "@/lib/page-metadata";
import { RequireAuth } from "@/components/auth/RequireAuth";
import AdminUsersPageClient from "./AdminUsersPageClient";

export const metadata: Metadata = privatePageMetadata("کاربران");

export default function AdminUsersPage() {
  return (
    <RequireAuth requireAdmin>
      <AdminUsersPageClient />
    </RequireAuth>
  );
}
