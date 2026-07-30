import type { Metadata } from "next";
import { RequireAuth } from "@/components/auth/RequireAuth";
import AvatarsPageClient from "./AvatarsPageClient";

export const metadata: Metadata = {
  title: "بارگذاری آواتار",
};

export default function AvatarsPage() {
  return (
    <RequireAuth>
      <AvatarsPageClient />
    </RequireAuth>
  );
}
