import type { Metadata } from "next";
import { LegalTopBar } from "@/components/layout/LegalTopBar";
import { SubmitOrderForm } from "@/components/submit-order/SubmitOrderForm";

export const metadata: Metadata = {
  title: "ثبت سفارش",
};

export default function SubmitOrderPage() {
  return (
    <div>
      <main>
        <LegalTopBar />
        <section className="mx-auto mt-24 max-w-[1500px] p-4 lg:mt-14 lg:p-9">
          <div className="mx-auto w-full rounded-xl bg-white p-5 dark:bg-[#1A1A18] dark:text-white lg:w-[70%] lg:p-7 2xl:w-[55%]">
            <h1 className="font-rokh py-5 text-center text-lg font-bold dark:text-white md:text-2xl">
              جهت ثبت سفارش طراحی، فرم زیرا پر کنید.
            </h1>

            <div className="flex w-full flex-col justify-center gap-7">
              <div className="flex w-full flex-col justify-center gap-2 md:gap-7">
                <SubmitOrderForm />
              </div>

              <div className="mx-auto flex flex-col gap-7 text-center">
                <p className="font-rokh text-3xl">تماس با تیم مشاوره</p>
                <div className="flex flex-col gap-3 text-xl text-black/50 dark:text-gray-300">
                  <a href="tel:09337850424" className="font-rokh" dir="ltr">
                    ۰۹۳۳- ۷۸۵۰۴۲۴
                  </a>
                  <a href="maileto:3dmeta.irpsc@gmail.com" className="font-rokh">
                    3dmeta.irpsc@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
