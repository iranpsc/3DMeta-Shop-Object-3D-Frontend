"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ui/product-card";
import { EmptyPage } from "@/components/ui/empty-page";
import { HomeSlider } from "@/components/home/HomeSlider";
import { clientFetchProducts } from "@/lib/storefront-client-api";
import type { ProductCard as ProductCardType } from "@/lib/types";

const TABS = [
  {
    id: "order-by-score",
    label: "بالاترین امتیاز",
    sort: "score" as const,
    ariaLabel: "Sort by highest score",
  },
  {
    id: "order-by-newest",
    label: "جدید ترین",
    sort: "newest" as const,
    ariaLabel: "Sort by newest",
    bordered: true,
  },
  {
    id: "order-by-sales",
    label: "پرفروش ترین",
    sort: "sales" as const,
    ariaLabel: "Sort by best selling",
  },
];

type TabSwitcherProps = {
  initialProducts: ProductCardType[];
  initialSort?: "newest" | "score" | "sales";
};

export function TabSwitcher({
  initialProducts,
  initialSort = "newest",
}: TabSwitcherProps) {
  const [active, setActive] = useState(initialSort);
  const [products, setProducts] = useState(initialProducts);
  const [isPending, startTransition] = useTransition();

  function changeTab(sort: "newest" | "score" | "sales") {
    if (sort === active) return;
    setActive(sort);
    startTransition(async () => {
      try {
        const res = await clientFetchProducts({ sort, take: 15 });
        setProducts(res.data ?? []);
      } catch {
        setProducts([]);
      }
    });
  }

  return (
    <section className="mx-auto w-full max-w-[1500px] px-5 lg:px-9 3xl:px-0">
      <div>
        <p
          className="mt-32 py-3 text-center text-4xl font-bold text-[#000BEE] dark:text-white"
          style={{ fontFamily: "rokh-ebold" }}
        >
          محصولات ما
        </p>
      </div>
      <div className="mx-auto w-full">
        <div className="py-4">
          <nav
            className="font-rokh flex justify-center gap-2 py-5 font-bold lg:text-2xl"
            role="tablist"
          >
            {TABS.map((tab) => (
              <Button
                key={tab.id}
                variant="tab"
                id={tab.id}
                role="tab"
                aria-label={tab.ariaLabel}
                aria-selected={active === tab.sort}
                bordered={tab.bordered}
                active={active === tab.sort}
                onClick={() => changeTab(tab.sort)}
              >
                {tab.label}
              </Button>
            ))}
          </nav>
        </div>
      </div>
      <div className="relative">
        <div
          className={`overflow-x-hidden ${isPending ? "pointer-events-none opacity-60" : ""}`}
          dir="rtl"
          aria-busy={isPending}
        >
          {products.length === 0 ? (
            <EmptyPage message="محصولی یافت نشد" />
          ) : (
            <HomeSlider
              dir="rtl"
              slideClassName="!flex"
              resetKey={`${active}-${products.map((p) => p.id).join("-")}`}
            >
              {products.map((product, index) => (
                <div key={product.id} className="flex w-full">
                  <ProductCard product={product} imagePriority={index < 3} />
                </div>
              ))}
            </HomeSlider>
          )}
        </div>
      </div>
    </section>
  );
}
