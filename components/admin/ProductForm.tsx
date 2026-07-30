"use client";

import { useEffect, useId, useRef, useState } from "react";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { showWarningToast } from "@/components/ui/toast";
import { ProductFileUpload } from "@/components/admin/ProductFileUpload";
import { FormTextInput } from "@/components/form/text-input";
import { FormTextarea } from "@/components/form/textarea";
import { formControlClassName } from "@/components/form/form-control-classes";
import type { AdminProduct, AdminProductFormData, CategorySummary, ChunkUploadedFile } from "@/lib/types";

type ProductFormProps = {
  formData: AdminProductFormData;
  initial?: AdminProduct;
  onSubmit: (form: FormData) => void;
  pending?: boolean;
  submitLabel: string;
};

function chunkPairs<T>(items: T[]): T[][] {
  const pairs: T[][] = [];
  for (let i = 0; i < items.length; i += 2) {
    pairs.push(items.slice(i, i + 2));
  }
  return pairs;
}

type CategorySelectOption = { id: number; label: string };

function buildCategorySelectOptions(categories: CategorySummary[]): CategorySelectOption[] {
  const parentCategories = categories.filter((category) => !category.parent);
  const options: CategorySelectOption[] = [];

  function appendCategory(
    category: { id: number; name: string; children?: CategorySummary["children"] },
    level: number,
  ) {
    options.push({ id: category.id, label: `${"-".repeat(level)}${category.name}` });
    category.children?.forEach((child) => appendCategory(child, level + 1));
  }

  parentCategories.forEach((parent) => {
    categories
      .filter((category) => category.parent?.id === parent.id)
      .forEach((child) => appendCategory(child, 1));
  });

  return options;
}

function getSelect2BaseOptions($: NonNullable<typeof window.jQuery>) {
  return {
    width: "100%",
    dir: "rtl",
    dropdownParent: $(document.body),
    minimumResultsForSearch: 0,
    dropdownCssClass: "product-form-select2-dropdown",
    selectionCssClass: "product-form-select2-selection",
  };
}

function initSelect2(
  $: NonNullable<typeof window.jQuery>,
  element: HTMLSelectElement | null,
  options: Record<string, unknown>,
) {
  if (!element) {
    return () => {};
  }

  const $el = $(element);
  if (!$el.hasClass("select2-hidden-accessible")) {
    $el.select2(options);
  }

  return () => {
    if ($el.hasClass("select2-hidden-accessible")) {
      $el.select2("destroy");
    }
  };
}

