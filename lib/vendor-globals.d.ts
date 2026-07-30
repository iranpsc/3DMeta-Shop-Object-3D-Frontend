type ResumableFile = {
  uniqueIdentifier: string;
  fileName: string;
  size: number;
  progress: () => number;
};

type ResumableInstance = {
  assignBrowse: (el: HTMLElement | HTMLElement[]) => void;
  assignDrop: (el: HTMLElement | HTMLElement[]) => void;
  upload: () => void;
  removeFile: (file: ResumableFile | { uniqueIdentifier: string }) => void;
  on: (event: string, callback: (...args: any[]) => void) => void;
};

type ResumableConstructor = new (options: Record<string, unknown>) => ResumableInstance;

type JQuerySelect2 = {
  (options?: Record<string, unknown>): JQueryLike;
  (method: "val"): string | string[] | null;
  (method: "destroy"): JQueryLike;
  (method: string, ...args: unknown[]): unknown;
};

type JQuerySummernote = {
  (options?: Record<string, unknown>): JQueryLike;
  (method: "code"): string;
  (method: "code", content: string): JQueryLike;
  (method: "destroy"): JQueryLike;
  (method: string, ...args: unknown[]): unknown;
};

type JQueryLike = {
  length: number;
  select2: JQuerySelect2;
  summernote: JQuerySummernote;
  hasClass: (className: string) => boolean;
  addClass: (className: string) => JQueryLike;
  next: (selector?: string) => JQueryLike;
  off: (events: string) => JQueryLike;
  on: (events: string, handler: () => void) => JQueryLike;
};

type JQueryStatic = ((selector: string | Element | null) => JQueryLike) & {
  fn: {
    select2?: unknown;
    summernote?: unknown;
  };
};

declare global {
  interface Window {
    jQuery?: JQueryStatic;
    $?: JQueryStatic;
    Resumable?: ResumableConstructor;
  }
}

export {};
