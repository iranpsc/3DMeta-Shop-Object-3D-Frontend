import type { Metadata } from "next";
import { privatePageMetadata } from "@/lib/page-metadata";
import { RequireAuth } from "@/components/auth/RequireAuth";
import ProfilePageClient from "./ProfilePageClient";

export const metadata: Metadata = privatePageMetadata("پروفایل من");

export default function ProfilePage() {
  return (
    <RequireAuth>
      <ProfilePageClient />
    </RequireAuth>
  );
}
