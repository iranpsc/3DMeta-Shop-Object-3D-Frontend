import type { Metadata } from "next";
import { RequireAuth } from "@/components/auth/RequireAuth";
import AdminReviewsPageClient from "./AdminReviewsPageClient";

export const metadata: Metadata = {
  title: "دیدگاه های کاربران",
};

export default function AdminReviewsPage() {
  return (
    <RequireAuth requireAdmin>
      <AdminReviewsPageClient />
    </RequireAuth>
  );
}
