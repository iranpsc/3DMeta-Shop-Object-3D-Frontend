"use client";

import Link from "next/link";
import type { CategorySummary } from "@/lib/types";
import { EmptyPage } from "@/components/ui/empty-page";
import {
  HomeSlider,
  POPULAR_CATEGORY_BREAKPOINTS,
} from "@/components/home/HomeSlider";

const DEFAULT_IMAGE = "/home-page/images/default-product.jpg";

type Props = {
  categories: CategorySummary[];
};

export function PopularCategories({ categories }: Props) {
  return (
    <section className="mx-auto w-full max-w-[1500px] px-0 lg:px-9 3xl:px-0">
      <div className="flex w-full flex-col md:mt-32">
        <div className="relative w-full flex-col">
          <div className="flex flex-col gap-3 px-5 text-center md:text-right">
            <p
              className="m-0 p-0 text-[26px] font-extrabold text-[#000BEE] md:text-4xl dark:text-white"
              style={{ fontFamily: "rokh-ebold" }}
            >
              دسته بندی های پر طرفدار
            </p>
            <p className="text-base text-stone-800 dark:text-white">
              لیستی از محصولات سه بعدی ، انیمیشن آیکون و فایل های ایلستریتور
            </p>
          </div>

          <div
            className="my-5 w-full overflow-x-hidden overflow-y-hidden py-5 pl-5 md:pl-0"
            dir="ltr"
          >
            {categories.length === 0 ? (
              <EmptyPage message="دسته بندی یافت نشد" />
            ) : (
              <HomeSlider
                dir="ltr"
                breakpoints={POPULAR_CATEGORY_BREAKPOINTS}
                spaceBetween={20}
                slideClassName="!flex"
                resetKey={categories.map((c) => c.id).join("-")}
              >
                {categories.map((category) => (
                  <div key={category.id} className="relative flex w-full">
                    <Link
                      href={category.url}
                      className="flex w-full flex-col items-center justify-center gap-7 overflow-hidden rounded-[20px] bg-white p-3 pb-7 text-center dark:bg-[#1A1A18]"
                    >
                      <div className="w-full">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={category.image?.url ?? DEFAULT_IMAGE}
                          alt={`دسته ${category.name}`}
                          loading="lazy"
                          className="w-full rounded-xl"
                          onError={(e) => {
                            e.currentTarget.src = DEFAULT_IMAGE;
                          }}
                        />
                      </div>
                      <div>
                        <p className="text-xl font-bold text-[#000BEE] md:text-3xl dark:text-[#E8E9FF]">
                          {category.name}
                        </p>
                      </div>
                    </Link>
                  </div>
                ))}
              </HomeSlider>
            )}
          </div>

          <div className="absolute flex w-full items-center justify-center gap-5 md:top-7 md:left-0 md:w-max">
            <div>
              <Link
                href="/categories"
                className="rounded-3xl bg-[#CDD6FC] px-3 py-3 text-lg font-bold text-[#000BEE] md:px-5 md:text-xl dark:bg-[#271A04] dark:text-[#E59819]"
              >
                مشاهده همه
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
