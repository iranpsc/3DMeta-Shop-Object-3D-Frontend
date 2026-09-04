"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { ProductForm } from "@/components/admin/ProductForm";
import { Button } from "@/components/ui/button";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { FormSkeleton } from "@/components/ui/skeleton";
import { useToastMessage } from "@/lib/use-toast-message";
import {
  fetchAdminProduct,
  fetchAdminProductFormData,
  updateAdminProduct,
} from "@/lib/admin-api";
import type { AdminProduct, AdminProductFormData } from "@/lib/types";

type EditProductPageClientProps = {
  productId: number;
};

export default function EditProductPageClient({ productId }: EditProductPageClientProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<AdminProductFormData | null>(null);
  const [product, setProduct] = useState<AdminProduct | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    Promise.all([fetchAdminProductFormData(), fetchAdminProduct(productId)])
      .then(([options, current]) => {
        setFormData(options);
        setProduct(current);
      })
      .catch(() => setError("بارگذاری محصول با خطا مواجه شد."));
  }, [productId]);

  useToastMessage(message, "success");
  useToastMessage(error, "error");

  function handleSubmit(form: FormData) {
    startTransition(async () => {
      try {
        const result = await updateAdminProduct(productId, form);
        setMessage(result.message ?? "محصول بروزرسانی شد.");
        setProduct(result.product);
      } catch {
        setError("ویرایش محصول با خطا مواجه شد.");
      }
    });
  }

  return (
    <PageWrapper title="ویرایش محصول">
      {!formData || !product ? (
        <FormSkeleton fields={8} columns={2} />
      ) : (
        <ProductForm
          formData={formData}
          initial={product}
          onSubmit={handleSubmit}
          pending={pending}
          submitLabel="بروزرسانی محصول"
        />
      )}
      <div className="mt-6">
        <Button variant="neutral" onClick={() => router.push("/admin/products")}>
          بازگشت
        </Button>
      </div>
    </PageWrapper>
  );
}
