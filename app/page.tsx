import type { Metadata } from "next";
import Link from "next/link";
import { AvatarViewer } from "@/components/home/AvatarViewer";
import { ArrowLeftIcon } from "@/components/home/icons";
import { HomeSearch } from "@/components/home/HomeSearch";
import { PopularCategories } from "@/components/home/PopularCategories";
import { TabSwitcher } from "@/components/home/TabSwitcher";
import { TopLevelCategorySlider } from "@/components/home/TopLevelCategorySlider";
import { LegalTopBar } from "@/components/layout/LegalTopBar";
import { JsonLd } from "@/components/seo/JsonLd";
import { homeMetadata } from "@/lib/page-metadata";
import {
  fetchHomeProducts,
  fetchPopularCategories,
  fetchTopLevelCategories,
} from "@/lib/storefront-server-api";
import { buildHomeWebSiteSchema } from "@/lib/seo-schemas";

export const metadata: Metadata = homeMetadata;

export default async function HomePage() {
  let products: Awaited<ReturnType<typeof fetchHomeProducts>> = [];
  let popularCategories: Awaited<ReturnType<typeof fetchPopularCategories>> = [];
  let topLevelCategories: Awaited<ReturnType<typeof fetchTopLevelCategories>> = [];

  try {
    [products, popularCategories, topLevelCategories] = await Promise.all([
      fetchHomeProducts("newest"),
      fetchPopularCategories(12),
      fetchTopLevelCategories(),
    ]);
  } catch {
    // API may be offline during local UI/E2E shell checks
  }

  return (
    <div>
      <JsonLd data={buildHomeWebSiteSchema()} />
      <main>
        <LegalTopBar />

        <div>
          <div className="relative w-full bg-[#ECF4FE] dark:bg-[#1A1A18]">
            <div className="mx-auto flex w-full flex-col items-center justify-between gap-10 px-10 py-5 md:flex-row md:px-10 lg:px-20">
              <div className="mt-20 flex w-full flex-col justify-center lg:mt-0 md:w-3/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/home-page/images/Asset2.png"
                  alt="3dmodel"
                  className="mx-auto w-full md:hidden"
                />
                <p
                  className="text-head py-3 text-center text-6xl leading-[60px] text-[#000BEE] md:text-right dark:text-white"
                  style={{ fontFamily: "rokh-ebold" }}
                >
                  مدل سه بعدی و تجربه ای متفاوت
                </p>
                <p
                  className="mt-5 text-center text-xl font-bold text-stone-800 lg:text-2xl md:text-right dark:text-white"
                  style={{ lineHeight: "50px" }}
                >
                  ما اینجا هستیم تا روزانه محصولات سه بعدی را در اختیار شما طراحان
                  قرار دهیم . سامانه سه بعدی متا با تعرفه ای ثابت مرکز عرضه جدید
                  ترین مدل سه بعدی ، آیکون ، انیمیشن و دیگر فایل های طراحی میباشد
                  .
                </p>
                <HomeSearch variant="desktop" />
              </div>
              <div className="flex w-full flex-col items-center justify-end overflow-hidden md:w-1/2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/home-page/images/Asset2.png"
                  alt="3dmodel"
                  className="hidden md:block"
                  style={{ width: "125%", maxWidth: "none" }}
                />
                <HomeSearch variant="mobile" />
              </div>
            </div>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            id="home-img2"
            src="/home-page/images/output-onlinepngtools.png"
            alt="body"
            className="home-wave mb-36 hidden w-full overflow-hidden select-none dark:block"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            id="home-img"
            src="/home-page/images/helal.png"
            alt="body"
            className="home-wave mb-36 w-full overflow-hidden select-none dark:hidden"
          />
        </div>

        <section
          className="mx-auto w-full max-w-[1500px] px-5 pt-5 lg:px-9 3xl:px-0"
          style={{ marginTop: "-140px" }}
        >
          <div className="space-y-5 md:space-y-10">
            <div className="flex w-full flex-col items-center justify-center gap-4 space-y-5 py-10">
              <p className="text-2xl font-bold text-stone-800 dark:text-[#D1D1D1]">
                محصولات ما
              </p>
              <p
                className="text-4xl font-extrabold text-[#000BEE] dark:text-[#E8E9FF]"
                style={{ fontFamily: "rokh-ebold" }}
              >
                هزاران فایل بینظیر
              </p>
            </div>
            <div>
              <TopLevelCategorySlider categories={topLevelCategories} />
            </div>
          </div>

          <div className="mt-28 flex w-full flex-col items-center gap-x-20 gap-y-10 px-5 py-32 md:flex-row">
            <div className="flex w-full items-center justify-center md:w-1/2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/home-page/images/222-min.png" alt="3dmodel" />
            </div>
            <div className="flex w-full flex-col items-center justify-center md:w-1/2 md:items-start">
              <p
                className="text-center text-[30px] font-extrabold text-[#000BEE] dark:text-[#E8E9FF]"
                style={{ fontFamily: "rokh-ebold" }}
              >
                مدل های سه بعدی
              </p>
              <p className="text-center font-medium leading-[30px] text-stone-800 dark:text-[#D1D1D1]">
                کیفیت طراحی های خود را با استفاده از مدل های سه بعدی افزایش دهید .
              </p>
              <Link
                href="/products"
                className="mt-5 flex w-max items-center justify-center gap-6 rounded-3xl bg-[#CDD6FC] px-5 py-3 text-base font-bold text-[#000BEE] md:gap-10 md:text-xl lg:text-2xl dark:bg-dark-yellow dark:text-black"
              >
                <p className="m-0 p-0">لیست مدل های سه بعدی</p>
                <ArrowLeftIcon />
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto my-20 mb-[400px] w-full max-w-[1500px] lg:px-9 3xl:px-0">
          <div className="ad-section flex flex-col items-center justify-between gap-y-7 lg:flex-row">
            <div className="background-shapes">
              <div className="shape" />
              <div className="shape" />
              <div className="shape" />
            </div>

            <div className="flex w-full flex-col items-center justify-start gap-10 lg:w-[60%]">
              <p
                className="px-14 py-10 text-[26px] text-[#000BEE] md:text-4xl dark:text-dark-yellow"
                style={{ fontFamily: "rokh-ebold" }}
              >
                {" "}
                آواتار رویایی خود را رایگان بسازید!{" "}
              </p>
              <p className="text-xl font-medium leading-[30px] text-stone-800 dark:text-[#D1D1D1]">
                فقط با چند کلیک، یک اواتار سفارشی مطابق با سلیقه خودتان بسازید.
                کاملاً رایگان و بدون محدودیت!
              </p>
              <Link
                href="/avatars"
                className="rounded-2xl bg-primery-blue px-10 py-3 text-white lg:text-xl dark:bg-dark-yellow dark:text-black"
              >
                همین حالا آواتار بسازید
              </Link>
            </div>
            <AvatarViewer />
          </div>
        </section>

        <PopularCategories categories={popularCategories} />

        <section className="mx-auto mt-32 flex w-full max-w-[1500px] items-center justify-center px-5 lg:px-9 3xl:px-0">
          <div className="flex w-full flex-col items-center justify-center gap-5 gap-y-10 rounded-3xl bg-[#000ceec2] px-7 py-12 text-center xl:flex-row xl:py-16 dark:bg-gradient-to-tl dark:from-[#014AA0] dark:to-[#012F65]">
            <div className="lg:w-[70%]">
              <h2
                className="font-rokh !leading-[70px] text-center text-3xl text-white 2xl:text-5xl"
              >
                “خدمات طراحی محیط های سه بعدی <br />
                به صورت Low-Poly و High-Poly”
              </h2>
            </div>
            <Link
              href="/submit-order"
              className="mx-auto flex h-max w-max items-center gap-6 rounded-full bg-white px-5 py-6 font-bold text-[#000BEE] md:gap-10 md:px-10 md:text-xl dark:bg-gradient-to-r dark:from-[#27507F] dark:via-[#365E8E] dark:to-[#416A9A] dark:text-white"
            >
              <p className="m-0 p-0">نمونه کار و ثبت سفارش</p>
              <ArrowLeftIcon fillClassName="dark:fill-white" />
            </Link>
          </div>
        </section>

        <TabSwitcher initialProducts={products} initialSort="newest" />
      </main>
    </div>
  );
}
