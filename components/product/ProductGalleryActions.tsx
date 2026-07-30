"use client";

import { useEffect, useState, useTransition } from "react";
import type { ProductDetail } from "@/lib/types";
import { addToCart } from "@/lib/cart-api";
import { fetchProductWithAuth } from "@/lib/product-api";
import { useCart } from "@/lib/cart-context";
import { getProductGalleryImages } from "@/lib/product-images";
import { useZoomable } from "@/lib/use-zoomable";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ProductFileDownload } from "@/components/product/ProductFileDownload";

const DEFAULT_IMAGE = "/home-page/images/default.jpg";

const CART_ICON_PATH =
  "M13.7812 9.6875V5.75C13.7812 4.87976 13.4355 4.04516 12.8202 3.42981C12.2048 2.81445 11.3702 2.46875 10.5 2.46875C9.62971 2.46875 8.79512 2.81445 8.17976 3.42981C7.56441 4.04516 7.21871 4.87976 7.21871 5.75V9.6875M17.1552 7.94362L18.2603 18.4436C18.3216 19.0255 17.8666 19.5312 17.2812 19.5312H3.71871C3.58064 19.5314 3.44408 19.5025 3.31791 19.4464C3.19174 19.3904 3.07877 19.3084 2.98635 19.2058C2.89393 19.1032 2.82412 18.9824 2.78145 18.8511C2.73879 18.7197 2.72422 18.5809 2.73871 18.4436L3.84471 7.94362C3.87022 7.70174 3.98438 7.47786 4.16518 7.31516C4.34597 7.15246 4.5806 7.06246 4.82383 7.0625H16.1761C16.6801 7.0625 17.1027 7.44312 17.1552 7.94362ZM7.54683 9.6875C7.54683 9.77452 7.51226 9.85798 7.45073 9.91952C7.38919 9.98106 7.30573 10.0156 7.21871 10.0156C7.13168 10.0156 7.04822 9.98106 6.98669 9.91952C6.92515 9.85798 6.89058 9.77452 6.89058 9.6875C6.89058 9.60048 6.92515 9.51702 6.98669 9.45548C7.04822 9.39394 7.13168 9.35938 7.21871 9.35938C7.30573 9.35938 7.38919 9.39394 7.45073 9.45548C7.51226 9.51702 7.54683 9.60048 7.54683 9.6875ZM14.1093 9.6875C14.1093 9.77452 14.0748 9.85798 14.0132 9.91952C13.9517 9.98106 13.8682 10.0156 13.7812 10.0156C13.6942 10.0156 13.6107 9.98106 13.5492 9.91952C13.4877 9.85798 13.4531 9.77452 13.4531 9.6875C13.4531 9.60048 13.4877 9.51702 13.5492 9.45548C13.6107 9.39394 13.6942 9.35938 13.7812 9.35938C13.8682 9.35938 13.9517 9.39394 14.0132 9.45548C14.0748 9.51702 14.1093 9.60048 14.1093 9.6875Z";

