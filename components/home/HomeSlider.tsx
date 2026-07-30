"use client";

import { Children, type ReactNode } from "react";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { SwiperOptions } from "swiper/types";
import "swiper/css";

/** Matches Livewire/Blade home Swiper config in app.blade.php */
export const HOME_SLIDER_BREAKPOINTS: SwiperOptions["breakpoints"] = {
  0: {
    slidesPerView: 1.15,
    spaceBetween: 12,
  },
  480: {
    slidesPerView: 1.35,
    spaceBetween: 12,
  },
  768: {
    slidesPerView: 2,
    spaceBetween: 20,
  },
  1200: {
    slidesPerView: 3,
    spaceBetween: 20,
  },
  1550: {
    slidesPerView: 4,
    spaceBetween: 20,
  },
};

/** More slides for compact popular-category cards */
export const POPULAR_CATEGORY_BREAKPOINTS: SwiperOptions["breakpoints"] = {
  0: {
    slidesPerView: 2.15,
    spaceBetween: 12,
  },
  480: {
    slidesPerView: 2.4,
    spaceBetween: 16,
  },
  768: {
    slidesPerView: 3,
    spaceBetween: 20,
  },
  1024: {
    slidesPerView: 4,
    spaceBetween: 24,
  },
  1280: {
    slidesPerView: 5,
    spaceBetween: 28,
  },
  1550: {
    slidesPerView: 6,
    spaceBetween: 28,
  },
};

type HomeSliderProps = {
  children: ReactNode;
  dir?: "rtl" | "ltr";
  className?: string;
  slideClassName?: string;
  breakpoints?: SwiperOptions["breakpoints"];
  spaceBetween?: number;
  autoplay?: boolean;
  /** Prefer rewind over loop — loop breaks when slide count is low (mobile). */
  rewind?: boolean;
  /** Remount key when slide set changes (e.g. tab switch) */
  resetKey?: string | number;
};

export function HomeSlider({
  children,
  dir = "ltr",
  className = "",
  slideClassName = "",
  breakpoints = HOME_SLIDER_BREAKPOINTS,
  spaceBetween = 12,
  autoplay = true,
  rewind = true,
  resetKey,
}: HomeSliderProps) {
  const slides = Children.toArray(children);

  if (slides.length === 0) {
    return null;
  }

  return (
    <Swiper
      key={resetKey}
      modules={[Autoplay]}
      direction="horizontal"
      loop={false}
      rewind={rewind && slides.length > 1}
      spaceBetween={spaceBetween}
      autoplay={
        autoplay && slides.length > 1
          ? {
              delay: 2500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }
          : false
      }
      breakpoints={breakpoints}
      dir={dir}
      className={`swiper-slider w-full overflow-hidden ${className}`}
      observer
      observeParents
      watchOverflow
      // Mobile touch reliability
      simulateTouch
      allowTouchMove
      touchStartPreventDefault={false}
      touchMoveStopPropagation={false}
      threshold={5}
      resistanceRatio={0.85}
      grabCursor
    >
      {slides.map((child, index) => (
        <SwiperSlide key={index} className={`!h-auto ${slideClassName}`}>
          {child}
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
