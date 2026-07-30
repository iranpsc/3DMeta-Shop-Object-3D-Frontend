"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch, getApiBaseUrl } from "@/lib/api-client";
import type { AuthUser } from "@/lib/auth";
import type { CategorySummary } from "@/lib/types";
import {
  AboutIcon,
  CartIcon,
  ChevronDownIcon,
  ContactIcon,
  GuestAvatarIcon,
  HamburgerIcon,
  LanguageIcon,
  LoginIcon,
  ModelsBankIcon,
  MoonIcon,
  SubmitOrderIcon,
  SunIcon,
  TicketIcon,
} from "./icons";

type SideNavProps = {
  navOpen: boolean;
  user: AuthUser | null;
  dark: boolean;
  cartCount?: number;
  onOpen: () => void;
  onClose: () => void;
  onToggleDark: (enabled: boolean) => void;
  onLogin: () => void;
  onLogout: () => void;
};

function avatarUrl(avatar: string | null | undefined) {
  if (!avatar) return null;
  if (avatar.startsWith("http")) return avatar;
  return `${getApiBaseUrl()}/storage/${avatar}`;
}

const ADMIN_LINKS = [
  { href: "/admin/dashboard", label: "داشبورد مدیریت" },
  { href: "/admin/products", label: "محصولات" },
  { href: "/admin/products/create", label: "ایجاد محصول" },
  { href: "/admin/products/import", label: "درون ریزی محصولات" },
  { href: "/admin/categories", label: "دسته بندی ها" },
  { href: "/admin/attributes", label: "ویژگی ها" },
  { href: "/admin/tags", label: "برچسب ها" },
  { href: "/admin/reviews", label: "دیدگاه ها" },
  { href: "/admin/submited-orders", label: "سفارشات ثبت شده" },
  { href: "/admin/contact-us-messages", label: "پیام های دریافتی" },
  { href: "/admin/users", label: "کاربران" },
];

