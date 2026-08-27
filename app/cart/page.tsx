import type { Metadata } from "next";
import { privatePageMetadata } from "@/lib/page-metadata";
import CartPage from "./CartPageClient";

export const metadata: Metadata = privatePageMetadata("سبد خرید");

export default function Page() {
  return <CartPage />;
}
