"use client";

import Link from "next/link";
import type { CategorySummary } from "@/lib/types";
import { EmptyPage } from "@/components/ui/empty-page";
import { HomeSlider } from "@/components/home/HomeSlider";

const DEFAULT_IMAGE = "/home-page/images/default-product.jpg";

type Props = {
  categories: CategorySummary[];
};

export function TopLevelCategorySlider({ categories }: Props) {
  if (categories.length === 0) {
    return (
      <div className="relative w-full">
        <EmptyPage message="دسته بندی یافت نشد" />
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div className="overflow-x-hidden" dir="ltr">
        <HomeSlider
          dir="ltr"
          slideClassName="mt-10 !flex"
          resetKey={categories.map((c) => c.id).join("-")}
        >
          {categories.map((category) => (
            <div key={category.id} className="w-full">
              <Link
                href={category.url}
                className="flex w-full flex-col items-center justify-between gap-16 overflow-hidden rounded-xl bg-white p-5 pb-7 text-center dark:bg-[#1A1A18]"
              >
                <div className="aspect-square w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={category.image?.url || DEFAULT_IMAGE}
                    loading="lazy"
                    alt={`دسته بندی ${category.name}`}
                    className="w-full rounded-xl"
                    onError={(e) => {
                      e.currentTarget.src = DEFAULT_IMAGE;
                    }}
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <p
                    className="font-rokh mt-2 p-0 text-3xl font-bold text-[#000BEE] dark:text-[#E8E9FF]"
                  >
                    {category.name}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </HomeSlider>
      </div>
    </div>
  );
}
