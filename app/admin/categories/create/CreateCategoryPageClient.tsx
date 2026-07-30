"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { FormTextInput } from "@/components/form/text-input";
import { FormTextarea } from "@/components/form/textarea";
import { formControlClassName } from "@/components/form/form-control-classes";
import { Button } from "@/components/ui/button";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { showErrorToast, showSuccessToast } from "@/components/ui/toast";
import { createAdminCategory, fetchAdminCategoryFormData } from "@/lib/admin-api";
import type { CategorySummary } from "@/lib/types";

export default function CreateCategoryPageClient() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    fetchAdminCategoryFormData()
      .then(setCategories)
      .catch(() => showErrorToast("بارگذاری دسته‌بندی‌ها با خطا مواجه شد."));
  }, []);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    startTransition(async () => {
      try {
        const result = await createAdminCategory(form);
        showSuccessToast(result.message ?? "دسته بندی ایجاد شد.");
        router.push("/admin/categories");
      } catch {
        showErrorToast("ایجاد دسته بندی با خطا مواجه شد.");
      }
    });
  }

  return (
    <PageWrapper title="ایجاد دسته بندی جدید">
      <form onSubmit={handleSubmit} className="grid max-w-3xl gap-5">
        <FormTextInput name="name" label="نام" placeholder="نام" required />
        <FormTextInput name="slug" label="نامک" placeholder="نامک" required />
        <label className="flex flex-col gap-3">
          <span className="form-col-label col-sm-4">والد</span>
          <select name="parent_id" className={formControlClassName} defaultValue="">
            <option value="">بدون والد</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <FormTextarea name="description" label="توضیحات" placeholder="توضیحات" required />
        <label className="flex flex-col gap-3">
          <span className="form-col-label col-sm-4">تصویر</span>
          <input name="image" type="file" accept="image/*" className={formControlClassName} />
        </label>
        <Button type="submit" variant="admin" size="lg" disabled={pending} className="w-max">
          ذخیره
        </Button>
      </form>
    </PageWrapper>
  );
}