export function ProductForm({ formData, initial, onSubmit, pending = false, submitLabel }: ProductFormProps) {
  const initialTags = initial?.tags?.map((tag) => String(tag.id)) ?? [];
  const attributeValues = Object.fromEntries(
    (initial?.attributes ?? []).map((attr) => [String(attr.id), attr.value ?? ""]),
  );

  const [uploadedFiles, setUploadedFiles] = useState<ChunkUploadedFile[]>([]);
  const [longDescription, setLongDescription] = useState(initial?.long_description ?? "");
  const [jqueryReady, setJqueryReady] = useState(false);
  const [select2Ready, setSelect2Ready] = useState(false);
  const [summernoteReady, setSummernoteReady] = useState(false);

  const categorySelectId = useId().replace(/:/g, "");
  const tagSelectId = useId().replace(/:/g, "");
  const summernoteId = useId().replace(/:/g, "");
  const categorySelectRef = useRef<HTMLSelectElement>(null);
  const tagSelectRef = useRef<HTMLSelectElement>(null);
  const summernoteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.jQuery) {
      setJqueryReady(true);
    }
  }, []);

  useEffect(() => {
    if (!jqueryReady || !select2Ready || !window.jQuery?.fn.select2) {
      return;
    }

    const $ = window.jQuery;
    const baseOptions = getSelect2BaseOptions($);
    const cleanupCategory = initSelect2($, categorySelectRef.current, {
      ...baseOptions,
      placeholder: "انتخاب دسته بندی",
      allowClear: true,
    });
    const cleanupTags = initSelect2($, tagSelectRef.current, {
      ...baseOptions,
      placeholder: "انتخاب برچسب ها",
      allowClear: true,
    });

    const closeOpenSelect2 = () => {
      [categorySelectRef.current, tagSelectRef.current].forEach((element) => {
        if (element) {
          $(element).select2("close");
        }
      });
    };

    const handleSummernoteInteraction = (event: MouseEvent) => {
      if ((event.target as Element | null)?.closest(".note-editor")) {
        closeOpenSelect2();
      }
    };

    document.addEventListener("mousedown", handleSummernoteInteraction);

    return () => {
      document.removeEventListener("mousedown", handleSummernoteInteraction);
      cleanupCategory();
      cleanupTags();
    };
  }, [jqueryReady, select2Ready, formData.categories, formData.tags]);

  useEffect(() => {
    if (!jqueryReady || !summernoteReady || !summernoteRef.current || !window.jQuery?.fn.summernote) {
      return;
    }

    const $ = window.jQuery;
    const $el = $(summernoteRef.current);

    const $editor = $el.next(".note-editor");

    if (!$editor.length) {
      $el.summernote({
        height: 300,
        disableDragAndDrop: true,
        callbacks: {
          onInit() {
            $el.next(".note-editor").addClass("product-form-summernote-editor");
          },
          onChange(contents: string) {
            setLongDescription(contents);
          },
        },
      });
      $el.summernote("code", initial?.long_description || "");
    } else {
      $editor.addClass("product-form-summernote-editor");
    }

    return () => {
      if ($el.next(".note-editor").length) {
        $el.summernote("destroy");
      }
    };
  }, [jqueryReady, summernoteReady, initial?.long_description]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const data = new FormData(formElement);

    if (!initial && uploadedFiles.length === 0) {
      showWarningToast("لطفا حداقل یک فایل آپلود کنید.");
      return;
    }

    const $ = window.jQuery;
    const categoryId =
      $ && categorySelectRef.current
        ? String($(categorySelectRef.current).select2("val") ?? "")
        : String(data.get("category_id") ?? "");

    if (!categoryId) {
      showWarningToast("لطفا دسته بندی را انتخاب کنید.");
      return;
    }
    data.set("category_id", categoryId);
    const selectedTags =
      $ && tagSelectRef.current
        ? (($(tagSelectRef.current).select2("val") as string[] | string | null) ?? [])
        : Array.from(tagSelectRef.current?.selectedOptions ?? []).map((option) => option.value);
    const tagIds = (Array.isArray(selectedTags) ? selectedTags : [selectedTags])
      .filter(Boolean)
      .map((id) => Number(id));

    if (tagIds.length === 0) {
      showWarningToast("لطفا حداقل یک برچسب انتخاب کنید.");
      return;
    }
    data.set("tags", JSON.stringify(tagIds));

    const attributes = formData.attributes
      .map((attribute) => {
        const input = formElement.querySelector<HTMLInputElement>(`#attribute-${attribute.id}`);
        return {
          id: attribute.id,
          name: attribute.name,
          value: input?.value?.trim() ?? "",
        };
      })
      .filter((item) => item.value);

    if (attributes.length === 0) {
      showWarningToast("لطفا حداقل یک ویژگی را تکمیل کنید.");
      return;
    }
    data.set("attributes", JSON.stringify(attributes));

    const description =
      $ && summernoteRef.current ? String($(summernoteRef.current).summernote("code") ?? "") : longDescription;
    const plainDescription = description.replace(/<[^>]*>/g, "").trim();
    if (!plainDescription) {
      showWarningToast("لطفا توضیحات محصول را وارد کنید.");
      return;
    }
    data.set("long_description", description);
    data.set("files", JSON.stringify(uploadedFiles));

    onSubmit(data);
  }

  const categoryOptions = buildCategorySelectOptions(formData.categories);
  const attributePairs = chunkPairs(formData.attributes);

  return (
    <form onSubmit={handleSubmit} className="product-form-widgets flex flex-col gap-8">
      <link rel="stylesheet" href="/assets/vendor_assets/css/select2.min.css" />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote-lite.min.css"
      />
      <Script
        src="/assets/vendor_assets/js/jquery/jquery-3.5.1.min.js"
        strategy="afterInteractive"
        onLoad={() => setJqueryReady(true)}
        onReady={() => {
          if (window.jQuery) setJqueryReady(true);
        }}
      />
      {jqueryReady ? (
        <>
          <Script
            src="/assets/vendor_assets/js/select2.full.min.js"
            strategy="afterInteractive"
            onLoad={() => setSelect2Ready(true)}
            onReady={() => {
              if (window.jQuery?.fn.select2) setSelect2Ready(true);
            }}
          />
          <Script
            src="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote-lite.min.js"
            strategy="afterInteractive"
            onLoad={() => setSummernoteReady(true)}
            onReady={() => {
              if (window.jQuery?.fn.summernote) setSummernoteReady(true);
            }}
          />
        </>
      ) : null}
      <div className="grid gap-7 lg:grid-cols-2">
        <label htmlFor={`select-category-${categorySelectId}`} className="flex flex-col gap-3">
          <span className="form-col-label col-sm-4">دسته بندی</span>
          <select
            ref={categorySelectRef}
            id={`select-category-${categorySelectId}`}
            name="category_id"
            defaultValue={initial?.category_id ?? ""}
            className={formControlClassName}
            style={{ width: "100%" }}
          >
            <option value="">انتخاب دسته بندی</option>
            {categoryOptions.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
        </label>

        <FormTextInput
          name="sku"
          label="شناسه"
          defaultValue={initial?.sku ?? formData.next_sku}
          required
        />

        <FormTextInput
          name="name"
          label="نام"
          defaultValue={initial?.name ?? ""}
          required
        />

        <FormTextInput
          name="slug"
          label="نامک"
          defaultValue={initial?.slug ?? ""}
          required
        />

        <FormTextInput
          name="price"
          label="قیمت عادی"
          type="number"
          defaultValue={initial?.price ?? 0}
          required
        />

        <FormTextInput
          name="sale_price"
          label="قیمت فروش ویژه"
          type="number"
          defaultValue={initial?.sale_price ?? 0}
        />

        <label className="flex flex-col gap-3">
          <span className="form-col-label col-sm-4">تصاویر {initial ? "(اختیاری)" : ""}</span>
          <input
            name="images[]"
            type="file"
            accept="image/*"
            multiple
            className={formControlClassName}
            {...(initial ? {} : { required: true })}
          />
        </label>

        <ProductFileUpload
          label="فایل‌ها"
          value={uploadedFiles}
          onChange={setUploadedFiles}
          required={!initial}
        />

        <label className="flex flex-col gap-3">
          <span className="form-col-label col-sm-4">وضعیت انبار</span>
          <select name="stock_status" defaultValue={initial?.stock_status ? "1" : "0"} className={formControlClassName}>
            <option value="1">موجود</option>
            <option value="0">ناموجود</option>
          </select>
        </label>

        <FormTextInput
          name="quantity"
          label="تعداد موجود در انبار"
          type="number"
          defaultValue={initial?.quantity ?? 0}
        />

        <FormTextInput
          name="delivery_time"
          label="مدت زمان تحویل"
          type="number"
          defaultValue={Number(initial?.delivery_time ?? 0)}
        />

        <div className="mb-10 mt-10 flex w-full flex-col gap-4">
          <label htmlFor={`select-tag-${tagSelectId}`} className="flex flex-col gap-5">
            برچسب ها
          </label>
          <div className="flex w-full flex-col gap-5">
            <select
              ref={tagSelectRef}
              id={`select-tag-${tagSelectId}`}
              name="tags"
              className={formControlClassName}
              style={{ width: "100%" }}
              multiple
              defaultValue={initialTags}
            >
              <option value="">انتخاب برچسب ها</option>
              {formData.tags.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <label className="flex flex-col gap-3">
          <span className="form-col-label col-sm-4">مشتری می تواند دیدگاه بنویسد؟</span>
          <select
            name="customer_can_add_review"
            defaultValue={initial?.customer_can_add_review ? "1" : "0"}
            className={formControlClassName}
          >
            <option value="1">بله</option>
            <option value="0">خیر</option>
          </select>
        </label>

        <label className="flex flex-col gap-3">
          <span className="form-col-label col-sm-4">محصول انتشار داده شود؟</span>
          <select name="published" defaultValue={initial?.published ? "1" : "0"} className={formControlClassName}>
            <option value="0">خیر</option>
            <option value="1">بله</option>
          </select>
        </label>
      </div>

      <hr />

      <h4 className="mb-5 mt-5 font-bold">ویژگی ها</h4>
      {attributePairs.length === 0 ? (
        <p className="rounded-[10px] bg-yellow-100 p-4 text-yellow-800">ویژگی ای برای این دسته بندی ثبت نشده است.</p>
      ) : (
        attributePairs.map((pair, pairIndex) => (
          <div key={`attr-pair-${pairIndex}`} className="mt-5 grid gap-7 lg:grid-cols-2">
            {pair.map((attribute) => (
              <div key={attribute.id} className="flex w-full flex-col gap-7">
                <div id={`attribute-box-${attribute.id}`}>
                  <FormTextInput
                    name={`attribute-${attribute.id}`}
                    id={`attribute-${attribute.id}`}
                    label={attribute.name}
                    defaultValue={attributeValues[String(attribute.id)] ?? ""}
                  />
                </div>
              </div>
            ))}
          </div>
        ))
      )}

      <hr className="mb-5 mt-5" />

      <div className="mt-5 flex flex-col gap-5">
        <FormTextarea
          name="short_description"
          label="توضیحات کوتاه"
          defaultValue={initial?.short_description ?? ""}
          className="min-h-[80px]"
          rows={3}
          required
        />

        <FormTextarea
          name="meta_description"
          label="متا توضیحات"
          defaultValue={initial?.meta_description ?? ""}
          className="min-h-[80px]"
          rows={3}
          required
        />

        <FormTextarea
          name="meta_keywords"
          label="متا کلمات کلیدی"
          defaultValue={initial?.meta_keywords ?? ""}
          className="min-h-[80px]"
          rows={3}
          required
        />
      </div>

      <div className="product-form-editor mt-5 flex flex-col gap-5">
        <label htmlFor={`summernote-${summernoteId}`}>توضیحات محصول</label>
        <div ref={summernoteRef} id={`summernote-${summernoteId}`} className="dark:text-gray-300" />
        <input type="hidden" name="long_description" value={longDescription} required />
      </div>

      <Button type="submit" variant="admin" size="lg" disabled={pending} className="w-max disabled:opacity-50">
        {submitLabel}
      </Button>
    </form>
  );
}
