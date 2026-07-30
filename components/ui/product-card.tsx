"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { addToCart } from "@/lib/cart-api";
import { useCart } from "@/lib/cart-context";
import type { ProductCard } from "@/lib/types";
import { formatPrice as formatNumber } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import { showErrorToast, showSuccessToast } from "@/components/ui/toast";

const DEFAULT_IMAGE = "/home-page/images/default.jpg";

function formatPrice(product: ProductCard): string {
  if (product.is_free) {
    return "رایگان";
  }
  return `${formatNumber(product.final_price)} ریال`;
}

type ProductCardProps = {
  product: ProductCard;
};

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.image?.url ?? DEFAULT_IMAGE;
  const category = product.category;
  const [inCart, setInCart] = useState(false);
  const [cartPending, startCartTransition] = useTransition();
  const { setCount } = useCart();

  function handleAddToCart() {
    startCartTransition(async () => {
      try {
        const { cart, message } = await addToCart(product.id);
        setInCart(true);
        setCount(cart.count);
        if (message) {
          showSuccessToast(message);
        }
      } catch (err: unknown) {
        const msg =
          typeof err === "object" && err !== null && "message" in err
            ? String((err as { message: string }).message)
            : "افزودن به سبد خرید با خطا مواجه شد.";
        showErrorToast(msg);
      }
    });
  }

  return (
    <div className="product w-full">
      <div className="flex w-full flex-col items-center justify-between gap-2 overflow-hidden rounded-xl bg-white text-center transition-all duration-500 dark:bg-[#1A1A18]">
        <Link
          href={product.url}
          className="mt-4 overflow-hidden rounded-lg"
          style={{ width: "90%" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            className="w-full"
            onError={(e) => {
              e.currentTarget.src = DEFAULT_IMAGE;
            }}
          />
        </Link>
        <div className="flex w-full flex-col items-center justify-center gap-3 p-3">
          <p className="m-0 p-0 text-xs font-bold text-[#000BEE] lg:text-sm dark:text-[#D1D1D1]">
            {category?.parent ? (
              <>
                <Link href={category.parent.url}>{category.parent.name}</Link>
                {" / "}
              </>
            ) : null}
            {category ? <Link href={category.url}>{category.name}</Link> : null}
          </p>
          <p className="m-0 p-0 text-xs font-bold text-[#000BEE] lg:text-sm dark:text-[#D1D1D1]">
            {product.sku}
          </p>
          <Link
            href={product.url}
            className="text-sm font-bold text-stone-800 lg:text-xl dark:text-white"
          >
            {product.name}
          </Link>
          <p className="text-sm font-bold text-stone-800 lg:text-xl dark:text-white">
            {formatPrice(product)}
          </p>
          <div className="flex w-full justify-between gap-2">
            {product.is_free ? (
              <Button
                variant="cart-view"
                href={product.url}
                className="m-0 w-full px-2 py-3"
              >
                مشاهده سریع
              </Button>
            ) : (
              <>
                <Button
                  variant="cart-add"
                  disabled={inCart || cartPending}
                  onClick={handleAddToCart}
                  className="m-0 w-[60%] px-2 py-3"
                >
                  {inCart ? "در سبد خرید" : "افزودن به سبد خرید"}
                </Button>
                <Button
                  variant="cart-view"
                  href={product.url}
                  className="z-10 m-0 w-[40%] px-2 py-3"
                >
                  مشاهده سریع
                </Button>
              </>
            )}
          </div>
     
        </div>
      </div>
    </div>
  );
}
