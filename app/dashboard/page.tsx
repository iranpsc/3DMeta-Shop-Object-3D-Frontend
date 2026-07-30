import type { Metadata } from "next";
import { RequireAuth } from "@/components/auth/RequireAuth";
import DashboardPageClient from "./DashboardPageClient";

export const metadata: Metadata = {
  title: "داشبورد",
};

export default function DashboardPage() {
  return (
    <RequireAuth>
      <DashboardPageClient />
    </RequireAuth>
  );
}
