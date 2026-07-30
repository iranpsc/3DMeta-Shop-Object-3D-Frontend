import type { Metadata } from "next";
import { RequireAuth } from "@/components/auth/RequireAuth";
import AdminAttributesPageClient from "./AdminAttributesPageClient";

export const metadata: Metadata = {
  title: "ویژگی ها",
};

export default function AdminAttributesPage() {
  return (
    <RequireAuth requireAdmin>
      <AdminAttributesPageClient />
    </RequireAuth>
  );
}
