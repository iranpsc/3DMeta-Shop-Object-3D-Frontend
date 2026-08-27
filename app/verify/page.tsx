import type { Metadata } from "next";
import { privatePageMetadata } from "@/lib/page-metadata";
import { VerifyPayment } from "@/components/checkout/VerifyPayment";

export const metadata: Metadata = privatePageMetadata("نتیجه پرداخت");

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function VerifyPage({ searchParams }: Props) {
  const params = await searchParams;
  const query: Record<string, string> = {};

  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") {
      query[key] = value;
    } else if (Array.isArray(value) && value[0]) {
      query[key] = value[0];
    }
  }

  return <VerifyPayment params={query} />;
}
