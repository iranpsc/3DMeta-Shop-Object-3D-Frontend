"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Reviews } from "@/components/product/Reviews";
import type { ProductDetail, ReviewItem } from "@/lib/types";

type Props = {
  product: ProductDetail;
  reviews: ReviewItem[];
  ratingBreakdown: Record<string, number>;
  usersCount: number;
};

export function ProductDetailTabs({
  product,
  reviews,
  ratingBreakdown,
  usersCount,
}: Props) {
  const [tab, setTab] = useState<"desc" | "reviews">("desc");
  const attrs =
    product.attributes?.filter(
      (a) => a.slug !== "convertable_to_3d_model",
    ) ?? [];

  return (
    <section className="mx-auto mt-20 max-w-[1500px] p-4 lg:mt-14 lg:p-9">
      <div className="border-b-2 border-gray-200 dark:border-gray-700">
        <nav className="mb-[-2px] flex justify-start gap-10" aria-label="Tabs" role="tablist">
          <Button
            variant="tab-underline"
            role="tab"
            aria-selected={tab === "desc"}
            active={tab === "desc"}
            onClick={() => setTab("desc")}
          >
            توضیحات
          </Button>
          <Button
            variant="tab-underline"
            role="tab"
            aria-selected={tab === "reviews"}
            active={tab === "reviews"}
            onClick={() => setTab("reviews")}
          >
            بررسی ها
          </Button>
        </nav>
      </div>

      <div className="mt-7">
        {tab === "desc" ? (
          <div className="flex flex-col gap-4" role="tabpanel">
            <div className="flex flex-col justify-between gap-5 rounded-[10px] bg-white p-5 px-4 dark:bg-[#1A1A18] dark:text-white">
              <p className="text-gray-800 dark:text-white">توضیحات :</p>
              <p className="whitespace-pre-line text-[#667085] dark:text-white">
                {product.long_description}
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {attrs.map((attribute) => (
                <div
                  key={attribute.id}
                  className="flex items-center justify-between rounded-[10px] bg-white p-5 px-4 dark:bg-[#1A1A18]"
                >
                  <p className="text-gray-800 dark:text-gray-300">{attribute.name}</p>
                  <p className="text-[#667085] dark:text-gray-300">{attribute.value}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full space-y-10 lg:w-[60%]" role="tabpanel">
            <Reviews
              sku={product.sku}
              initialReviews={reviews}
              ratingBreakdown={ratingBreakdown}
              usersCount={usersCount}
              ratingAvg={product.rating_avg}
              canReviewHint={Boolean(product.customer_can_add_review)}
            />
          </div>
        )}
      </div>
    </section>
  );
}
