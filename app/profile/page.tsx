import type { Metadata } from "next";
import { RequireAuth } from "@/components/auth/RequireAuth";
import ProfilePageClient from "./ProfilePageClient";

export const metadata: Metadata = {
  title: "ویرایش اطلاعات کاربری",
};

export default function ProfilePage() {
  return (
    <RequireAuth>
      <ProfilePageClient />
    </RequireAuth>
  );
}
