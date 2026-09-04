"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, useTransition } from "react";
import { formatAdminDate, formatPrice } from "@/components/admin/admin-utils";
import { FormTextInput } from "@/components/form/text-input";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { confirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyPage } from "@/components/ui/empty-page";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { TableSkeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { showErrorToast, showSuccessToast } from "@/components/ui/toast";
import { deleteAdminProduct, fetchAdminProducts } from "@/lib/admin-api";
import { useDebounce } from "@/lib/use-debounce";
import type { AdminProduct, Paginated } from "@/lib/types";

export default function AdminProductsPageClient() {
  const [products, setProducts] = useState<Paginated<AdminProduct> | null>(null);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [page, setPage] = useState(1);
  const [pending, startTransition] = useTransition();

  const loadProducts = useCallback(() => {
    fetchAdminProducts(debouncedSearch, page)
      .then(setProducts)
      .catch(() => showErrorToast("بارگذاری محصولات با خطا مواجه شد."));
  }, [page, debouncedSearch]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  function handleDelete(productId: number) {
    startTransition(async () => {
      const confirmed = await confirmDialog({
        message: "آیا از حذف این محصول مطمئن هستید؟",
      });
      if (!confirmed) return;

      try {
        const msg = await deleteAdminProduct(productId);
        showSuccessToast(msg ?? "محصول حذف شد.");
        loadProducts();
      } catch {
        showErrorToast("حذف محصول با خطا مواجه شد.");
      }
    });
  }

  const rows = products?.data ?? [];

  return (
    <PageWrapper title="محصولات">
      <FormTextInput
        name="search"
        value={search}
        onChange={(event) => {
          setSearch(event.target.value);
          setPage(1);
        }}
        placeholder="نام محصول را وارد کنید ..."
        wrapperClassName="mb-5"
      />

      {!products ? (
        <TableSkeleton
          columns={9}
          headers={[
            "ردیف",
            "نام",
            "نامک",
            "قیمت",
            "قیمت ویژه",
            "دسته بندی",
            "وضعیت",
            "تاریخ ایجاد",
            "عملیات",
          ]}
        />
      ) : rows.length > 0 ? (
        <>
          <Table>
            <TableHeader>
              <TableRow header>
                <TableHead>ردیف</TableHead>
                <TableHead>نام</TableHead>
                <TableHead>نامک</TableHead>
                <TableHead>قیمت</TableHead>
                <TableHead>قیمت ویژه</TableHead>
                <TableHead>دسته بندی</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead>تاریخ ایجاد</TableHead>
                <TableHead>عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((product, index) => (
                <TableRow key={product.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {product.name}
                    <br />
                    {product.sku}
                  </TableCell>
                  <TableCell>{product.slug}</TableCell>
                  <TableCell>{formatPrice(product.price)}</TableCell>
                  <TableCell>{formatPrice(product.sale_price)}</TableCell>
                  <TableCell>{product.category?.name ?? "بدون دسته بندی"}</TableCell>
                  <TableCell>{product.published ? "منتشر شده" : "منتشر نشده"}</TableCell>
                  <TableCell>{formatAdminDate(product.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="admin"
                        size="sm"
                        href={`/admin/products/${product.id}/edit`}
                        className="bg-[#0EBDE2] text-sm font-bold"
                      >
                        ویرایش
                      </Button>
                      <Button
                        variant="admin"
                        size="sm"
                        href={product.url}
                        className="text-sm font-bold"
                      >
                        جزییات
                      </Button>
                      {product.can_delete ? (
                        <Button
                          variant="danger"
                          size="sm"
                          disabled={pending}
                          onClick={() => handleDelete(product.id)}
                          className="text-sm font-bold"
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
          {products ? (
            <Pagination currentPage={page} lastPage={products.meta.last_page} onPageChange={setPage} />
          ) : null}
        </>
      ) : (
        <EmptyPage />
      )}
    </PageWrapper>
  );
}
