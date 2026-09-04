function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cx(
        "animate-pulse rounded-md bg-[#DCE6F5] motion-reduce:animate-none dark:bg-[#2A2A28]",
        className,
      )}
    />
  );
}

function LoadingStatus({ label = "در حال بارگذاری..." }: { label?: string }) {
  return <span className="sr-only">{label}</span>;
}

type TableSkeletonProps = {
  columns?: number;
  rows?: number;
  headers?: string[];
};

export function TableSkeleton({
  columns = 6,
  rows = 6,
  headers,
}: TableSkeletonProps) {
  const columnCount = headers?.length ?? columns;

  return (
    <div role="status" aria-busy="true" aria-live="polite">
      <LoadingStatus />
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b">
              {Array.from({ length: columnCount }).map((_, index) => (
                <th key={index} className="p-3 text-right">
                  {headers?.[index] ? (
                    headers[index]
                  ) : (
                    <Skeleton className="h-4 w-16" />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex} className="border-b">
                {Array.from({ length: columnCount }).map((_, colIndex) => (
                  <td key={colIndex} className="p-3">
                    <Skeleton
                      className={cx(
                        "h-4",
                        colIndex === 0 ? "w-8" : colIndex === columnCount - 1 ? "w-20" : "w-24",
                      )}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

type FormSkeletonProps = {
  fields?: number;
  columns?: 1 | 2;
};

export function FormSkeleton({ fields = 4, columns = 1 }: FormSkeletonProps) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      className={cx("mt-5 grid gap-7", columns === 2 && "lg:grid-cols-2")}
    >
      <LoadingStatus />
      {Array.from({ length: fields }).map((_, index) => (
        <div key={index} className="flex flex-col gap-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-11 w-full rounded-lg" />
        </div>
      ))}
      <div className={columns === 2 ? "lg:col-span-2" : undefined}>
        <Skeleton className="h-11 w-28 rounded-lg" />
      </div>
    </div>
  );
}

type StatCardsSkeletonProps = {
  count?: number;
};

export function StatCardsSkeleton({ count = 5 }: StatCardsSkeletonProps) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      className="mb-25 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-5"
    >
      <LoadingStatus />
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex min-h-[140px] flex-col items-center justify-center gap-4 rounded-[16px] bg-white p-6 dark:bg-[#1A1A18]"
        >
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-16" />
        </div>
      ))}
    </div>
  );
}

type DetailListSkeletonProps = {
  rows?: number;
};

export function DetailListSkeleton({ rows = 6 }: DetailListSkeletonProps) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      className="max-w-2xl rounded-[10px] bg-[#EFEFEF] p-5 dark:bg-[#2A2A28]"
    >
      <LoadingStatus />
      <Skeleton className="mb-6 h-6 w-32" />
      <div className="flex flex-col gap-5">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-36" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="product w-full">
      <div className="flex w-full flex-col items-center justify-between gap-2 overflow-hidden rounded-xl bg-white text-center dark:bg-[#1A1A18]">
        <Skeleton className="mt-4 aspect-square w-[90%] rounded-lg" />
        <div className="flex w-full flex-col items-center justify-center gap-3 p-3">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-5 w-24" />
          <div className="flex w-full gap-2">
            <Skeleton className="h-11 w-[60%] rounded-lg" />
            <Skeleton className="h-11 w-[40%] rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

type ProductGridSkeletonProps = {
  count?: number;
  className?: string;
};

export function ProductGridSkeleton({
  count = 3,
  className = "grid gap-5 lg:grid-cols-2 xl:grid-cols-3",
}: ProductGridSkeletonProps) {
  return (
    <div role="status" aria-busy="true" aria-live="polite" className={className}>
      <LoadingStatus />
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="demo5 mb-25 mt-30">
      <StatCardsSkeleton count={5} />
      <div className="card border-0 px-6 pb-6">
        <Skeleton className="mb-5 h-6 w-28" />
        <TableSkeleton columns={4} rows={4} headers={["شناسه سفارش", "محصولات", "مبلغ", "وضعیت"]} />
      </div>
    </div>
  );
}

export function AdminDashboardSkeleton() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2"
    >
      <LoadingStatus />
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="ap-po-details ap-po-details--2 radius-xl flex justify-between p-6"
        >
          <div className="flex w-full flex-wrap justify-between">
            <div className="flex flex-col gap-3">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-12 w-12 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TicketDetailSkeleton() {
  return (
    <div role="status" aria-busy="true" aria-live="polite" className="space-y-6">
      <LoadingStatus />
      <Skeleton className="h-5 w-20" />
      <div className="grid gap-5 lg:grid-cols-12">
        <div className="rounded-2xl border border-[#E8EEF8] p-5 dark:border-[#2A2A28] sm:p-7 lg:col-span-8">
          <div className="flex items-start justify-between gap-4 border-b border-[#E8EEF8] pb-5 dark:border-[#2A2A28]">
            <Skeleton className="h-7 w-2/3" />
            <div className="flex gap-2">
              <Skeleton className="h-7 w-20 rounded-full" />
              <Skeleton className="h-7 w-20 rounded-full" />
            </div>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="rounded-xl bg-[#F7FAFF] p-4 dark:bg-[#111110]">
                <Skeleton className="mb-3 h-3 w-20" />
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-3 rounded-xl border border-dashed border-[#D5DFF5] p-5 dark:border-[#333]">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
        <div className="rounded-2xl border border-[#E8EEF8] p-5 dark:border-[#2A2A28] lg:col-span-4">
          <Skeleton className="mb-5 h-6 w-24" />
          <Skeleton className="h-20 w-full rounded-xl" />
        </div>
      </div>
      <div className="rounded-2xl border border-[#E8EEF8] p-5 dark:border-[#2A2A28]">
        <Skeleton className="mb-5 h-6 w-20" />
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="flex gap-3 rounded-2xl bg-[#F7FAFF] p-4 dark:bg-[#111110]">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CartSkeleton() {
  return (
    <div role="status" aria-busy="true" aria-live="polite" className="space-y-8">
      <LoadingStatus />
      <div className="flex justify-center gap-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-10 w-24 rounded-full" />
        ))}
      </div>
      <TableSkeleton columns={4} rows={3} headers={["محصول", "قیمت", "تعداد", "عملیات"]} />
      <div className="flex justify-end">
        <Skeleton className="h-12 w-40 rounded-lg" />
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <main>
      <section className="mx-auto mt-20 max-w-[1500px] p-4 lg:mt-0 lg:p-9">
        <div
          role="status"
          aria-busy="true"
          aria-live="polite"
          className="grid gap-8 lg:grid-cols-2"
        >
          <LoadingStatus />
          <div className="space-y-4">
            <Skeleton className="aspect-square w-full rounded-xl" />
            <div className="flex gap-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-16 w-16 rounded-lg" />
              ))}
            </div>
          </div>
          <div className="space-y-5">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>
      </section>
      <section className="mx-auto mt-10 max-w-[1500px] p-4 lg:p-9">
        <div className="flex gap-3">
          <Skeleton className="h-10 w-28 rounded-lg" />
          <Skeleton className="h-10 w-28 rounded-lg" />
          <Skeleton className="h-10 w-28 rounded-lg" />
        </div>
        <Skeleton className="mt-6 h-40 w-full rounded-xl" />
      </section>
    </main>
  );
}

