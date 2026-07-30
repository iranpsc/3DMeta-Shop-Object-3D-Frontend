"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { CategorySummary, TagSummary } from "@/lib/types";
import {
  PRICE_MAX_DEFAULT,
  PRICE_MAX_LIMIT,
  PRICE_MIN_LIMIT,
  VISIBLE_TAGS_COUNT,
  type StoreFilterState,
} from "./store-utils";

type NavigateHandler = (
  updates: Partial<StoreFilterState>,
  scrollToList?: boolean,
) => void;

type Props = {
  categories: CategorySummary[];
  tags: TagSummary[];
  current: StoreFilterState;
  isPending?: boolean;
  onNavigate: NavigateHandler;
};

function StoreTagsFilter({
  tags,
  selectedTags,
  isPending,
  onToggle,
}: {
  tags: TagSummary[];
  selectedTags: Set<string>;
  isPending?: boolean;
  onToggle: (slug: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const showToggle = tags.length > 2;

  return (
    <div className="w-full space-y-5 bg-white p-5 text-sm text-[#848383] dark:bg-[#1A1A18] dark:text-[#F8F8F8] lg:rounded-[10px]">
      <div>
        <p className="py-2 text-xl font-bold text-[#515151] dark:text-white">
          برچسب ها
        </p>
      </div>
      <div className="grid grid-cols-2 gap-5 items2">
        {tags.map((tag, index) => (
          <div
            key={tag.id}
            className={`item2 flex items-center gap-5 ${
              !expanded && index >= VISIBLE_TAGS_COUNT ? "hidden" : ""
            }`}
          >
            <input
              type="checkbox"
              id={`tag-${tag.id}`}
              value={tag.slug}
              checked={selectedTags.has(tag.slug)}
              onChange={() => onToggle(tag.slug)}
              className="h-[22px] w-[22px] rounded-lg"
              disabled={isPending}
            />
            <label htmlFor={`tag-${tag.id}`}>{tag.name}</label>
          </div>
        ))}
        {showToggle ? (
          <div>
            <a
              href="#"
              role="button"
              aria-expanded={expanded}
              onClick={(event) => {
                event.preventDefault();
                setExpanded((value) => !value);
              }}
              className={`showMore2 ${expanded ? "showLess2" : ""}`}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function StoreFilters({
  categories,
  tags,
  current,
  isPending,
  onNavigate,
}: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [minPrice, setMinPrice] = useState(
    Number(current.price_min || PRICE_MIN_LIMIT),
  );
  const [maxPrice, setMaxPrice] = useState(
    Number(current.price_max || PRICE_MAX_DEFAULT),
  );
  const selectedTags = new Set(current.tags);

  useEffect(() => {
    setMinPrice(Number(current.price_min || PRICE_MIN_LIMIT));
    setMaxPrice(Number(current.price_max || PRICE_MAX_DEFAULT));
  }, [current.price_min, current.price_max]);

  useEffect(() => {
    const currentMin = Number(current.price_min || PRICE_MIN_LIMIT);
    const currentMax = Number(current.price_max || PRICE_MAX_DEFAULT);

    if (minPrice === currentMin && maxPrice === currentMax) {
      return;
    }

    const timeout = window.setTimeout(() => {
      onNavigate({
        price_min: minPrice > 0 ? String(minPrice) : "",
        price_max: maxPrice < PRICE_MAX_DEFAULT ? String(maxPrice) : "",
      });
    }, 500);

    return () => window.clearTimeout(timeout);
  }, [minPrice, maxPrice, current.price_min, current.price_max, onNavigate]);

  function toggleTag(slug: string) {
    const next = new Set(selectedTags);
    if (next.has(slug)) next.delete(slug);
    else next.add(slug);
    const tagList = Array.from(next);
    onNavigate({
      tag: tagList.join(","),
      tags: tagList,
      search: "",
      category: "",
    });
    setMobileOpen(false);
  }

  const panel = (
    <div className="store-filters space-y-6">
      <div className="w-full rounded-[10px] bg-white p-5 dark:bg-[#1A1A18]">
        <div className="flex items-center justify-between px-4 py-3">
          <p className="text-xl text-[#FAB62F]">همه</p>
          <Button
            variant="unstyled"
            onClick={() => setMobileOpen(false)}
            className="h-10 w-10 rotate-45 rounded-full bg-[#EFEFEF] text-3xl lg:hidden"
          >
            +
          </Button>
        </div>
        <div className="scrollbar-hidden max-h-[640px] space-y-2 overflow-y-auto">
          {categories.length === 0 ? (
            <span className="p-2 text-[#848383] dark:text-gray-300">
              دسته ای وجود ندارد
            </span>
          ) : (
            categories.map((cat) => (
              <div key={cat.id} className="item">
                <div className="inline-flex w-full items-center justify-between gap-x-3 px-2 py-1 text-start font-semibold text-[#848383] dark:text-gray-300">
                  <Button
                    variant="unstyled"
                    fullWidth
                    className="text-right font-semibold text-[#848383] dark:text-gray-300"
                    disabled={isPending}
                    onClick={() => {
                      onNavigate({
                        category: cat.slug,
                        search: "",
                        tag: "",
                        tags: [],
                      });
                      setMobileOpen(false);
                    }}
                  >
                    {cat.name}
                  </Button>
                  <span className="text-right text-xs">{cat.products_count}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="w-full space-y-5 bg-white p-5 text-[#848383] dark:bg-[#1A1A18] dark:text-[#F8F8F8] lg:rounded-[10px]">
        <div>
          <p>فیلتر براساس قیمت ( تومان )</p>
        </div>
        <div className="flex flex-col gap-3">
          <span className="multi-range">
            <input
              type="range"
              min={PRICE_MIN_LIMIT}
              max={PRICE_MAX_LIMIT}
              step={1}
              value={minPrice}
              disabled={isPending}
              onChange={(e) => setMinPrice(Number(e.target.value))}
              id="minPrice"
              name="minprice"
            />
            <input
              type="range"
              min={PRICE_MIN_LIMIT}
              max={9000000}
              step={1}
              value={maxPrice}
              disabled={isPending}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              id="maxPrice"
              name="maxprice"
            />
          </span>
        </div>
        <div className="flex items-center gap-3">
          <label htmlFor="minprice" id="priceFilterMin">
            {minPrice} تومان
          </label>
          <hr className="w-10 border" />
          <label htmlFor="maxprice" id="priceFilterMax">
            {maxPrice} تومان
          </label>
        </div>
      </div>

      <StoreTagsFilter
        tags={tags}
        selectedTags={selectedTags}
        isPending={isPending}
        onToggle={toggleTag}
      />
    </div>
  );

  return (
    <>
      <Button variant="filter" onClick={() => setMobileOpen(true)} className="lg:hidden">
        فیلتر
      </Button>

      <div
        id="fillterContainer"
        className={`${
          mobileOpen
            ? "fixed inset-0 z-[1100] block overflow-y-auto bg-white p-5 dark:bg-[#1A1A18]"
            : "hidden"
        } h-min w-full space-y-6 lg:relative lg:block lg:w-full lg:bg-transparent lg:p-0 dark:lg:bg-transparent`}
      >
        {panel}
      </div>
    </>
  );
}

export function StoreSearchSort({
  current,
  isPending,
  onNavigate,
}: {
  current: StoreFilterState;
  isPending?: boolean;
  onNavigate: NavigateHandler;
}) {
  const [search, setSearch] = useState(current.search);

  useEffect(() => {
    setSearch(current.search);
  }, [current.search]);

  useEffect(() => {
    if (search === current.search) return;

    const timeout = window.setTimeout(() => {
      onNavigate({
        search: search.trim(),
        category: "",
        tag: "",
        tags: [],
      });
    }, 2000);

    return () => window.clearTimeout(timeout);
  }, [search, current.search, onNavigate]);

  const sorts = [
    { key: "newest", label: "جدید ترین" },
    { key: "most-sales", label: "پر فروش ترین" },
    { key: "most-expensive", label: "گرانترین" },
    { key: "cheapest", label: "ارزان ترین" },
  ];

  return (
    <div className="flex min-w-0 flex-col-reverse gap-6 lg:flex-row">
      <nav
        role="tablist"
        className="scrollbar flex min-w-0 w-full items-center gap-6 overflow-x-auto overflow-y-hidden lg:w-[70%]"
        style={{ height: 55 }}
      >
        <div className="hidden w-max shrink-0 font-bold lg:block dark:text-white">
          <p className="w-max">مرتب سازی :</p>
        </div>
        {sorts.map((item) => (
          <Button
            key={item.key}
            variant="sort-pill"
            role="tab"
            aria-selected={current.sort === item.key}
            active={current.sort === item.key}
            disabled={isPending}
            onClick={() => onNavigate({ sort: item.key })}
          >
            {item.label}
          </Button>
        ))}
      </nav>

      <div className="relative flex w-full min-w-0 gap-5 lg:w-[30%]">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="جستجو"
          disabled={isPending}
          className="relative w-full min-w-0 rounded-[32px] border-0 bg-[#c4d8ff] px-5 py-3 pl-11 font-bold text-[#000cee57] focus:outline-none dark:bg-[#1A1A18] dark:text-[#ACB9FA]"
        />
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          className="absolute left-5 top-3"
        >
          <path
            className="dark:stroke-white"
            d="M11.4582 21.7501C17.1421 21.7501 21.7498 17.1423 21.7498 11.4584C21.7498 5.77448 17.1421 1.16675 11.4582 1.16675C5.77424 1.16675 1.1665 5.77448 1.1665 11.4584C1.1665 17.1423 5.77424 21.7501 11.4582 21.7501Z"
            stroke="#000BEE"
            strokeWidth="2"
          />
          <path
            className="dark:stroke-white"
            d="M22.8332 22.8334L20.6665 20.6667"
            stroke="#000BEE"
            strokeWidth="2"
          />
        </svg>
      </div>
    </div>
  );
}
