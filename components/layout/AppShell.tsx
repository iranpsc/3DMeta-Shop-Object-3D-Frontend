"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { loginRedirect } from "@/lib/auth";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { AppFooter } from "./AppFooter";
import { CartIcon, HamburgerIcon, ProfileIcon } from "./icons";
import { SideNav } from "./SideNav";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const [navOpen, setNavOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const { user, logout } = useAuth();
  const { count: cartCount } = useCart();

  useEffect(() => {
    const stored = window.localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const enabled = stored === "dark" || (!stored && prefersDark);
    setDark(enabled);
    document.documentElement.classList.toggle("dark", enabled);
  }, []);

  function toggleDark(enabled: boolean) {
    setDark(enabled);
    document.documentElement.classList.toggle("dark", enabled);
    window.localStorage.setItem("theme", enabled ? "dark" : "light");
  }

  async function handleLogout() {
    try {
      await logout();
    } finally {
      window.location.href = "/";
    }
  }

  function openNav() {
    setNavOpen(true);
  }

  function closeNav() {
    setNavOpen(false);
  }

  return (
    <div className="relative min-h-screen w-full bg-[#ECF4FE] bg-gradient-to-t from-[#ECF4FE] to-[#DAE7FE] dark:from-black dark:via-black dark:to-black">
      <header>
        {/* mobile top bar */}
        <nav className="fixed top-0 z-[1000] m-0 w-full p-0 lg:hidden">
          <div className="flex w-full items-center justify-between bg-white p-4 dark:bg-[#1A1A18]">
            <div className="fixed top-0 right-0 flex w-full items-center justify-between bg-white px-5 py-4 dark:bg-[#1A1A18] lg:relative lg:bg-transparent lg:p-0">
              <div
                className="flex w-1/3 cursor-pointer rounded-full p-3"
                onClick={openNav}
                role="button"
                tabIndex={0}
                aria-label="open navigation"
              >
                <HamburgerIcon className="lg:hidden dark:fill-white" />
              </div>
              <div className="flex w-1/3 items-center justify-center lg:w-auto">
                <Link href="/">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/home-page/images/3ddmetaa143.png" alt="3Dmeta" />
                </Link>
              </div>
              <div className="flex w-1/3 items-center justify-end gap-6 lg:hidden">
                <Link
                  href={user ? "/profile" : "#"}
                  className="w-5"
                  aria-label="user profile"
                  onClick={
                    !user
                      ? (e) => {
                          e.preventDefault();
                          loginRedirect();
                        }
                      : undefined
                  }
                >
                  <ProfileIcon />
                </Link>
                <Link href="/cart" className="w-5" aria-label="cart">
                  <CartIcon />
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <SideNav
          navOpen={navOpen}
          user={user}
          dark={dark}
          cartCount={cartCount}
          onOpen={openNav}
          onClose={closeNav}
          onToggleDark={toggleDark}
          onLogin={loginRedirect}
          onLogout={handleLogout}
        />
      </header>

      <div className={`${navOpen ? "main-content-activeNav" : "main-content-smallNav"} w-full pt-16 lg:pt-0`}>
        {children}
        <AppFooter />
      </div>
    </div>
  );
}
