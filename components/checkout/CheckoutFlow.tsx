"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { CheckoutSteps } from "@/components/checkout/CheckoutSteps";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { useToastMessage } from "@/lib/use-toast-message";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  checkoutAccountRedirect,
  fetchCheckout,
  initiateCheckoutPayment,
} from "@/lib/checkout-api";
import type { CheckoutState } from "@/lib/types";
import { formatPrice } from "@/lib/formatters";

function CreateAccountStep({
  onLogin,
  onRegister,
  busy,
}: {
  onLogin: () => void;
  onRegister: () => void;
  busy: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="xl:px-20">
        <CheckoutSteps activeStep={2} />
        <div className="row justify-content-center">
          <div className="col-xl-7 col-lg-8 col-sm-10">
            <div className="card checkout-shipping-form border-0 shadow-none">
              <div className="card-body">
                <div className="mt-10 flex flex-col items-center justify-center gap-5 md:flex-row">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <h6>اگر قبلا حساب کاربری ایجاد کرده اید، لطفا وارد شوید</h6>
                    <Button variant="success" size="lg" disabled={busy} onClick={onLogin}>
                      ورود
                    </Button>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-3">
                    <h6 className="mb-0">اگر قبلا حساب کاربری ایجاد نکرده اید، ثبت نام کنید</h6>
                    <Button variant="success" size="lg" disabled={busy} onClick={onRegister}>
                      ثبت نام
                    </Button>
                  </div>
                </div>
                <div className="mt-10 text-center">
                  <Link href="/cart" className="text-[#000BEE] dark:text-[#E59819]">
                    بازگشت به سبد خرید
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentStep({
  checkout,
  onBack,
  onPay,
  busy,
  error,
}: {
  checkout: CheckoutState;
  onBack: () => void;
  onPay: () => void;
  busy: boolean;
  error: string | null;
}) {
  useToastMessage(error, "error");

  return (
    <div>
      <CheckoutSteps activeStep={3} />

      <div className="row justify-content-center">
        <div className="col-xl-9 col-lg-10 col-12">
          <div className="card checkout-shipping-form border-0 shadow-none">
            <div className="card-body">
              <Table
                variant="plain"
                scrollable
                className="flex w-max flex-col gap-10 text-sm lg:w-full"
                wrapperClassName="mt-10 w-full"
              >
                <TableHeader className="w-full rounded-[10px] bg-[#EFEFEF] px-5 py-3 dark:bg-[#1A1A18]">
                  <TableRow header className="flex w-full justify-between text-right lg:gap-0">
                    <TableHead style={{ width: "20%" }}>#</TableHead>
                    <TableHead style={{ width: "20%" }}>محصول</TableHead>
                    <TableHead style={{ width: "20%" }}>قیمت هر واحد</TableHead>
                    <TableHead style={{ width: "20%" }}>تعداد</TableHead>
                    <TableHead style={{ width: "20%" }}>مجموع سفارش</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="flex flex-col gap-5 px-5">
                  {checkout.products.map((product, index) => {
                    const quantity =
                      checkout.items.find((i) => i.product_id === product.id)?.quantity ?? 1;
                    return (
                      <TableRow
                        key={product.id}
                        className="flex w-full items-center justify-between gap-10 text-right lg:gap-0"
                      >
                        <TableHead style={{ width: "20%" }}>{index + 1}</TableHead>
                        <TableCell style={{ width: "20%" }}>{product.name}</TableCell>
                        <TableCell style={{ width: "20%" }}>
                          {formatPrice(product.final_price)} تومان
                        </TableCell>
                        <TableCell style={{ width: "20%" }}>{quantity}</TableCell>
                        <TableCell style={{ width: "20%" }}>
                          {formatPrice(product.final_price * quantity)} تومان
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
                <TableFooter>
                  <TableRow className="my-5 flex items-center justify-end gap-10 text-xl">
                    <TableCell colSpan={3} />
                    <TableCell className="order-summery float-right border-0">
                      <h6>مجموع :</h6>
                    </TableCell>
                    <TableCell>
                      <h5 className="text-primary">{formatPrice(checkout.total_price)} تومان</h5>
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>

              <div className="my-5 flex w-full items-center justify-center gap-5">
                <Button variant="warning" size="lg" disabled={busy} onClick={onBack}>
                  بازگشت
                </Button>
                <Button variant="primary" size="lg" disabled={busy} onClick={onPay}>
                  {busy ? "در حال انتقال..." : "پرداخت"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CheckoutFlow() {
  const router = useRouter();
  const [checkout, setCheckout] = useState<CheckoutState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    fetchCheckout()
      .then(setCheckout)
      .catch((err: unknown) => {
        const msg =
          typeof err === "object" && err !== null && "message" in err
            ? String((err as { message: string }).message)
            : "بارگذاری تسویه حساب با خطا مواجه شد.";
        setError(msg);
      });
  }, []);

  useToastMessage(error, "error");

  function redirectAccount(action: "login" | "register") {
    startTransition(async () => {
      try {
        const { redirect_url } = await checkoutAccountRedirect(action);
        window.location.href = redirect_url;
      } catch {
        setError("انتقال به صفحه ورود با خطا مواجه شد.");
      }
    });
  }

  function handlePay() {
    startTransition(async () => {
      try {
        const { redirect_url } = await initiateCheckoutPayment();
        window.location.href = redirect_url;
      } catch (err: unknown) {
        const msg =
          typeof err === "object" && err !== null && "message" in err
            ? String((err as { message: string }).message)
            : "پرداخت با مشکل مواجه شد. لطفا مجددا تلاش کنید.";
        setError(msg);
      }
    });
  }

  if (!checkout && !error) {
    return (
      <PageWrapper title="تسویه حساب">
        <p className="text-center">در حال بارگذاری...</p>
      </PageWrapper>
    );
  }

  if (error && !checkout) {
    return (
      <PageWrapper title="تسویه حساب">
        <div className="text-center">
          <Link href="/cart" className="text-[#000BEE]">
            بازگشت به سبد خرید
          </Link>
        </div>
      </PageWrapper>
    );
  }

  if (!checkout) {
    return null;
  }

  return (
    <PageWrapper title="تسویه حساب">
      {checkout.step === "create-account" ? (
        <CreateAccountStep
          busy={pending}
          onLogin={() => redirectAccount("login")}
          onRegister={() => redirectAccount("register")}
        />
      ) : (
        <PaymentStep
          checkout={checkout}
          busy={pending}
          error={error}
          onBack={() => router.push("/cart")}
          onPay={handlePay}
        />
      )}
    </PageWrapper>
  );
}
