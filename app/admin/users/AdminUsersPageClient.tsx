"use client";

import { useCallback, useEffect, useState } from "react";
import { formatAdminDate } from "@/components/admin/admin-utils";
import { FormTextInput } from "@/components/form/text-input";
import { Pagination } from "@/components/ui/pagination";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { TableSkeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { showErrorToast } from "@/components/ui/toast";
import { fetchAdminUsers } from "@/lib/admin-api";
import { useDebounce } from "@/lib/use-debounce";
import type { AdminUser, Paginated } from "@/lib/types";

export default function AdminUsersPageClient() {
  const [users, setUsers] = useState<Paginated<AdminUser> | null>(null);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [page, setPage] = useState(1);

  const loadUsers = useCallback(() => {
    fetchAdminUsers(debouncedSearch, page)
      .then(setUsers)
      .catch(() => showErrorToast("بارگذاری کاربران با خطا مواجه شد."));
  }, [page, debouncedSearch]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const rows = users?.data ?? [];

  return (
    <PageWrapper title="کاربران">
      <div className="mb-5 flex justify-end">
        <FormTextInput
          name="search"
          type="search"
          placeholder="جستجو"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          wrapperClassName="w-full max-w-xs"
        />
      </div>

      {!users ? (
        <TableSkeleton
          columns={6}
          headers={["ردیف", "نام", "ایمیل", "شماره موبایل", "تاریخ عضویت", "تعداد خرید"]}
        />
      ) : (
        <Table variant="bordered">
        <TableHeader>
          <TableRow header>
            <TableHead>ردیف</TableHead>
            <TableHead>نام</TableHead>
            <TableHead>ایمیل</TableHead>
            <TableHead>شماره موبایل</TableHead>
            <TableHead>تاریخ عضویت</TableHead>
            <TableHead>تعداد خرید</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((user, index) => (
            <TableRow key={user.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone ?? "—"}</TableCell>
              <TableCell>{formatAdminDate(user.created_at)}</TableCell>
              <TableCell>{user.products_count ?? 0}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      )}

      {users ? (
        <Pagination currentPage={page} lastPage={users.meta.last_page} onPageChange={setPage} />
      ) : null}
    </PageWrapper>
  );
}
