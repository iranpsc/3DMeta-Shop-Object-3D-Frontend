import type { Metadata } from "next";
import { privatePageMetadata } from "@/lib/page-metadata";
import { RequireAuth } from "@/components/auth/RequireAuth";
import AdminAttributesPageClient from "./AdminAttributesPageClient";

export const metadata: Metadata = privatePageMetadata("ویژگی ها");

export default function AdminAttributesPage() {
  return (
    <RequireAuth requireAdmin>
      <AdminAttributesPageClient />
    </RequireAuth>
  );
}
