"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { FormTextInput } from "@/components/form/text-input";
import { FormTextarea } from "@/components/form/textarea";
import { formControlClassName } from "@/components/form/form-control-classes";
import { Button } from "@/components/ui/button";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { FormSkeleton } from "@/components/ui/skeleton";
import { useToastMessage } from "@/lib/use-toast-message";
import {
  fetchAdminCategory,
  fetchAdminCategoryFormData,
  updateAdminCategory,
} from "@/lib/admin-api";
import type { CategorySummary } from "@/lib/types";

type EditCategoryPageClientProps = {
  categoryId: number;
};

export default function EditCategoryPageClient({ categoryId }: EditCategoryPageClientProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [category, setCategory] = useState<CategorySummary | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    Promise.all([fetchAdminCategoryFormData(), fetchAdminCategory(categoryId)])
      .then(([allCategories, current]) => {
        setCategories(allCategories);
        setCategory(current);
      })
      .catch(() => setError("بارگذاری دسته بندی با خطا مواجه شد."));
  }, [categoryId]);

  useToastMessage(message, "success");
  useToastMessage(error, "error");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    startTransition(async () => {
      try {
        const result = await updateAdminCategory(categoryId, form);
        setMessage(result.message ?? "دسته بندی ویرایش شد.");
        setCategory(result.category);
      } catch {
        setError("ویرایش دسته بندی با خطا مواجه شد.");
      }
    });
  }

  if (!category) {
    return (
      <PageWrapper title="ویرایش دسته بندی">
        <FormSkeleton fields={4} />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="ویرایش دسته بندی">
      <form onSubmit={handleSubmit} className="grid max-w-3xl gap-5">
        <FormTextInput
          name="name"
          label="نام"
          defaultValue={category.name}
          required
        />
        <FormTextInput
          name="slug"
          label="نامک"
          defaultValue={category.slug}
          required
        />
        <label className="flex flex-col gap-3">
          <span className="form-col-label col-sm-4">والد</span>
          <select name="parent_id" className={formControlClassName} defaultValue={category.parent?.id ?? ""}>
            <option value="">بدون والد</option>
            {categories
              .filter((item) => item.id !== category.id)
              .map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
          </select>
        </label>
        <FormTextarea
          name="description"
          label="توضیحات"
          defaultValue={category.description ?? ""}
          required
        />
        <label className="flex flex-col gap-3">
          <span className="form-col-label col-sm-4">تصویر</span>
          <input name="image" type="file" accept="image/*" className={formControlClassName} />
        </label>
        <Button type="submit" variant="admin" size="lg" disabled={pending} className="w-max">
          بروزرسانی
        </Button>
      </form>

      <Button variant="neutral" onClick={() => router.push("/admin/categories")} className="mt-6">
        بازگشت
      </Button>
    </PageWrapper>
  );
}
