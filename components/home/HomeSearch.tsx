"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { SearchIcon, SearchIconLarge } from "./icons";

type HomeSearchProps = {
  variant: "desktop" | "mobile";
};

export function HomeSearch({ variant }: HomeSearchProps) {
  const [term, setTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function onSearch() {
    const value = term.trim();
    if (value.length < 3) {
      setError("حداقل ۳ کاراکتر وارد کنید.");
      return;
    }
    setError(null);
    startTransition(() => {
      // pending indicator while navigating (Livewire uses hard redirect)
    });
    // Match Livewire Home::search hard redirect
    window.location.assign(`/products?search=${encodeURIComponent(value)}`);
  }

  if (variant === "desktop") {
    return (
      <div className="relative mt-20 hidden gap-5 lg:flex">
        <input
          type="text"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
          placeholder="جستجوی محصول"
          className="relative w-full rounded-[32px] border-0 bg-[#D8E5FD] p-5 pr-12 font-bold text-gray-500 placeholder:text-primery-blue focus:border-0 focus:outline-none focus:ring-0 md:px-20 dark:bg-black dark:text-[#C1C1C1] dark:placeholder:text-[#C1C1C1]"
        />
        <SearchIcon className="absolute top-5 right-5" />
        <Button
          variant="search"
          onClick={onSearch}
          disabled={isPending}
          className="w-max px-5 pt-[18px] pb-5 md:px-14 md:text-xl"
        >
          جستجو
        </Button>
        {error ? (
          <p className="absolute -bottom-8 right-0 text-sm text-red-500">{error}</p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="mt-5 flex rounded-full bg-[#D8E5FD] p-2 lg:hidden dark:bg-black">
      <div className="flex w-min items-center justify-center p-3">
        <SearchIconLarge />
      </div>
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
        placeholder="جستجوی محصول"
        className="mr-[-14px] w-full border-0 bg-transparent font-bold text-gray-500 ring-transparent outline-transparent placeholder:text-primery-blue focus:!right-0 focus:border-0 focus:!outline-0 focus:ring-transparent dark:text-gray-400 dark:placeholder:text-[#C1C1C1]"
      />
      <Button
        variant="search"
        onClick={onSearch}
        disabled={isPending}
        className="min-w-max w-[30%] px-5 pt-[15px] pb-4 md:text-xl lg:w-[20%]"
      >
        جستجو
      </Button>
      {error ? (
        <p className="absolute mt-16 text-sm text-red-500">{error}</p>
      ) : null}
    </div>
  );
}
