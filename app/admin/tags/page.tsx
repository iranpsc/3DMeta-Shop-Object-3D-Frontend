import type { Metadata } from "next";
import { RequireAuth } from "@/components/auth/RequireAuth";
import AdminTagsPageClient from "./AdminTagsPageClient";

export const metadata: Metadata = {
  title: "برچسب ها",
};

export default function AdminTagsPage() {
  return (
    <RequireAuth requireAdmin>
      <AdminTagsPageClient />
    </RequireAuth>
  );
}
