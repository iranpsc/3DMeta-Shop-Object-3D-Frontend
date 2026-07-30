import Link from "next/link";

const PARTNER_LINKS: Array<{ href: string; title: string; src: string; alt: string }> = [
  { href: "https://irpsc.com", title: "وزارت تعاون کار و رفاه اجتماعی", src: "https://irpsc.com/img-icon/vezarat.png", alt: "وزارت تعاون کار و رفاه اجتماعی" },
  { href: "#", title: "نماد اعتماد الکترونیک", src: "https://irpsc.com/img-icon/enamad.png", alt: "نماد اعتماد الکترونیک" },
  { href: "https://irpsc.com", title: "ثبت اسناد و املاک کشور", src: "https://irpsc.com/img-icon/qazaii.png", alt: "ثبت اسناد و املاک کشور" },
  { href: "https://video.irpsc.com", title: "مرکز آموزش ویدئویی", src: "https://irpsc.com/img-icon/video.png", alt: "مرکز آموزش ویدئویی" },
  { href: "https://faq.irpsc.com", title: "انجمن پرسش و پاسخ", src: "https://irpsc.com/img-icon/faq.png", alt: "انجمن پرسش و پاسخ" },
  { href: "https://Shop.irpsc.com", title: "فروشگاه ملی", src: "https://irpsc.com/img-icon/shop.png", alt: "فروشگاه ملی" },
  { href: "https://supply.irpsc.com", title: "تولید کنندگان", src: "https://irpsc.com/img-icon/supply.png", alt: "تولید کنندگان" },
  { href: "https://crm.irpsc.com", title: "مدیریت بر مدیران", src: "https://irpsc.com/img-icon/crm.png", alt: "مدیریت بر مدیران" },
  { href: "https://target.irpsc.com", title: "نگرش ملی", src: "https://irpsc.com/img-icon/target.png", alt: "نگرش ملی" },
  { href: "https://animal.irpsc.com", title: "حیوانات و دامپزشک", src: "https://irpsc.com/img-icon/animal.png", alt: "حیوانات و دامپزشک" },
  { href: "https://irpsc.com", title: "رسانه ملی", src: "https://irpsc.com/img-icon/irpsc.png", alt: "رسانه ملی" },
  { href: "https://meta.irpsc.com", title: "اخبار متا", src: "https://irpsc.com/img-icon/meta.png", alt: "اخبار متا" },
  { href: "https://uni.irpsc.com", title: "دانشگاه متاورس", src: "https://irpsc.com/img-icon/uni.png", alt: "دانشگاه متاورس" },
  { href: "https://crm.irpsc.com/knowledgebase", title: "استخدام | دانش محور", src: "https://irpsc.com/img-icon/knowledge.png", alt: "استخدام | دانش محور" },
  { href: "https://sale.irpsc.com", title: "فروشگاه مجازی حم", src: "https://irpsc.com/img-icon/sale.png", alt: "فروشگاه مجازی حم" },
  { href: "https://ad.irpsc.com", title: "تبلیغات ملی", src: "https://irpsc.com/img-icon/ad.png", alt: "تبلیغات ملی" },
  { href: "https://nft.irpsc.com", title: "بازار NFT", src: "https://irpsc.com/img-icon/nft.png", alt: "nft" },
  { href: "https://rgb.irpsc.com", title: "متاورس رنگ", src: "https://irpsc.com/img-icon/rgb.png", alt: "متاورس رنگ" },
  { href: "https://3d.irpsc.com", title: "سه بعدی متا", src: "https://irpsc.com/img-icon/3d.gif", alt: "سه بعدی متا" },
  { href: "#", title: "خانه", src: "https://irpsc.com/img-icon/home-soon.png", alt: "home" },
];

