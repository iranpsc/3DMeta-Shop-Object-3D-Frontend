"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { FormTextInput } from "@/components/form/text-input";
import { Button } from "@/components/ui/button";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { TableSkeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { showErrorToast, showWarningToast } from "@/components/ui/toast";
import { formatDate } from "@/lib/formatters";
import { useDebounce } from "@/lib/use-debounce";
import { useToastState } from "@/lib/use-toast-message";
import { createAvatar, fetchAvatars } from "@/lib/user-api";
import type { AvatarItem, Paginated } from "@/lib/types";

const RPM_SUBDOMAIN = "metargb";
const RPM_ORIGIN = `https://${RPM_SUBDOMAIN}.readyplayer.me`;

export default function AvatarsPageClient() {
  const [avatars, setAvatars] = useState<Paginated<AvatarItem> | null>(null);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [nameConfirmed, setNameConfirmed] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarImageUrl, setAvatarImageUrl] = useState("");
  const { setMessage } = useToastState("success");
  const [pending, startTransition] = useTransition();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const loadAvatars = useCallback(() => {
    fetchAvatars(debouncedSearch, page)
      .then(setAvatars)
      .catch(() => showErrorToast("بارگذاری آواتارها با خطا مواجه شد."));
  }, [debouncedSearch, page]);

  useEffect(() => {
    loadAvatars();
  }, [loadAvatars]);

  useEffect(() => {
    if (!modalOpen || !nameConfirmed) return;

    function handleMessage(event: MessageEvent) {
      if (event.origin !== RPM_ORIGIN) return;

      try {
        const json = JSON.parse(event.data as string) as {
          source?: string;
          eventName?: string;
          data?: { url?: string; avatarId?: string };
        };
        if (json?.source !== "readyplayerme") return;

        if (json.eventName === "v1.frame.ready" && iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage(
            JSON.stringify({
              target: "readyplayerme",
              type: "subscribe",
              eventName: "v1.**",
            }),
            RPM_ORIGIN,
          );
        }

        if (json.eventName === "v1.avatar.exported" && json.data?.url && json.data.avatarId) {
          const avatarId = json.data.avatarId;
          if (!/^[a-zA-Z0-9_-]+$/.test(avatarId)) return;
          if (!json.data.url.startsWith("https://models.readyplayer.me/")) return;

          setAvatarUrl(json.data.url);
          setAvatarImageUrl(`https://models.readyplayer.me/${avatarId}.png`);
        }
      } catch {
        // ignore non-json messages
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [modalOpen, nameConfirmed]);

  function openModal() {
    setModalOpen(true);
    setName("");
    setNameConfirmed(false);
    setAvatarUrl("");
    setAvatarImageUrl("");
  }

  function closeModal() {
    setModalOpen(false);
    setNameConfirmed(false);
  }

  function confirmName() {
    if (!name.trim()) {
      showWarningToast("لطفاً نام آواتار را وارد کنید.");
      return;
    }
    setNameConfirmed(true);
  }

  function saveAvatar() {
    if (!name.trim() || !avatarUrl || !avatarImageUrl) {
      showWarningToast("لطفاً آواتار را بسازید و نام را وارد کنید.");
      return;
    }

    startTransition(async () => {
      try {
        const { message: flash } = await createAvatar({
          name: name.trim(),
          avatar_url: avatarUrl,
          avatar_image_url: avatarImageUrl,
        });
        setMessage(flash ?? "آواتار با موفقیت ایجاد شد.");
        closeModal();
        loadAvatars();
      } catch {
        showErrorToast("ذخیره آواتار با خطا مواجه شد.");
      }
    });
  }

  const rows = avatars?.data ?? [];

  return (
    <PageWrapper title="آواتارها">
      <div className="row justify-content-center">
        <div className="flex flex-col gap-5">
          <Button
            variant="primary"
            className="rounded-xl px-11 py-3 font-semibold"
            onClick={openModal}
          >
            ایجاد آواتار
          </Button>

          {modalOpen ? (
            <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 pt-20 lg:pt-0">
              <div className="relative flex h-[90vh] w-full max-w-4xl flex-col bg-white dark:bg-gray-800">
                <div className="flex items-center justify-between border-b p-4 dark:border-gray-700">
                  <h3 className="text-lg font-semibold">ایجاد آواتار</h3>
                  <div className="flex gap-2">
                    {avatarUrl ? (
                      <Button
                        variant="primary"
                        disabled={pending}
                        className="rounded-md"
                        onClick={saveAvatar}
                      >
                        ذخیره آواتار
                      </Button>
                    ) : null}
                    <Button variant="ghost" onClick={closeModal}>
                      لغو
                    </Button>
                  </div>
                </div>

                {!nameConfirmed ? (
                  <div className="flex flex-col gap-5 p-4 lg:flex-row">
                    <FormTextInput
                      name="avatar_name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="نام آواتار را وارد کنید"
                      wrapperClassName="w-full"
                      className="border border-[#000BEE] bg-[#e9f3fd] py-3 dark:border-[#E59819]"
                    />
                    <Button
                      variant="primary"
                      fullWidth
                      className="rounded-xl px-3 py-4 text-sm font-semibold"
                      onClick={confirmName}
                    >
                      تایید نام
                    </Button>
                  </div>
                ) : (
                  <iframe
                    ref={iframeRef}
                    title="Avatar builder"
                    src={`https://${RPM_SUBDOMAIN}.readyplayer.me/avatar?frameApi`}
                    className="h-[70vh] w-full border border-gray-300 dark:border-gray-600"
                    allow="camera *; microphone *; clipboard-write"
                  />
                )}
              </div>
            </div>
          ) : null}

          <FormTextInput
            name="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="جستجو آواتار"
            className="bg-[#e9f3fd] dark:bg-black"
          />

          {rows.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow header>
                    <TableHead>ردیف</TableHead>
                    <TableHead>شناسه</TableHead>
                    <TableHead>نام</TableHead>
                    <TableHead>تصویر</TableHead>
                    <TableHead>فایل</TableHead>
                    <TableHead>تاریخ ایجاد</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((avatar, index) => (
                    <TableRow key={avatar.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{avatar.sku}</TableCell>
                      <TableCell>{avatar.name}</TableCell>
                      <TableCell>
                        {avatar.image?.url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={avatar.image.url}
                            alt="تصویر آواتار"
                            className="w-[60px] rounded-lg"
                          />
                        ) : null}
                      </TableCell>
                      <TableCell>
                        {avatar.files?.map((file, fileIndex) => (
                          <a key={file.id} href={file.url} className="block">
                            دانلود {file.name ?? fileIndex + 1}
                          </a>
                        ))}
                      </TableCell>
                      <TableCell>{formatDate(avatar.created_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {avatars ? (
                <Pagination
                  currentPage={page}
                  lastPage={avatars.meta.last_page}
                  onPageChange={setPage}
                />
              ) : null}
            </>
          ) : avatars ? (
            <p className="mt-4 text-center text-gray-500 dark:text-gray-400">آواتاری یافت نشد.</p>
          ) : (
            <TableSkeleton
              columns={6}
              headers={["ردیف", "شناسه", "نام", "تصویر", "فایل", "تاریخ ایجاد"]}
            />
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