export function SideNav({
  navOpen,
  user,
  dark,
  cartCount = 0,
  onOpen,
  onClose,
  onToggleDark,
  onLogin,
  onLogout,
}: SideNavProps) {
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const userAvatar = avatarUrl(user?.avatar);

  useEffect(() => {
    let cancelled = false;
    apiFetch<CategorySummary[]>("/api/v1/categories/top-level")
      .then((res) => {
        if (!cancelled) {
          setCategories(res.data ?? []);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCategories([]);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div id="main-nav" className={`${navOpen ? "sidnav-t" : "sidenav"} !z-[5000]`}>
      {/* opened nav — stay mounted on mobile so width can animate */}
      <div
        id="open00"
        dir="ltr"
        className={`${navOpen ? "flex" : "flex lg:hidden"} relative h-full w-full min-w-[87vw] shrink-0 !overflow-y-scroll bg-white p-4 pr-0 !z-[5000] scrollbar dark:bg-[#1A1A18] lg:min-w-0`}
      >
        <nav dir="rtl" className="relative w-full space-y-6">
          <div className="space-y-6">
            <div className="my-2 flex w-full items-center justify-between gap-5 bg-white px-2 dark:bg-[#1A1A18]">
              <div className="flex items-center gap-1">
                <Link href="/">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/home-page/images/3dmeta55.png" alt="3drgb" />
                </Link>
                <Link href="/">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/home-page/images/3ddmetaa143.png" alt="3dmeta" />
                </Link>
              </div>
              <div>
                <div
                  id="close-nav-btn"
                  className={`${navOpen ? "flex" : "hidden"} h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-slate-200 p-3 dark:bg-[#010101]`}
                  onClick={onClose}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") onClose();
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label="close navigation"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/home-page/images/aroowww.svg" alt="arrow" className="w-[60%]" />
                </div>
              </div>
            </div>

            <div>
              <ul className="tree">
                <li className="flex flex-col gap-4">
                  <input type="checkbox" id="c1" className="peer" />
                  <label
                    className="flex w-full items-center rounded-[10px] px-[20px] py-4 font-bold text-[#282828] transition-[3s] peer-checked:bg-[#EFEFEF] peer-checked:dark:bg-black peer-checked:[&>div>svg]:rotate-180 peer-checked:[&>div>svg>path]:stroke-black peer-checked:[&>div>svg>path]:dark:stroke-white dark:text-white"
                    htmlFor="c1"
                  >
                    <div className="flex w-full items-center justify-between gap-5">
                      <div className="flex items-center gap-4">
                        {user ? (
                          <>
                            {userAvatar ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={userAvatar} alt="" className="h-7 w-7 rounded-full" />
                            ) : (
                              <div className="h-7 w-7 rounded-full bg-gray-300" />
                            )}
                            <span>{user.name}</span>
                          </>
                        ) : (
                          <>
                            <div className="h-7 w-7 rounded-full bg-gray-300" />
                            <Button variant="unstyled" onClick={onLogin}>
                              ورود کاربر
                            </Button>
                          </>
                        )}
                      </div>
                      <ChevronDownIcon className="transition-[5s] duration-300" />
                    </div>
                  </label>
                  {user ? (
                    <ul>
                      <li>
                        <label className="tree_label text-[#868B90] before:text-transparent">
                          <div className="flex items-center justify-between gap-3">
                            <ModelsBankIcon />
                            <Link href="/dashboard" onClick={onClose}>
                              داشبورد
                            </Link>
                          </div>
                        </label>
                      </li>
                      <li>
                        <label className="tree_label text-[#868B90] before:text-transparent">
                          <div className="flex items-center justify-between gap-3">
                            <GuestAvatarIcon />
                            <Link href="/profile" onClick={onClose}>
                              پروفایل
                            </Link>
                          </div>
                        </label>
                      </li>
                      <li>
                        <label className="tree_label text-[#868B90] before:text-transparent">
                          <div className="flex items-center justify-between gap-3">
                            <CartIcon className="h-7 w-7" fill="#868B90" />
                            <Link href="/orders" onClick={onClose}>
                              خریدها
                            </Link>
                          </div>
                        </label>
                      </li>
                    </ul>
                  ) : null}
                </li>
              </ul>
            </div>

            <Link
              href="/cart"
              className="flex select-none items-center gap-5 border-b-2 border-[#EFEFEF] px-6 pb-5 text-[#868B90] dark:border-[#868B90]"
            >
              <CartIcon className="h-7 w-7" fill="#868B90" />
              <span> سبد خرید</span>
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FF5722] text-xs font-bold text-white">
                <span id="cart-products-count-indicator">{cartCount}</span>
              </div>
            </Link>
          </div>

          <div
            className="h-auto space-y-3 overflow-auto scrollbar lg:h-[30vh] xl:h-[35vh] 2xl:h-[45vh] 3xl:h-[53vh]"
            id="style1"
            style={{ paddingLeft: 5 }}
          >
            <div className="flex items-center gap-4 p-[14px] pr-[20PX]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="aspect-square h-7 w-7" src="/home-page/images/image25(1).png" alt="3drgb" />
              <Link href="/products" className="text-[#868B90]" onClick={onClose}>
                محصولات
              </Link>
            </div>

            <div>
              <ul className="tree">
                <li className="flex flex-col gap-3">
                  <input type="checkbox" id="c2" className="peer" />
                  <label
                    className="head_label w-full rounded-[10px] px-[20px] py-[14px] text-[#868B90] peer-checked:bg-[#000BEE] peer-checked:text-white peer-checked:[&>div>svg]:rotate-180 peer-checked:[&>div>svg>path]:stroke-white dark:bg-black dark:text-white dark:peer-checked:bg-[#222] dark:peer-checked:text-white"
                    htmlFor="c2"
                  >
                    <div className="flex w-full select-none items-center justify-between">
                      <div className="flex items-center gap-4">
                        <ModelsBankIcon />
                        <p>بانک مدل های سه بعدی</p>
                      </div>
                      <ChevronDownIcon className="transition-[5s] duration-300" strokeClass="stroke-[#868B90]" />
                    </div>
                  </label>
                  <ul>
                    <div>
                      {categories.map((category, index) => (
                        <li key={category.id}>
                          <div>
                            <input type="checkbox" id={`cat-${index}`} className="peer" />
                            <label
                              htmlFor={`cat-${index}`}
                              className="tree_label w-full text-[#868B90] peer-checked:bg-[#ECF4FE] peer-checked:text-[#000BEE] dark:peer-checked:bg-[#222] dark:peer-checked:text-white"
                            >
                              {category.name}
                            </label>
                            <ul>
                              <div className="flex flex-col gap-5 p-3 pr-[20PX] text-sm font-bold text-[#000BEE] dark:text-[#868B90]">
                                {(category.children ?? []).map((child) => (
                                  <Link
                                    key={child.id}
                                    className="text-[#000BEE] dark:text-[#E59819]"
                                    href={child.url || `/categories/${child.slug}`}
                                    onClick={onClose}
                                  >
                                    {child.name}
                                  </Link>
                                ))}
                              </div>
                            </ul>
                          </div>
                        </li>
                      ))}
                    </div>
                  </ul>
                </li>
              </ul>
            </div>


            <div className="flex items-center gap-4 p-[14px] pr-[20PX]">
              <SubmitOrderIcon />
              <Link href="/submit-order" className="text-[#868B90]" onClick={onClose}>
                ثبت سفارش
              </Link>
            </div>
            <div className="flex items-center gap-4 p-[14px] pr-[20PX]">
              <GuestAvatarIcon />
              <Link href="/avatars" className="text-[#868B90]" onClick={onClose}>
                آواتارها
              </Link>
            </div>
            <div className="flex items-center gap-4 p-[14px] pr-[20PX]">
              <TicketIcon />
              <Link href="/tickets" className="text-[#868B90]" onClick={onClose}>
                پشتیبانی
              </Link>
            </div>
            <div className="flex items-center gap-4 p-[14px] pr-[20PX]">
              <ContactIcon />
              <Link href="/contact-us" className="text-[#868B90]" onClick={onClose}>
                تماس با ما
              </Link>
            </div>
            <div className="flex items-center gap-4 p-[14px] pr-[20PX]">
              <AboutIcon />
              <Link href="/about-us" className="text-[#868B90]" onClick={onClose}>
                درباره ما
              </Link>
            </div>

            {user?.role === "admin" ? (
              <div>
                <ul className="tree">
                  <li className="flex flex-col gap-3">
                    <input type="checkbox" id="c111" className="peer" />
                    <label
                      className="head_label w-full rounded-[10px] px-[20px] py-4 text-[#868B90] peer-checked:bg-[#000BEE] peer-checked:text-white peer-checked:[&>div>svg]:rotate-180 peer-checked:[&>div>svg>path]:stroke-white dark:peer-checked:bg-black"
                      htmlFor="c111"
                    >
                      <div className="flex w-full select-none items-center justify-between">
                        <div className="flex items-center gap-4">
                          <GuestAvatarIcon />
                          <p> داشبورد ادمین </p>
                        </div>
                        <ChevronDownIcon className="transition-[5s] duration-300" strokeClass="stroke-[#868B90]" />
                      </div>
                    </label>
                    <ul>
                      <div className="flex flex-col gap-5 p-3 pr-[20PX] text-sm font-bold text-[#000BEE] dark:text-[#868B90]">
                        {ADMIN_LINKS.map((item) => (
                          <Link key={item.href} href={item.href} onClick={onClose}>
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </ul>
                  </li>
                </ul>
              </div>
            ) : null}

            <div>
              <ul className="tree">
                <li className="flex flex-col gap-3">
                  <input type="checkbox" id="c11" className="peer" />
                  <label
                    className="head_label w-full rounded-[10px] px-[20px] py-4 text-[#868B90] peer-checked:bg-[#000BEE] peer-checked:text-white peer-checked:[&>div>svg]:rotate-180 peer-checked:[&>div>svg>path]:stroke-white dark:peer-checked:bg-black"
                    htmlFor="c11"
                  >
                    <div className="flex w-full select-none items-center justify-between">
                      <div className="flex items-center gap-4">
                        <LanguageIcon />
                        <p> زبان </p>
                      </div>
                      <ChevronDownIcon className="transition-[5s] duration-300" strokeClass="stroke-[#868B90]" />
                    </div>
                  </label>
                  <ul>
                    <div id="zaban" className="flex flex-col gap-5 p-3 pr-[20PX] text-sm font-bold text-[#000BEE] dark:text-[#868B90]">
                      <a href="#">فارسی</a>
                      <a href="#"> انگلیسی</a>
                    </div>
                  </ul>
                </li>
              </ul>
            </div>
          </div>

          <div className="h-auto w-full space-y-6 bg-white pb-10 dark:bg-[#1A1A18] lg:absolute lg:bottom-0 lg:h-1/5 lg:pb-1 2xl:h-1/6">
            {!user ? (
              <Button
                variant="primary"
                fullWidth
                aria-label="login"
                onClick={onLogin}
                className="cursor-pointer justify-between p-[10px] px-6 font-bold"
              >
                <LoginIcon className="h-7 w-7" />
                <span className="font-bold">ورود</span>
              </Button>
            ) : (
              <Button
                variant="danger"
                fullWidth
                aria-label="logout"
                onClick={onLogout}
                className="cursor-pointer p-[10px] px-6 font-bold"
              >
                <div className="flex w-full items-center justify-between">
                  <LoginIcon className="h-7 w-7" />
                  <span>خروج</span>
                </div>
              </Button>
            )}
            <div className="border-t-2 border-[#EFEFEF] pt-5 dark:border-[#868B90]">
              <div className="flex w-full rounded-full bg-[#F4F4F4] p-[6px] dark:bg-black">
                <Button
                  variant="unstyled"
                  className={`enable-dark-mode flex w-1/2 cursor-pointer justify-center rounded-full p-1 ${dark ? "bg-[#1A1A18]" : "bg-transparent"}`}
                  aria-label="enable dark mode"
                  onClick={() => onToggleDark(true)}
                >
                  <MoonIcon />
                </Button>
                <Button
                  variant="unstyled"
                  className={`disable-dark-mode flex w-1/2 cursor-pointer justify-center rounded-full p-1 ${!dark ? "bg-[#FCFCFC] shadow-[0_0_6px_0_rgba(0,0,0,0.1)]" : "bg-transparent shadow-none"}`}
                  aria-label="disable dark mode"
                  onClick={() => onToggleDark(false)}
                >
                  <SunIcon />
                </Button>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* closed nav (desktop icon rail) */}
      <div dir="ltr" id="close00" className={`h-full ${navOpen ? "hidden" : "hidden lg:block"}`}>
        <nav
          dir="rtl"
          className="relative flex h-full flex-col items-center justify-start bg-[#FCFCFC] py-6 pr-0 dark:bg-[#1A1A18]"
        >
          <div className="flex w-full flex-col items-center justify-center space-y-9 border-b-2 border-[#EFEFEF] px-3 pb-6 dark:border-[#868B90]">
            <div className="flex h-7 w-7 items-center justify-center">
              <div
                id="open-nav-btn"
                className="flex h-7 w-7 items-center"
                onClick={onOpen}
                role="button"
                tabIndex={0}
                aria-label="open navigation"
              >
                <HamburgerIcon className="dark:fill-white" />
              </div>
            </div>
            <div className="mt-2 flex h-7 w-7">
              <Link href="/" className="w-full" aria-label="3drgb home">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/home-page/images/3ddmetaa143.png" alt="" className="w-full" />
              </Link>
            </div>
            <div className="flex h-7 w-7">
              {user ? (
                <Link href="/profile" className="w-full">
                  {userAvatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={userAvatar} className="aspect-square w-full rounded-full border" alt="" />
                  ) : (
                    <div className="aspect-square w-full rounded-full bg-gray-300" />
                  )}
                </Link>
              ) : (
                <Button
                  variant="unstyled"
                  onClick={onLogin}
                  aria-label="profile"
                  className="w-full rounded-full bg-gray-300"
                >
                  <GuestAvatarIcon />
                </Button>
              )}
            </div>
            <div className="h-7 w-7">
              <Link href="/cart" aria-label="cart" className="w-full">
                <CartIcon className="h-7 w-7" fill="#868B90" />
              </Link>
            </div>
          </div>

          <div className="flex h-auto flex-col items-center gap-11 overflow-y-scroll !overflow-y-scroll pb-40 pr-4 pt-7 scrollbar">
            <div className="h-7 w-7">
              <Link href="/products" className="w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="aspect-square h-7 w-7" src="/home-page/images/image25(1).png" alt="3drgb" />
              </Link>
            </div>
            <div className="h-7 w-7">
              <a href="#" className="w-full" aria-label="3drgb">
                <ModelsBankIcon />
              </a>
            </div>
            <div className="h-7 w-7">
              <Link href="/submit-order" aria-label="sumbit order" className="w-full">
                <SubmitOrderIcon />
              </Link>
            </div>
            <div className="h-7 w-7">
              <Link href="/contact-us" aria-label="contact us" className="w-full">
                <ContactIcon />
              </Link>
            </div>
            <div className="h-7 w-7">
              <Link href="/about-us" aria-label="about us" className="w-full">
                <AboutIcon />
              </Link>
            </div>
            <div className="h-7 w-7">
              <a href="#" className="w-full" aria-label="lang">
                <LanguageIcon />
              </a>
            </div>
          </div>

          <div className="absolute bottom-0 z-10 h-auto w-full space-y-6 bg-white px-3 pt-1 pb-5 dark:bg-[#1A1A18]">
            <div className="w-10 items-center justify-center">
              {!user ? (
                <Button
                  variant="primary"
                  onClick={onLogin}
                  aria-label="login"
                  className="flex h-10 w-full cursor-pointer items-center justify-center !p-2 font-bold"
                >
                  <LoginIcon className="h-6 w-6 shrink-0" />
                </Button>
              ) : (
                <Button
                  variant="danger"
                  onClick={onLogout}
                  aria-label="logout"
                  className="flex h-10 w-full cursor-pointer items-center justify-center !p-2 font-bold"
                >
                  <LoginIcon className="h-6 w-6 shrink-0 [&_path]:stroke-white dark:[&_path]:stroke-white" />
                </Button>
              )}
            </div>
            <div className="flex justify-center border-t-2 border-[#EFEFEF] pt-6 dark:border-[#868B90]">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F4F4F4] dark:bg-black">
                {!dark ? (
                  <Button
                    variant="unstyled"
                    className="enable-dark-mode2 flex items-center justify-center w-10 h-10 rounded-full bg-transparent"
                    aria-label="enable dark mode"
                    onClick={() => onToggleDark(true)}
                  >
                    <span className="flex items-center justify-center w-6 h-6">
                      <MoonIcon />
                    </span>
                  </Button>
                ) : (
                  <Button
                    variant="unstyled"
                    className="disable-dark-mode2 flex items-center justify-center w-10 h-10 rounded-full bg-[#FCFCFC] shadow-[0_0_6px_0_rgba(0,0,0,0.1)] dark:bg-transparent dark:shadow-none"
                    aria-label="disable dark mode"
                    onClick={() => onToggleDark(false)}
                  >
                    <span className="flex items-center justify-center w-6 h-6">
                      <SunIcon />
                    </span>
                  </Button>
                )}
              </div>
            </div>

          </div>
        </nav>
      </div>
    </div>
  );
}
