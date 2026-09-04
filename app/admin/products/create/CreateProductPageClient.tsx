"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { ProductForm } from "@/components/admin/ProductForm";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { FormSkeleton } from "@/components/ui/skeleton";
import { showErrorToast, showSuccessToast } from "@/components/ui/toast";
import { createAdminProduct, fetchAdminProductFormData } from "@/lib/admin-api";
import type { AdminProductFormData } from "@/lib/types";

export default function CreateProductPageClient() {
  const router = useRouter();
  const [formData, setFormData] = useState<AdminProductFormData | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    fetchAdminProductFormData()
      .then(setFormData)
      .catch(() => showErrorToast("بارگذاری فرم با خطا مواجه شد."));
  }, []);

  function handleSubmit(form: FormData) {
    startTransition(async () => {
      try {
        const result = await createAdminProduct(form);
        showSuccessToast(result.message ?? "محصول ایجاد شد.");
        router.push("/admin/products");
      } catch {
        showErrorToast("ایجاد محصول با خطا مواجه شد.");
      }
    });
  }

  return (
    <PageWrapper title="ایجاد محصول">
      {!formData ? (
        <FormSkeleton fields={8} columns={2} />
      ) : (
        <ProductForm
          formData={formData}
          onSubmit={handleSubmit}
          pending={pending}
          submitLabel="ذخیره محصول"
        />
      )}
    </PageWrapper>
  );
}
