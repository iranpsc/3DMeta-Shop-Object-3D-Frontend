type PageLoadingProps = {
  className?: string;
  label?: string;
};

export function PageLoading({
  className = "py-20 text-center text-gray-500 dark:text-gray-400",
  label = "در حال بارگذاری...",
}: PageLoadingProps) {
  return <p className={className}>{label}</p>;
}
