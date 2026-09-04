"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { formatAdminDate } from "@/components/admin/admin-utils";
import { FormTextInput } from "@/components/form/text-input";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { confirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyPage } from "@/components/ui/empty-page";
import { Modal } from "@/components/ui/modal";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { TableSkeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { showErrorToast, showSuccessToast } from "@/components/ui/toast";
import { createAdminAttribute, deleteAdminAttribute, fetchAdminAttributes } from "@/lib/admin-api";
import type { AdminAttribute, Paginated } from "@/lib/types";

export default function AdminAttributesPageClient() {
  const [attributes, setAttributes] = useState<Paginated<AdminAttribute> | null>(null);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [pending, startTransition] = useTransition();

  const loadAttributes = useCallback(() => {
    fetchAdminAttributes(page)
      .then(setAttributes)
      .catch(() => showErrorToast("بارگذاری ویژگی‌ها با خطا مواجه شد."));
  }, [page]);

  useEffect(() => {
    loadAttributes();
  }, [loadAttributes]);

  function handleCreate() {
    startTransition(async () => {
      try {
        const result = await createAdminAttribute({ name, slug });
        showSuccessToast(result.message ?? "ویژگی ایجاد شد.");
        setModalOpen(false);
        setName("");
        setSlug("");
        loadAttributes();
      } catch {
        showErrorToast("ایجاد ویژگی با خطا مواجه شد.");
      }
    });
  }

  function handleDelete(attributeId: number) {
    startTransition(async () => {
      const confirmed = await confirmDialog({
        message: "آیا از حذف این ویژگی مطمئن هستید؟",
      });
      if (!confirmed) return;

      try {
        await deleteAdminAttribute(attributeId);
        showSuccessToast("ویژگی حذف شد.");
        loadAttributes();
      } catch {
        showErrorToast("حذف ویژگی با خطا مواجه شد.");
      }
    });
  }

  const rows = attributes?.data ?? [];

  return (
    <PageWrapper title="ویژگی ها" actionBtn actionBtnText="ایجاد ویژگی جدید" onActionClick={() => setModalOpen(true)}>
      {!attributes ? (
        <TableSkeleton columns={5} headers={["ردیف", "نام", "نامک", "تاریخ ایجاد", "عملیات"]} />
      ) : rows.length > 0 ? (
        <>
          <Table>
            <TableHeader>
              <TableRow header>
                <TableHead>ردیف</TableHead>
                <TableHead>نام</TableHead>
                <TableHead>نامک</TableHead>
                <TableHead>تاریخ ایجاد</TableHead>
                <TableHead>عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((attribute, index) => (
                <TableRow key={attribute.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{attribute.name}</TableCell>
                  <TableCell>{attribute.slug}</TableCell>
                  <TableCell>{formatAdminDate(attribute.created_at)}</TableCell>
                  <TableCell>
                    {attribute.can_delete ? (
                      <Button
                        variant="danger"
                        size="sm"
                        disabled={pending}
                        onClick={() => handleDelete(attribute.id)}
                      >
                        حذف
                      </Button>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {attributes ? (
            <Pagination currentPage={page} lastPage={attributes.meta.last_page} onPageChange={setPage} />
          ) : null}
        </>
      ) : (
        <EmptyPage />
      )}

      <Modal
        open={modalOpen}
        title="ایجاد ویژگی جدید"
        onClose={() => setModalOpen(false)}
        footer={
          <div className="flex gap-3">
            <Button variant="admin" onClick={handleCreate} disabled={pending}>
              ایجاد
            </Button>
            <Button variant="danger" onClick={() => setModalOpen(false)}>
              بستن
            </Button>
          </div>
        }
      >
        <div className="grid gap-4 md:grid-cols-2">
          <FormTextInput
            name="name"
            label="نام"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="نام"
          />
          <FormTextInput
            name="slug"
            label="نامک"
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            placeholder="نامک"
          />
        </div>
      </Modal>
    </PageWrapper>
  );
}
