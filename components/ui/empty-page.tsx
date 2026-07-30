type EmptyPageProps = {
  message?: string;
};

export function EmptyPage({ message = "بدون دیتا" }: EmptyPageProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="mx-auto">
        <div className="mx-auto">
          <div className="dm-empty__image">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/svg/1.png" alt="Admin Empty" />
          </div>
          <div className="dm-empty__text">
            <p className="mt-5">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

