export function getPaginationRange(
  current: number,
  last: number,
  delta = 2,
): Array<number | "ellipsis"> {
  if (last <= 1) return [];

  const pages: number[] = [];

  for (let i = 1; i <= last; i += 1) {
    if (
      i === 1 ||
      i === last ||
      (i >= current - delta && i <= current + delta)
    ) {
      pages.push(i);
    }
  }

  const result: Array<number | "ellipsis"> = [];
  let previous = 0;

  for (const page of pages) {
    if (previous) {
      if (page - previous === 2) {
        result.push(previous + 1);
      } else if (page - previous !== 1) {
        result.push("ellipsis");
      }
    }
    result.push(page);
    previous = page;
  }

  return result;
}