export function CategoryStripSkeleton({
  count = 3,
  className = "relative flex w-full gap-4 overflow-hidden",
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      className={className}
      role="status"
      aria-busy="true"
      aria-live="polite"
    >
      <LoadingStatus />
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} className="aspect-square w-40 shrink-0 rounded-xl" />
      ))}
    </div>
  );
}

export function PopularCategoriesSkeleton() {
  return (
    <section
      className="mx-auto w-full max-w-[1500px] px-0 lg:px-9 3xl:px-0"
      role="status"
      aria-busy="true"
      aria-live="polite"
    >
      <LoadingStatus />
      <div className="flex flex-col gap-3 px-5 md:mt-32">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-80 max-w-full" />
        <div className="mt-5 flex gap-4 overflow-hidden">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-48 w-64 shrink-0 rounded-[20px]" />
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeTabProductsSkeleton() {
  return (
    <section
      className="mx-auto w-full max-w-[1500px] px-5 lg:px-9 3xl:px-0"
      role="status"
      aria-busy="true"
      aria-live="polite"
    >
      <LoadingStatus />
      <Skeleton className="mx-auto mt-32 h-10 w-40" />
      <div className="mt-10">
        <ProductGridSkeleton count={3} className="grid gap-5 md:grid-cols-3" />
      </div>
    </section>
  );
}

export function StorefrontCatalogSkeleton() {
  return (
    <main className="overflow-x-hidden">
      <section className="mx-auto mt-24 max-w-[1500px] overflow-x-hidden p-4 lg:mt-4 lg:p-9 lg:pt-0">
        <Skeleton className="h-12 w-full max-w-xl rounded-[10px]" />
        <div className="mt-10">
          <CategoryStripSkeleton />
        </div>
      </section>
      <section className="mx-auto mt-14 flex max-w-[1500px] min-w-0 flex-col gap-5 overflow-x-hidden lg:flex-row lg:p-9">
        <div className="hidden h-min w-full shrink-0 space-y-4 lg:block lg:w-1/4 lg:p-5">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
        <div className="w-full min-w-0 space-y-5 p-5 lg:w-3/4">
          <Skeleton className="h-10 w-full max-w-md rounded-lg" />
          <ProductGridSkeleton count={3} />
        </div>
      </section>
    </main>
  );
}
