import type { ProductDetail, ProductImage } from "@/lib/types";

type MaybeWrappedImage = ProductImage & {
  data?: ProductImage | null;
};

function unwrapImage(
  image: MaybeWrappedImage | null | undefined,
  fallbackId: number,
): ProductImage | null {
  if (!image) {
    return null;
  }

  const resolved = image.data ?? image;
  if (!resolved.url) {
    return null;
  }

  return {
    id: resolved.id ?? fallbackId,
    path: resolved.path ?? "",
    url: resolved.url,
  };
}

function unwrapImages(raw: unknown): ProductImage[] {
  if (!raw) {
    return [];
  }

  if (Array.isArray(raw)) {
    return raw
      .map((image, index) => unwrapImage(image as MaybeWrappedImage, index))
      .filter((image): image is ProductImage => image !== null);
  }

  if (
    typeof raw === "object" &&
    raw !== null &&
    "data" in raw &&
    Array.isArray((raw as { data: unknown }).data)
  ) {
    return unwrapImages((raw as { data: unknown[] }).data);
  }

  return [];
}

export function getProductGalleryImages(product: ProductDetail | null | undefined): ProductImage[] {
  if (!product) {
    return [];
  }

  const fromCollection = unwrapImages(product.images);
  if (fromCollection.length > 0) {
    return fromCollection;
  }

  const fallback = unwrapImage(product.image, 0);
  return fallback ? [fallback] : [];
}
