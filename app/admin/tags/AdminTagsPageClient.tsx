"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { FormTextInput } from "@/components/form/text-input";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { confirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyPage } from "@/components/ui/empty-page";
import { Modal } from "@/components/ui/modal";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { showErrorToast, showSuccessToast } from "@/components/ui/toast";
import { createAdminTag, deleteAdminTag, fetchAdminTags } from "@/lib/admin-api";
import type { Paginated, TagSummary } from "@/lib/types";

export default function AdminTagsPageClient() {
  const [tags, setTags] = useState<Paginated<TagSummary> | null>(null);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [pending, startTransition] = useTransition();

  const loadTags = useCallback(() => {
    fetchAdminTags(page)
      .then(setTags)
      .catch(() => showErrorToast("بارگذاری برچسب‌ها با خطا مواجه شد."));
  }, [page]);

  useEffect(() => {
    loadTags();
  }, [loadTags]);

  function handleCreate() {
    startTransition(async () => {
      try {
        const result = await createAdminTag({ name, slug });
        showSuccessToast(result.message ?? "برچسب ایجاد شد.");
        setModalOpen(false);
        setName("");
        setSlug("");
        loadTags();
      } catch {
        showErrorToast("ایجاد برچسب با خطا مواجه شد.");
      }
    });
  }

  function handleDelete(tagId: number) {
    startTransition(async () => {
      const confirmed = await confirmDialog({
        message: "آیا از حذف این برچسب مطمئن هستید؟",
      });
      if (!confirmed) return;

      try {
        await deleteAdminTag(tagId);
        showSuccessToast("برچسب حذف شد.");
        loadTags();
      } catch {
        showErrorToast("حذف برچسب با خطا مواجه شد.");
      }
    });
  }

  const rows = tags?.data ?? [];

  return (
    <PageWrapper title="برچسب ها" actionBtn actionBtnText="ایجاد برچسب جدید" onActionClick={() => setModalOpen(true)}>
      {rows.length > 0 ? (
        <>
          <Table>
            <TableHeader>
              <TableRow header>
                <TableHead>ردیف</TableHead>
                <TableHead>نام</TableHead>
                <TableHead>نامک</TableHead>
                <TableHead>عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((tag, index) => (
                <TableRow key={tag.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{tag.name}</TableCell>
                  <TableCell>{tag.slug}</TableCell>
                  <TableCell>
                    <Button
                      variant="danger"
                      size="sm"
                      disabled={pending}
                      onClick={() => handleDelete(tag.id)}
                    >
                      حذف
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {tags ? (
            <Pagination currentPage={page} lastPage={tags.meta.last_page} onPageChange={setPage} />
          ) : null}
        </>
      ) : (
        <EmptyPage />
      )}

      <Modal
        open={modalOpen}
        title="ایجاد برچسب جدید"
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
