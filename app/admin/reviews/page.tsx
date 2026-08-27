import type { Metadata } from "next";
import { privatePageMetadata } from "@/lib/page-metadata";
import { RequireAuth } from "@/components/auth/RequireAuth";
import AdminReviewsPageClient from "./AdminReviewsPageClient";

export const metadata: Metadata = privatePageMetadata("دیدگاه های کاربران");

export default function AdminReviewsPage() {
  return (
    <RequireAuth requireAdmin>
      <AdminReviewsPageClient />
    </RequireAuth>
  );
}
