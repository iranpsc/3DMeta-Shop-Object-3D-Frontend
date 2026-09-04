"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { confirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyPage } from "@/components/ui/empty-page";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { TableSkeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { showErrorToast, showSuccessToast } from "@/components/ui/toast";
import { deleteAdminCategory, fetchAdminCategories } from "@/lib/admin-api";
import type { CategorySummary, Paginated } from "@/lib/types";

export default function AdminCategoriesPageClient() {
  const [categories, setCategories] = useState<Paginated<CategorySummary> | null>(null);
  const [page, setPage] = useState(1);
  const [pending, startTransition] = useTransition();

  const loadCategories = useCallback(() => {
    fetchAdminCategories(page)
      .then(setCategories)
      .catch(() => showErrorToast("بارگذاری دسته‌بندی‌ها با خطا مواجه شد."));
  }, [page]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  function handleDelete(categoryId: number) {
    startTransition(async () => {
      const confirmed = await confirmDialog({
        message: "آیا از حذف این دسته بندی مطمئن هستید؟",
      });
      if (!confirmed) return;

      try {
        const msg = await deleteAdminCategory(categoryId);
        showSuccessToast(msg ?? "دسته بندی حذف شد.");
        loadCategories();
      } catch {
        showErrorToast("حذف دسته بندی با خطا مواجه شد.");
      }
    });
  }

  const rows = categories?.data ?? [];

  return (
    <PageWrapper
      title="دسته‌بندی‌ها"
      actionBtn
      actionBtnLink="/admin/categories/create"
      actionBtnText="ایجاد دسته بندی"
    >
      {!categories ? (
        <TableSkeleton columns={5} headers={["ردیف", "نام", "نامک", "والد", "عملیات"]} />
      ) : rows.length > 0 ? (
        <>
          <Table>
            <TableHeader>
              <TableRow header>
                <TableHead>ردیف</TableHead>
                <TableHead>نام</TableHead>
                <TableHead>نامک</TableHead>
                <TableHead>والد</TableHead>
                <TableHead>عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((category, index) => (
                <TableRow key={category.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.slug}</TableCell>
                  <TableCell>{category.parent?.name ?? "—"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="admin"
                        size="sm"
                        href={`/admin/categories/${category.id}/edit`}
                      >
                        ویرایش
                      </Button>
                      {category.can_delete ? (
                        <Button
                          variant="danger"
                          size="sm"
                          disabled={pending}
                          onClick={() => handleDelete(category.id)}
                        >
                          حذف
                        </Button>
                      ) : null}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {categories ? (
            <Pagination currentPage={page} lastPage={categories.meta.last_page} onPageChange={setPage} />
          ) : null}
        </>
      ) : (
        <EmptyPage />
      )}
    </PageWrapper>
  );
}
