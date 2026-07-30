export function LegalTopBar() {
  return (
    <section>
      <div
        className="font-rokh hidden w-full bg-[#000BEEF7] px-5 py-[10px] text-sm text-white lg:block dark:bg-[#E59819]"
      >
        <div className="mx-auto flex max-w-[1500px] items-center justify-between">
          <div className="flex">
            <a href="#" className="px-4 first:pl-0 last:pr-0">
              قوانین و مجوزات
            </a>
            <span className="mx-1 flex items-center">|</span>
            <a href="#" className="px-4 first:pl-0 last:pr-0">
              سوالات متداول
            </a>
            <span className="mx-1 flex items-center">|</span>
            <a href="#" className="px-4 first:pl-0 last:pr-0">
              سیاست حفظ حریم خصوصی
            </a>
          </div>
          <div className="flex gap-4">
            <div>
              <a href="#">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/home-page/images/Union (1).png"
                  alt="telegram"
                />
              </a>
            </div>
            <div>
              <a href="https://www.instagram.com/modelify3d_com/">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/home-page/images/Union (2).png"
                  alt="instagram"
                />
              </a>
            </div>
            <div>
              <a href="whatsapp://send?text=http://+989127855049">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/home-page/images/Union (3).png"
                  alt="whatsapp"
                />
              </a>
            </div>
            <div>
              <a href="mailto:dmeta.irpsc@gmail.com">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/home-page/images/Union (4).png"
                  alt="email"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
