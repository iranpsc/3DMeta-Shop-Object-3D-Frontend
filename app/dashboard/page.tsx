import type { Metadata } from "next";
import { privatePageMetadata } from "@/lib/page-metadata";
import { RequireAuth } from "@/components/auth/RequireAuth";
import DashboardPageClient from "./DashboardPageClient";

export const metadata: Metadata = privatePageMetadata("داشبورد");

export default function DashboardPage() {
  return (
    <RequireAuth>
      <DashboardPageClient />
    </RequireAuth>
  );
}