export function AppFooter() {
  return (
    <footer className="mx-auto w-full max-w-[1500px] px-5 lg:px-9 3xl:px-0">
      <div className="items-ctener mb-10 mx-auto flex w-full flex-wrap items-center justify-between gap-1 rounded-2xl bg-white p-3 md:gap-2 dark:bg-[#1A1A18]">
        {PARTNER_LINKS.map((item) => (
          <a key={`${item.title}-${item.src}`} href={item.href} style={{ width: 55 }} target="_blank" rel="noreferrer" title={item.title}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.src} className="rounded-lg" alt={item.alt} />
          </a>
        ))}
      </div>

      <div className="flex flex-col-reverse gap-10 md:flex-row">
        <div className="flex w-full flex-col items-center justify-between gap-y-7 rounded-[32px] bg-[#2667FF] p-10 text-white lg:flex-row dark:bg-[#002886] md:w-[55%]">
          <div className="space-y-3 lg:w-1/2">
            <p className="m-0 p-0 text-3xl font-bold">ثبت سفارش</p>
            <p>طراحی مدل سه بعدی خود را به ما واگذار کنید</p>
          </div>
          <div className="font-bold">
            <Link href="/submit-order" className="rounded-3xl bg-white px-5 py-3 text-[#2667FF] dark:bg-[#DAE5FF]/75">
              ثبت سفارش و نمونه کار ها
            </Link>
          </div>
        </div>
        <div className="flex w-full flex-col items-center justify-between gap-y-7 rounded-[32px] bg-[#20D05C] p-10 text-white md:flex-row dark:bg-[#02501D] md:w-[45%]">
          <div className="space-y-3">
            <p className="m-0 p-0 text-3xl font-bold">پشتیبانی 24 ساعته</p>
            <p>پیام خود را در واتس آپ ارسال کنید</p>
          </div>
          <div className="font-bold">
            <a
              dir="ltr"
              href="whatsapp://send?text=http://+989127855049"
              target="_blank"
              rel="noreferrer"
              className="rounded-3xl bg-white px-5 py-3 text-green-600 dark:bg-[#DCFFE8]/75 dark:text-[#02501D]"
            >
              09127855049
            </a>
          </div>
        </div>
      </div>

      <div className="relative mt-10 flex w-full flex-col justify-center gap-6 rounded-t-[32px] bg-[#c6d9fc] p-5 lg:flex-row dark:bg-[#1A1A18]">
        <div className="flex flex-col gap-6">
          <div className="mx-auto flex w-max flex-col gap-5 text-center md:flex-row md:gap-14 md:text-right">
            <a href="#" className="font-bold text-stone-800 dark:text-[#ffffff]">
              بانک مدل 3 بعدی
            </a>
            <a href="#" className="font-bold text-stone-800 dark:text-[#ffffff]">
              آموزش
            </a>
            <a href="#" className="font-bold text-stone-800 dark:text-[#ffffff]">
              سیاست و حریم خصوصی
            </a>
          </div>
          <div className="mx-auto flex flex-wrap gap-5 md:justify-center">
            <div>
              <a href="https://www.youtube.com/channel/UCG9jK8hoh9X5YoTs6Z1zlIQ">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/home-page/images/youtub.png" alt="یوتوب" />
              </a>
            </div>
            <div>
              <a href="whatsapp://send?text=http://+989127855049">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/home-page/images/whatsapp.png" alt="واتساپ" />
              </a>
            </div>
            <div>
              <a
                href="https://discord.gg/xqBe3h9hnN"
                className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-gray-200"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/home-page/images/discord-icon-svgrepo-com.png" alt="دیسکورد" className="mt-1 h-6 w-6" />
              </a>
            </div>
            <div>
              <a href="https://www.instagram.com/modelify3d_com/">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/home-page/images/istagram.png" alt="اینستاگرام" />
              </a>
            </div>
            <div>
              <a href="mailto:hq@irpsc.com" className="flex w-max items-center justify-center rounded-full bg-gray-500 p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/home-page/images/sms.png" alt="پیام" />
              </a>
            </div>
            <div>
              <a
                href="https://pin.it/7C5mYf6Q6"
                className="flex w-max items-center justify-center rounded-full bg-[#E70000] p-2 px-[10px]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/home-page/images/Vector (9).png" alt="پینترست" />
              </a>
            </div>
          </div>
          <div>
            <p className="m-0 p-0 text-center text-sm text-[#393939]">
              تمام حقوق مادی و معنوی مطالب و طرح قالب برای این سایت میباشد.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center lg:absolute lg:top-8 lg:left-8">
          <a
            referrerPolicy="origin"
            aria-label="Enamad"
            target="_blank"
            rel="noreferrer"
            href="https://trustseal.enamad.ir/?id=491484&Code=pdzLR1cYzWx6kOYRxHckoMmXtXK0jux2"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              referrerPolicy="origin"
              src="https://trustseal.enamad.ir/logo.aspx?id=491484&Code=pdzLR1cYzWx6kOYRxHckoMmXtXK0jux2"
              alt=""
              style={{ cursor: "pointer" }}
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
