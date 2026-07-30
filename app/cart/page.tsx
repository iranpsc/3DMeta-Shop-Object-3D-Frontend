import type { Metadata } from "next";
import CartPage from "./CartPageClient";

export const metadata: Metadata = {
  title: "سبد خرید",
};

export default function Page() {
  return <CartPage />;
}
