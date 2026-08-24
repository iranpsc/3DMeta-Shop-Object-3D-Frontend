import type { Metadata } from "next";
import { RequireAuth } from "@/components/auth/RequireAuth";
import ProfilePageClient from "./ProfilePageClient";

export const metadata: Metadata = {
  title: "پروفایل من",
};

export default function ProfilePage() {
  return (
    <RequireAuth>
      <ProfilePageClient />
    </RequireAuth>
  );
}