function DocumentIcon() {
  return (
    <svg width="30" height="36" viewBox="0 0 30 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        className="dark:stroke-white"
        d="M1 11.3846V6.76923C1 3.58297 3.46243 1 6.5 1C9.53757 1 12 3.58297 12 6.76923V13.1154C12 14.7085 10.7688 16 9.25 16C7.73121 16 6.5 14.7085 6.5 13.1154V6.76923"
        stroke="#6E8092"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        className="dark:stroke-white"
        d="M15.8235 1H16.2727C21.6441 1 24.3298 1 26.1949 2.35633C26.7294 2.74493 27.2037 3.20578 27.6038 3.72491C29 5.53674 29 8.14571 29 13.3636V17.6909C29 22.7284 29 25.2469 28.2277 27.2585C26.986 30.4926 24.3601 33.0435 21.0309 34.2496C18.9602 35 16.3674 35 11.1818 35C8.21865 35 6.73707 35 5.55376 34.5713C3.65142 33.8821 2.15088 32.4243 1.44135 30.5764C1 29.4269 1 27.9877 1 25.1091V18"
        stroke="#6E8092"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        className="dark:stroke-white"
        d="M29 18C29 21.1295 26.4629 23.6666 23.3334 23.6666C22.2015 23.6666 20.8672 23.4684 19.7666 23.7632C18.7889 24.0251 18.0251 24.7889 17.7632 25.7666C17.4684 26.8672 17.6666 28.2015 17.6666 29.3334C17.6666 32.4629 15.1295 35 12 35"
        stroke="#6E8092"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type Props = {
  product: ProductDetail;
};

export function ProductGalleryActions({ product }: Props) {
  const images = getProductGalleryImages(product);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSrc = images[activeIndex]?.url ?? DEFAULT_IMAGE;
  const zoomContainerRef = useZoomable(activeSrc);
  const [qty, setQty] = useState(1);
  const [shareOpen, setShareOpen] = useState(false);
  const liked = Boolean(product.user_liked);
  const bookmarked = Boolean(product.user_bookmarked);
  const likesCount = product.likes_count ?? 0;
  const [inCart, setInCart] = useState(false);
  const [cartMessage, setCartMessage] = useState<string | null>(null);
  const [cartPending, startCartTransition] = useTransition();
  const { setCount, refresh } = useCart();
  const [userCanDownload, setUserCanDownload] = useState(
    Boolean(product.user_can_download),
  );
  const [downloadFiles, setDownloadFiles] = useState(product.files ?? []);

  useEffect(() => {
    let cancelled = false;

    fetchProductWithAuth(product.sku)
      .then((data) => {
        if (cancelled || !data) {
          return;
        }

        if (typeof data.user_can_download === "boolean") {
          setUserCanDownload(data.user_can_download);
        }

        if (data.files?.length) {
          setDownloadFiles(data.files);
        }
      })
      .catch(() => {
        // Guest or network error — keep SSR defaults.
      });

    return () => {
      cancelled = true;
    };
  }, [product.sku]);

  const showDownload = product.is_free || userCanDownload;

  const extensions = Array.from(
    new Set(
      (product.files ?? [])
        .map((f) => {
          const name = f.name ?? f.extension ?? "";
          const parts = name.split(".");
          return parts.length > 1 ? parts.pop()!.toLowerCase() : (f.extension ?? "");
        })
        .filter(Boolean),
    ),
  );

  const convertable = product.attributes?.find(
    (a) => a.slug === "convertable_to_3d_model",
  );

  const recommendationPct =
    product.rating_avg != null ? (product.rating_avg * 100) / 5 : null;

  function handleAddToCart() {
    startCartTransition(async () => {
      try {
        const { cart, message } = await addToCart(product.id, qty);
        setInCart(true);
        setCartMessage(message ?? null);
        if (typeof cart?.count === "number") {
          setCount(cart.count);
        } else {
          await refresh();
        }
      } catch (err: unknown) {
        const msg =
          typeof err === "object" && err !== null && "message" in err
            ? String((err as { message: string }).message)
            : "افزودن به سبد خرید با خطا مواجه شد.";
        setCartMessage(msg);
      }
    });
  }

  return (
    <>
      {cartMessage ? (
        <div className="mb-3 rounded-[10px] bg-white/80 p-3 text-sm dark:bg-[#1A1A18]">
          {cartMessage}
        </div>
      ) : null}
      <div className="flex flex-col items-center justify-center">
        <Modal open={shareOpen} title="اشتراک این صفحه" onClose={() => setShareOpen(false)}>
          <div className="flex flex-wrap gap-5">
            {[
              { label: "Twitter", href: "https://twitter.com/share?url=" },
              { label: "Facebook", href: "https://www.facebook.com/sharer/sharer.php?u=" },
              { label: "Reddit", href: "https://reddit.com/submit?url=" },
              { label: "Hacker News", href: "https://news.ycombinator.com/submitlink?u=" },
              { label: "LinkedIn", href: "https://www.linkedin.com/shareArticle?url=" },
              { label: "Email", href: "mailto:?subject=" },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="rounded-xl bg-[#EFEFEF] px-5 py-3 dark:bg-[#0f0f0f]"
              >
                {label}
              </a>
            ))}
          </div>
        </Modal>
      </div>

      <div className="flex w-full flex-col justify-start gap-5 md:flex-row">
      <div className="flex w-full flex-col items-center justify-start gap-5 md:w-1/3 xl:w-[35%]">
        <div
          ref={zoomContainerRef}
          className="zoomable flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg bg-white"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            id="square"
            className="aspect-square zoomable__img"
            src={activeSrc}
            alt={`محصول ${product.name}`}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = DEFAULT_IMAGE;
            }}
          />
        </div>
        <div className="grid grid-cols-3 gap-5">
          {images.map((image, index) => (
            <Button
              key={`${image.id}-${index}`}
              variant="unstyled"
              className="image-btn aspect-square w-full overflow-hidden rounded-lg bg-white"
              data-src={image.url}
              onClick={() => setActiveIndex(index)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="aspect-square"
                src={image.url}
                alt={`محصول ${product.name}`}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_IMAGE;
                }}
              />
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-14 flex w-full flex-col gap-5 md:mt-0 md:w-2/3 xl:w-[65%]">
        <p className="px-5 text-2xl font-bold text-[#3A4980] dark:text-white">
          {product.name}
        </p>

        <div className="flex h-min w-full justify-between border-b border-gray-300 px-5 pb-5">
          <div className="flex flex-col justify-center gap-4">
            <span className="text-[#1A1A18] dark:text-gray-200">{product.sku}</span>
          </div>
          <div className="flex items-start justify-end gap-2">
            <div className="flex h-8 w-max select-none items-center gap-3 rounded-lg bg-[#91B3FA29] p-1 text-[#3A4980] opacity-50 dark:bg-[#1A1A18] dark:text-white">
              <div>
                <p>{likesCount}</p>
              </div>
              <div className="like">
                <input
                  id="like"
                  type="checkbox"
                  className="peer"
                  checked={liked}
                  disabled
                  aria-disabled="true"
                  readOnly
                />
                <label
                  htmlFor="like"
                  className="like-label pointer-events-none peer-checked:[&>svg>path]:fill-red-600"
                >
                  <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      className="dark:stroke-white"
                      d="M16.5 4.875C16.5 2.80417 14.7508 1.125 12.5933 1.125C10.9808 1.125 9.59583 2.06333 9 3.4025C8.40417 2.06333 7.01917 1.125 5.40583 1.125C3.25 1.125 1.5 2.80417 1.5 4.875C1.5 10.8917 9 14.875 9 14.875C9 14.875 16.5 10.8917 16.5 4.875Z"
                      stroke="#3A4980"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </label>
              </div>
            </div>
            <div className="like flex h-8 w-8 select-none items-center justify-center gap-3 rounded-lg bg-white p-1 text-[#3A4980] opacity-50 dark:bg-[#1A1A18]">
              <input
                id="save"
                type="checkbox"
                className="peer"
                checked={bookmarked}
                disabled
                aria-disabled="true"
                readOnly
              />
              <label
                htmlFor="save"
                className="like-label pointer-events-none peer-checked:[&>svg>path]:fill-black"
              >
                <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    className="dark:stroke-white"
                    d="M11.6608 1.76838C12.5775 1.87505 13.25 2.66588 13.25 3.58922V16.5L7 13.375L0.75 16.5V3.58922C0.75 2.66588 1.42167 1.87505 2.33917 1.76838C5.43599 1.40891 8.56401 1.40891 11.6608 1.76838Z"
                    stroke="#3A4980"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </label>
            </div>
            <Button
              variant="unstyled"
              onClick={() => setShareOpen(true)}
              className="flex h-8 w-8 select-none items-center justify-center rounded-lg bg-white p-1 dark:bg-[#1A1A18]"
              aria-label="share"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  className="dark:stroke-white"
                  d="M6.01415 9.08916C5.81237 8.72608 5.49574 8.44029 5.11396 8.27664C4.73218 8.11299 4.30686 8.08075 3.90478 8.18497C3.50269 8.2892 3.14659 8.52399 2.89238 8.85249C2.63817 9.181 2.50024 9.58462 2.50024 9.99999C2.50024 10.4154 2.63817 10.819 2.89238 11.1475C3.14659 11.476 3.50269 11.7108 3.90478 11.815C4.30686 11.9192 4.73218 11.887 5.11396 11.7233C5.49574 11.5597 5.81237 11.2739 6.01415 10.9108M6.01415 9.08916C6.16415 9.35916 6.24998 9.66916 6.24998 9.99999C6.24998 10.3308 6.16415 10.6417 6.01415 10.9108M6.01415 9.08916L13.9858 4.66082M6.01415 10.9108L13.9858 15.3392M13.9858 4.66082C14.1027 4.88094 14.2623 5.07555 14.4552 5.23327C14.6482 5.39098 14.8707 5.50865 15.1097 5.57939C15.3486 5.65012 15.5993 5.67251 15.847 5.64524C16.0948 5.61796 16.3346 5.54158 16.5524 5.42054C16.7703 5.29951 16.9618 5.13626 17.1159 4.94034C17.2699 4.74441 17.3833 4.51975 17.4495 4.27948C17.5157 4.03921 17.5333 3.78815 17.5013 3.54099C17.4694 3.29382 17.3885 3.05552 17.2633 2.83999C17.0167 2.41528 16.6133 2.10427 16.1398 1.97384C15.6663 1.8434 15.1606 1.90394 14.7313 2.14245C14.3019 2.38096 13.9833 2.7784 13.8439 3.24932C13.7046 3.72024 13.7555 4.22706 13.9858 4.66082ZM13.9858 15.3392C13.8662 15.5545 13.7902 15.7912 13.7621 16.0359C13.7339 16.2806 13.7543 16.5285 13.822 16.7653C13.8897 17.0021 14.0033 17.2233 14.1565 17.4162C14.3096 17.6091 14.4993 17.77 14.7146 17.8896C14.9299 18.0092 15.1666 18.0852 15.4113 18.1133C15.656 18.1414 15.9039 18.1211 16.1407 18.0534C16.3775 17.9857 16.5987 17.8721 16.7916 17.7189C16.9845 17.5658 17.1454 17.3761 17.265 17.1608C17.5065 16.726 17.5655 16.213 17.4288 15.7347C17.2921 15.2564 16.9711 14.852 16.5362 14.6104C16.1014 14.3688 15.5884 14.3099 15.1101 14.4466C14.6318 14.5832 14.2274 14.9043 13.9858 15.3392Z"
                  stroke="#3A4980"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Button>
          </div>
        </div>

        <div className="flex h-min w-full justify-between border-b border-gray-300 px-5 pb-5">
          <div className="flex flex-col justify-center gap-4">
            <p className="text-2xl font-bold text-[#3A4980] dark:text-white">
              {product.is_free ? (
                "رایگان"
              ) : (
                <>
                  {Number(product.final_price).toLocaleString("fa-IR")}
                  <sub>(ریال)</sub>
                </>
              )}
            </p>
            {product.price ? (
              <p className="text-xs text-[#3A498087] line-through dark:text-gray-400">
                {Number(product.price).toLocaleString("fa-IR")}
                <sub>(ریال)</sub>
              </p>
            ) : null}
          </div>
          <div className="flex flex-col gap-5">
            <div className="flex items-start justify-end gap-2">
              <div className="flex w-max items-center gap-3 rounded-full bg-white px-3 py-1 text-[#3A4980] dark:bg-[#1A1A18] dark:text-white">
                <p>{Number(product.rating_avg ?? 0).toLocaleString("fa-IR")}</p>
                <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    className="dark:stroke-white"
                    d="M7.65335 2.83265C7.68155 2.76387 7.72957 2.70503 7.7913 2.66362C7.85303 2.62221 7.92568 2.6001 8.00002 2.6001C8.07435 2.6001 8.14701 2.62221 8.20874 2.66362C8.27047 2.70503 8.31849 2.76387 8.34669 2.83265L9.76335 6.23998C9.78987 6.30374 9.83346 6.35894 9.88933 6.39952C9.9452 6.4401 10.0112 6.46448 10.08 6.46998L13.7587 6.76465C14.0914 6.79131 14.226 7.20665 13.9727 7.42331L11.17 9.82465C11.1177 9.86944 11.0786 9.92778 11.0572 9.99328C11.0358 10.0588 11.0329 10.1289 11.0487 10.196L11.9054 13.786C11.9226 13.858 11.9181 13.9335 11.8924 14.003C11.8667 14.0724 11.821 14.1327 11.7611 14.1763C11.7012 14.2198 11.6297 14.2445 11.5557 14.2475C11.4817 14.2504 11.4085 14.2313 11.3454 14.1926L8.19535 12.2693C8.13651 12.2335 8.06893 12.2145 8.00002 12.2145C7.93111 12.2145 7.86353 12.2335 7.80469 12.2693L4.65469 14.1933C4.59152 14.232 4.51832 14.2511 4.44432 14.2481C4.37033 14.2452 4.29885 14.2204 4.23893 14.1769C4.17901 14.1334 4.13333 14.0731 4.10765 14.0036C4.08198 13.9342 4.07747 13.8587 4.09469 13.7866L4.95135 10.196C4.96724 10.1289 4.96432 10.0588 4.94291 9.99325C4.92151 9.92773 4.88244 9.86939 4.83002 9.82465L2.02735 7.42331C1.97123 7.37505 1.93063 7.31128 1.91065 7.24C1.89068 7.16873 1.89222 7.09314 1.9151 7.02274C1.93797 6.95235 1.98114 6.89028 2.0392 6.84436C2.09725 6.79844 2.16758 6.7707 2.24135 6.76465L5.92002 6.46998C5.98885 6.46448 6.05483 6.4401 6.1107 6.39952C6.16657 6.35894 6.21017 6.30374 6.23669 6.23998L7.65335 2.83265Z"
                    stroke="#3A4980"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="flex w-max items-center gap-3 rounded-full bg-white px-3 py-1 text-[#3A4980] dark:bg-[#1A1A18] dark:text-white">
                <p>{product.approved_reviews_count ?? 0} &nbsp; بررسی</p>
                <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    className="dark:stroke-white"
                    d="M5.75 7C5.75 7.06631 5.72366 7.12989 5.67678 7.17678C5.62989 7.22366 5.5663 7.25 5.5 7.25C5.4337 7.25 5.37011 7.22366 5.32322 7.17678C5.27634 7.12989 5.25 7.06631 5.25 7C5.25 6.9337 5.27634 6.87011 5.32322 6.82322C5.37011 6.77634 5.4337 6.75 5.5 6.75C5.5663 6.75 5.62989 6.77634 5.67678 6.82322C5.72366 6.87011 5.75 6.9337 5.75 7ZM5.75 7H5.5M8.25 7C8.25 7.06631 8.22366 7.12989 8.17678 7.17678C8.12989 7.22366 8.0663 7.25 8 7.25C7.9337 7.25 7.87011 7.22366 7.82322 7.17678C7.77634 7.12989 7.75 7.06631 7.75 7C7.75 6.9337 7.77634 6.87011 7.82322 6.82322C7.87011 6.77634 7.9337 6.75 8 6.75C8.0663 6.75 8.12989 6.77634 8.17678 6.82322C8.22366 6.87011 8.25 6.9337 8.25 7ZM8.25 7H8M10.75 7C10.75 7.06631 10.7237 7.12989 10.6768 7.17678C10.6299 7.22366 10.5663 7.25 10.5 7.25C10.4337 7.25 10.3701 7.22366 10.3232 7.17678C10.2763 7.12989 10.25 7.06631 10.25 7C10.25 6.9337 10.2763 6.87011 10.3232 6.82322C10.3701 6.77634 10.4337 6.75 10.5 6.75C10.5663 6.75 10.6299 6.77634 10.6768 6.82322C10.7237 6.87011 10.75 6.9337 10.75 7ZM10.75 7H10.5M1.5 9.00667C1.5 10.0733 2.24867 11.0027 3.30467 11.158C4.02933 11.2647 4.76133 11.3467 5.5 11.404V14.5L8.28933 11.7113C8.42744 11.5738 8.61312 11.4945 8.808 11.49C10.1091 11.458 11.407 11.3471 12.6947 11.158C13.7513 11.0027 14.5 10.074 14.5 9.006V4.994C14.5 3.926 13.7513 2.99733 12.6953 2.842C11.1406 2.61381 9.57135 2.49951 8 2.5C6.40533 2.5 4.83733 2.61667 3.30467 2.842C2.24867 2.99733 1.5 3.92667 1.5 4.994V9.006V9.00667Z"
                    stroke="#3A4980"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            {product.rating_avg != null && product.rating_avg > 0 ? (
              <div className="text-black/40 dark:text-white/75">
                <p>
                  {recommendationPct} درصد از خریداران این را توصیه کرده اند.
                </p>
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex h-min w-full flex-col justify-between gap-5 border-b border-gray-300 px-5 pb-5">
          <p className="text-[#8E9ABC] dark:text-white">فرمت قابل دانلود</p>
          <div className="flex flex-wrap gap-4">
            {(extensions.length ? extensions : ["—"]).map((ext) => (
              <div
                key={ext}
                className="flex items-center gap-3 rounded-lg bg-white p-2 text-[#3A4980] dark:bg-[#1A1A18] dark:text-white"
              >
                <p>{ext}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between gap-2">
          {product.stock_status && (product.quantity ?? 0) > 1 ? (
            <div
              className="flex w-[25%] flex-col items-center gap-4 text-xs text-[#3A4980] md:flex-row dark:text-gray-300"
              style={{ marginRight: 10 }}
            >
              <div className="relative flex flex-row rounded-lg bg-transparent">
                <Button
                  variant="stepper"
                  stepperSide="start"
                  className="dark:bg-[#1A1A18]"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                >
                  <span className="m-auto text-2xl font-thin">−</span>
                </Button>
                <input
                  type="number"
                  className="flex h-12 w-10 items-center border-0 bg-white text-center text-md font-semibold text-[#3A4980] focus:border-0 focus:ring-0 dark:bg-[#1A1A18] dark:text-white"
                  min={1}
                  max={product.quantity}
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value) || 1)}
                />
                <Button
                  variant="stepper"
                  stepperSide="end"
                  className="dark:bg-[#1A1A18]"
                  onClick={() =>
                    setQty((q) => Math.min(product.quantity ?? q + 1, q + 1))
                  }
                >
                  <span className="m-auto text-2xl font-thin">+</span>
                </Button>
              </div>
              <div className="flex gap-2">
                <span>{product.stock_status ? "در انبار" : "ناموجود"}</span>
                <p>{product.quantity}</p>
              </div>
            </div>
          ) : (
            <div
              className="flex w-[25%] flex-col items-center gap-4 text-xs text-[#3A4980] md:flex-row dark:text-gray-300"
              style={{ marginRight: 10 }}
            />
          )}

          <div className="w-[60%] md:w-[30%] lg:w-[40%]">
            {showDownload ? (
              <ProductFileDownload
                files={downloadFiles}
                canDownload={userCanDownload}
              />
            ) : (
              <Button
                variant="danger"
                fullWidth
                disabled={inCart || cartPending}
                onClick={handleAddToCart}
                className="flex h-12 flex-row-reverse items-center justify-center gap-3 rounded-full bg-[#E3000F] text-sm"
              >
                <p>{inCart ? "در سبد خرید" : "افزودن به سبد خرید"}</p>
                <svg width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d={CART_ICON_PATH}
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-[10px] bg-[#ffffff8a] p-5 dark:bg-[#1A1A18]">
          <div>
            <DocumentIcon />
          </div>
          <div className="flex flex-col justify-between gap-5">
            <p className="text-xs text-[#726C6C] dark:text-white/50">توضیح کوتاه</p>
            <p className="font-bold text-[#1D364D] dark:text-white/70">
              {product.short_description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-[10px] bg-[#ffffff8a] p-5 dark:bg-[#1A1A18]">
          <div>
            <DocumentIcon />
          </div>
          <div className="flex flex-col justify-between gap-5">
            <p className="text-xs text-[#726C6C] dark:text-white/50">
              قابلیت تبدیل سه بعدی به
            </p>
            <p className="font-bold text-[#1D364D] dark:text-white/70">
              {convertable?.value ?? "ندارد"}
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
