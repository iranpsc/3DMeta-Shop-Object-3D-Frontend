import type { Metadata } from "next";
import { privatePageMetadata } from "@/lib/page-metadata";
import { RequireAuth } from "@/components/auth/RequireAuth";
import AdminTagsPageClient from "./AdminTagsPageClient";

export const metadata: Metadata = privatePageMetadata("برچسب ها");

export default function AdminTagsPage() {
  return (
    <RequireAuth requireAdmin>
      <AdminTagsPageClient />
    </RequireAuth>
  );
}
