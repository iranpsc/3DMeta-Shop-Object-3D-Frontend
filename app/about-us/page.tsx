import type { Metadata } from "next";
import { LegalTopBar } from "@/components/layout/LegalTopBar";

export const metadata: Metadata = {
  title: "درباره ما",
};

const aboutPageSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About Us - سه بعدی متا فروشگاه",
  url: "/about-us",
  mainEntity: {
    "@type": "Organization",
    name: "سه بعدی متا فروشگاه",
    url: "/",
    logo: "/home-page/images/3d.png",
    sameAs: [
      "https://www.youtube.com/channel/UCG9jK8hoh9X5YoTs6Z1zlIQ",
      "https://discord.gg/xqBe3h9hnN",
      "https://www.instagram.com/modelify3d_com/",
      "https://pin.it/7C5mYf6Q6",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+989127855049",
      contactType: "Customer Service",
      areaServed: "IR",
      availableLanguage: "Persian",
    },
    description:
      "سه بعدی متا فروشگاه پیشرو در زمینه چاپ سه بعدی است که خدمات حرفه‌ای و محصولات با کیفیت بالا ارائه می‌دهد.",
    parentOrganization: {
      "@type": "Organization",
      name: "هولدینگ زنجیره تامین بهشت",
    },
    foundingDate: "2020",
    address: {
      "@type": "PostalAddress",
      addressCountry: "Iran",
      addressLocality: "Qazvin",
      addressRegion: "Qazvin Province",
      streetAddress: "Mirdamad, 824H+JG2",
    },
  },
};

export default function AboutUsPage() {
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }}
      />
      <main>
        <LegalTopBar />
        <section className="mx-auto mt-24 max-w-[1500px] p-4 lg:mt-14 lg:p-9">
          <div>
            <h1
              className="text-3xl font-bold text-[#414040] dark:text-white"
              style={{ fontFamily: "rokh-ebold" }}
            >
              درباره ما
            </h1>
            <p className="mt-5 text-justify leading-10 text-[#6A6A6A] md:text-xl dark:text-[#B2B2B2]">
              در سه بعدی متا، ما به دنیایی وارد می‌شویم که هنر و تکنولوژی به آغوش هم
              می‌رقصند. فروشگاه سه بعدی متا با هدف ارائه بهترین مدل‌های سه بعدی و آواتار
              با بهترین ویژگی‌ها و جزئیات، برای علاقه‌مندان به دنیای گرافیک دیجیتال و
              طراحی سه بعدی ایجاد شده است. چرا سه بعدی متا؟ ترکیب هنر و دیجیتال: در سه
              بعدی متا، هنرمندان و مهندسان دیجیتال همدستی می‌کنند تا آثاری شگفت‌انگیز را
              به وجود آورند. ترکیب دانش هنری با توانایی‌های فناوری نتایجی منحصر به فرد
              را به ارمغان می‌آورد. تنوع بی‌پایان: از مدل‌های شهرسازی گرفته تا شخصیت‌های
              دیجیتال، فروشگاه سه بعدی متا تنوع و گسترده‌ای از محصولات را به شما ارائه
              می‌دهند. هرچه که ذهن شما بپذیرد، در سه بعدی متا پیدا می‌شود. کیفیت بالا و
              جزئیات دقیق: تعهد ما به ارائه بهترین و با کیفیت‌ترین مدل‌های سه بعدی به
              شما تضمین می‌کند که هر اثر، شگفت‌انگیز و با جزئیات دقیق خود را به نمایش
              می‌گذارد. به ما بپیوندید و دنیایی از زیبایی و خلاقیت را تجربه کنید.
            </p>
          </div>

          <div className="mt-16 flex w-full flex-col gap-7 lg:flex-row">
            <div className="flex w-full items-center rounded-[30px] bg-white p-6 text-justify leading-10 text-[#6A6A6A] md:py-10 md:text-lg lg:w-2/3 dark:bg-[#1A1A18] dark:text-gray-400">
              <p>
                در فروشگاه سه بعدی متا، مرزها باز می‌شوند و شما به دنیایی عظیم و بی‌پایان
                از تجربه‌ی خرید خوش آمد گویی میکنیم. اینجا جایی است که واقعیت متلاقی با
                خیال می‌شود و هر خرید یک ماجراجویی جدید در دل مدل های سه بعدی آغاز
                می‌شود. خرید نه تنها یک فعل است، بلکه سفری است که هر لحظه آن، یک کاوش در
                فضاهای بی‌پایان است. به دنیای ما بپیوندید، جایی که هر کالا داستانی دارد..
              </p>
            </div>
            <div className="flex w-full gap-7 lg:w-1/3">
              <div className="flex w-1/2 flex-col items-center justify-center gap-5 rounded-[30px] bg-white px-3 py-7 text-[#157EFB] dark:bg-[#1A1A18] dark:text-white">
                <div className="w-[80%] overflow-hidden rounded-full border-2 border-[#157EFB]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/home-page/images/image 29.jpg"
                    alt=""
                    className="h-full w-full"
                  />
                </div>
                <div className="flex flex-col items-center justify-center gap-4 text-center">
                  <a href="https://uni.irpsc.com/member/paradise-supply-chain/">
                    هدلینگ زنجیره تامین بهشت
                  </a>
                  <p className="text-sm">مدیر سایت</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
