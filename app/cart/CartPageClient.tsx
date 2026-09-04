"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { CheckoutSteps } from "@/components/checkout/CheckoutSteps";
import { confirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyPage } from "@/components/ui/empty-page";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { CartSkeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { showErrorToast, showSuccessToast } from "@/components/ui/toast";
import {
  fetchCart,
  removeFromCart,
  updateCartItem,
} from "@/lib/cart-api";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/formatters";
import type { CartSnapshot, ProductCard } from "@/lib/types";

function getCartItemQuantity(cart: CartSnapshot, productId: number) {
  return cart.items.find((item) => item.product_id === productId)?.quantity ?? 1;
}

function CartRow({
  product,
  quantity,
  onQuantityChange,
  onRemove,
  busy,
}: {
  product: ProductCard;
  quantity: number;
  onQuantityChange: (qty: number) => void;
  onRemove: () => void;
  busy: boolean;
}) {
  const lineTotal = product.final_price * quantity;

  return (
    <TableRow>
      <TableCell style={{ paddingRight: 8 }}>
        <div className="flex items-center gap-3">
          <h5 className="mt-0 w-max pl-5">
            <Link href={`/products/${product.sku}`}>
              {product.name}
              <br />
              {product.sku}
            </Link>
          </h5>
        </div>
      </TableCell>
      <TableCell>{formatPrice(product.final_price)} ریال</TableCell>
      <TableCell style={{ paddingRight: 0, paddingTop: 20 }}>
        <div className="relative mx-auto flex flex-row justify-center rounded-lg bg-transparent">
          <Button
            variant="stepper"
            stepperSide="start"
            disabled={busy || quantity <= 1}
            onClick={() => onQuantityChange(quantity - 1)}
          >
            <span className="m-auto text-2xl font-thin">−</span>
          </Button>
          <input
            type="number"
            readOnly
            name="custom-input-number"
            className="flex h-12 w-10 items-center border-0 bg-white text-center text-md font-semibold text-[#3A4980] focus:border-0 focus:ring-0 dark:bg-black dark:text-white"
            value={quantity}
          />
          <Button
            variant="stepper"
            stepperSide="end"
            disabled={busy}
            onClick={() => onQuantityChange(quantity + 1)}
          >
            <span className="m-auto text-2xl font-thin">+</span>
          </Button>
        </div>
      </TableCell>
      <TableCell>{formatPrice(lineTotal)} ریال</TableCell>
      <TableCell>
        <Button
          variant="cart-remove"
          disabled={busy}
          onClick={onRemove}
          aria-label="حذف از سبد"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="35px" height="35px">
            <path
              className="dark:fill-white"
              d="M 28 6 C 25.791 6 24 7.791 24 10 L 24 12 L 23.599609 12 L 10 14 L 10 17 L 54 17 L 54 14 L 40.400391 12 L 40 12 L 40 10 C 40 7.791 38.209 6 36 6 L 28 6 z M 28 10 L 36 10 L 36 12 L 28 12 L 28 10 z M 12 19 L 14.701172 52.322266 C 14.869172 54.399266 16.605453 56 18.689453 56 L 45.3125 56 C 47.3965 56 49.129828 54.401219 49.298828 52.324219 L 51.923828 20 L 12 19 z M 20 26 C 21.105 26 22 26.895 22 28 L 22 51 L 19 51 L 18 28 C 18 26.895 18.895 26 20 26 z M 32 26 C 33.657 26 35 27.343 35 29 L 35 51 L 29 51 L 29 29 C 29 27.343 30.343 26 32 26 z M 44 26 C 45.105 26 46 26.895 46 28 L 45 51 L 42 51 L 42 28 C 42 26.895 42.895 26 44 26 z"
            />
          </svg>
        </Button>
      </TableCell>
    </TableRow>
  );
}

export default function CartPageClient() {
  const [cart, setCart] = useState<CartSnapshot | null>(null);
  const [pending, startTransition] = useTransition();
  const { setCount } = useCart();

  const loadCart = useCallback(() => {
    fetchCart()
      .then((data) => {
        setCart(data);
        setCount(data.count);
      })
      .catch(() => showErrorToast("بارگذاری سبد خرید با خطا مواجه شد."));
  }, [setCount]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  function handleQuantityChange(productId: number, quantity: number) {
    startTransition(async () => {
      try {
        const updated = await updateCartItem(productId, quantity);
        setCart(updated);
        setCount(updated.count);
      } catch {
        showErrorToast("به‌روزرسانی تعداد با خطا مواجه شد.");
      }
    });
  }

  function handleRemove(productId: number) {
    startTransition(async () => {
      const confirmed = await confirmDialog({
        message: "آیا از حذف این محصول از سبد خرید مطمئن هستید؟",
      });
      if (!confirmed) return;

      try {
        const { cart: updated, message: flash } = await removeFromCart(productId);
        setCart(updated);
        setCount(updated.count);
        showSuccessToast(flash ?? "محصول از سبد خرید حذف شد.");
      } catch {
        showErrorToast("حذف محصول با خطا مواجه شد.");
      }
    });
  }

  const hasItems = (cart?.count ?? 0) > 0;

  return (
    <PageWrapper title="سبد خرید">
      <style>{`
        table {
          width: 100%;
        }

        th,
        td {
          text-align: right;
          padding: 8px;
          padding-right: 50px;
        }
      `}</style>

      <div className="checkout wizard1 global-shadow radius-xl mb-30 w-full border-0 px-sm-50 pt-sm-50">
        {hasItems ? <CheckoutSteps activeStep={1} showActiveAsComplete /> : null}

        {cart && hasItems ? (
          <div className="mt-10 flex w-full flex-col gap-10">
            <Table
              id="cart"
              variant="plain"
              scrollable
              wrapperClassName="min-w-0"
            >
              <TableHeader>
                <TableRow
                  header
                  style={{ height: 60 }}
                  className="bg-[#EFEFEF] !rounded-[10px] dark:bg-black"
                >
                  <TableHead style={{ paddingRight: 8 }}>محصول</TableHead>
                  <TableHead>قیمت</TableHead>
                  <TableHead>تعداد</TableHead>
                  <TableHead>مجموع</TableHead>
                  <TableHead>عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.products.map((product) => (
                  <CartRow
                    key={product.id}
                    product={product}
                    quantity={getCartItemQuantity(cart, product.id)}
                    busy={pending}
                    onQuantityChange={(qty) => handleQuantityChange(product.id, qty)}
                    onRemove={() => handleRemove(product.id)}
                  />
                ))}
              </TableBody>
            </Table>

            <div className="w-full rounded-[10px] bg-[#EFEFEF] p-5 dark:bg-black">
              <div className="mt-5 flex flex-col gap-8">
                <div className="card-header border-bottom-0 p-0 pb-2">
                  <h5 className="fw-500">خلاصه سفارش</h5>
                </div>
                <div className="flex flex-col gap-3 rounded-[10px] bg-white p-5 dark:bg-[#1A1A18]">
                  <Table
                    variant="plain"
                    scrollable={false}
                    className="w-full border-separate border-0 stripped-cart-summary"
                  >
                    <TableHeader>
                      <TableRow header>
                        <TableHead className="py-2 pr-0 pl-3 text-right font-semibold">تخفیف</TableHead>
                        <TableHead className="py-2 text-left font-bold">مالیات</TableHead>
                        <TableHead className="py2 text-left font-bold">مجموع</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="text-primery-blue dark:text-[#E59819]">
                        <TableCell className="py-2 text-left font-bold">{formatPrice(0)} ریال</TableCell>
                        <TableCell className="py-2 text-left">{formatPrice(0)} تومان</TableCell>
                        <TableCell className="py-2 text-left">{formatPrice(cart.total_price)} تومان</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
             
                  <Button
                    variant="primary"
                    href="/checkout"
                    fullWidth
                    className="checkout mt-10 gap-2 py-3"
                  >
                    تسویه حساب
                    <i className="las la-arrow-left" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
    
        ) : cart ? (
          <EmptyPage />
        ) : (
          <CartSkeleton />
        )}
      </div>

    </PageWrapper>
  );
}
