"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckoutSteps } from "@/components/checkout/CheckoutSteps";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToastMessage } from "@/lib/use-toast-message";
import { verifyCheckoutPayment } from "@/lib/checkout-api";
import type { VerifyPaymentResult } from "@/lib/types";

type Props = {
  params: Record<string, string>;
};

export function VerifyPayment({ params }: Props) {
  const [result, setResult] = useState<VerifyPaymentResult | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.Token) {
      setError("تراکنش مورد نظر یافت نشد.");
      setLoading(false);
      return;
    }

    verifyCheckoutPayment(params)
      .then(({ result: data, message: flash }) => {
        setResult(data);
        setMessage(flash ?? null);
        if (!data.success) {
          setError("پرداخت ناموفق بود.");
        }
      })
      .catch((err: unknown) => {
        const msg =
          typeof err === "object" && err !== null && "message" in err
            ? String((err as { message: string }).message)
            : "تراکنش مورد نظر یافت نشد.";
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, [params]);

  useToastMessage(error, "error");
  useToastMessage(result?.success ? (message ?? "پرداخت شما با موفقیت انجام شد.") : null, "success");

  const paymentSuccess = result ? result.success : null;

  return (
    <PageWrapper title="نتیجه پرداخت">
      <div className="flex flex-col items-center justify-center">
        <div className="w-full">
          <CheckoutSteps activeStep={4} paymentSuccess={paymentSuccess} />

          <div className="row justify-content-center">
            <div className="col-12">
              <div className="card checkout-shipping-form border-0 shadow-none">
                <div className="card-body">
                  {loading ? (
                    <p className="my-5 text-center">در حال بررسی پرداخت...</p>
                  ) : (
                    <>
                      {result?.success && result.reference_id ? (
                        <p className="my-5 text-center">
                          کد پیگیری پرداخت: {result.reference_id}
                        </p>
                      ) : null}

                      {result?.success && result.products && result.products.length > 0 ? (
                        <div className="userDatatable orderDatatable shipped-dataTable global-shadow">
                          <Table
                            variant="plain"
                            scrollable
                            className="flex flex-col gap-10 lg:w-full"
                            wrapperClassName="w-full"
                          >
                            <TableHeader className="w-max rounded-[10px] bg-[#EFEFEF] px-5 py-3 dark:bg-[#4A4E7C] lg:w-full">
                              <TableRow
                                header
                                className="flex w-full justify-between space-x-10 lg:space-x-0"
                              >
                                <TableHead>ردیف</TableHead>
                                <TableHead>شناسه سفارش</TableHead>
                                <TableHead>نام محصول</TableHead>
                                <TableHead>دانلود</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody className="flex flex-col gap-5 lg:px-5">
                              {result.products.map((product, index) => (
                                <TableRow
                                  key={product.id}
                                  className="flex w-full items-center justify-between gap-10 lg:gap-0"
                                >
                                  <TableCell>{index + 1}</TableCell>
                                  <TableCell>{result.tracking_id}</TableCell>
                                  <TableCell>{product.name}</TableCell>
                                  <TableCell>
                                    {product.files.length > 0 ? (
                                      <div className="flex flex-col gap-2">
                                        {product.files.map((file) => (
                                          <a
                                            key={file.id}
                                            href={file.url}
                                            className="text-[#000BEE] dark:text-[#E59819]"
                                          >
                                            <i className="uil uil-download-alt" /> دانلود
                                          </a>
                                        ))}
                                      </div>
                                    ) : (
                                      <Link
                                        href={product.url}
                                        className="text-[#000BEE] dark:text-[#E59819]"
                                      >
                                        مشاهده محصول
                                      </Link>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      ) : null}

                      {!loading && !result?.success ? (
                        <div className="my-5 text-center">
                          <Link href="/cart" className="text-[#000BEE]">
                            بازگشت به سبد خرید
                          </Link>
                        </div>
                      ) : null}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
