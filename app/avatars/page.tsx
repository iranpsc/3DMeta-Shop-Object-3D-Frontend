import type { Metadata } from "next";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { JsonLd } from "@/components/seo/JsonLd";
import { avatarsMetadata } from "@/lib/page-metadata";
import { buildAvatarsPageSchema } from "@/lib/seo-schemas";
import AvatarsPageClient from "./AvatarsPageClient";

export const metadata: Metadata = avatarsMetadata;

export default async function AvatarsPage() {
  return (
    <>
      <JsonLd data={await buildAvatarsPageSchema()} />
      <RequireAuth>
        <AvatarsPageClient />
      </RequireAuth>
    </>
  );
}
