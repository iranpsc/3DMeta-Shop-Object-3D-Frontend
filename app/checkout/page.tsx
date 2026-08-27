import type { Metadata } from "next";
import { privatePageMetadata } from "@/lib/page-metadata";
import { CheckoutFlow } from "@/components/checkout/CheckoutFlow";

export const metadata: Metadata = privatePageMetadata("تسویه حساب");

export default function CheckoutPage() {
  return <CheckoutFlow />;
}
