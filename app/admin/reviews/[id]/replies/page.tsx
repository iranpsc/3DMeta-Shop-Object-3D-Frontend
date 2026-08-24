import type { Metadata } from "next";
import { RequireAuth } from "@/components/auth/RequireAuth";
import AdminReviewRepliesPageClient from "./AdminReviewRepliesPageClient";

export const metadata: Metadata = {
  title: "پاسخ های کاربران",
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminReviewRepliesPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <RequireAuth requireAdmin>
      <AdminReviewRepliesPageClient reviewId={Number(id)} />
    </RequireAuth>
  );
}
