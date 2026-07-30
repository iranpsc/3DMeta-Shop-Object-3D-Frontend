export const formControlClassName =
  "form-control w-full rounded-[10px] border-2 border-transparent bg-[#F8F9FA] p-4 placeholder:text-[#00000030] outline-none dark:bg-black dark:text-white/50 dark:placeholder:text-white/40"

export function formControlClass(invalid?: boolean, className?: string) {
  return [formControlClassName, invalid ? "is-invalid" : "", className]
    .filter(Boolean)
    .join(" ");
}
