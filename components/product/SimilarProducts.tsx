import { HomeSlider } from "@/components/home/HomeSlider";
import { EmptyPage } from "@/components/ui/empty-page";
import { ProductCard } from "@/components/ui/product-card";
import type { ProductCard as ProductType } from "@/lib/types";

type Props = {
  products: ProductType[];
};

/** Similar products strip (parity with Livewire SimilarProducts). */
export function SimilarProducts({ products }: Props) {
  if (products.length === 0) {
    return <EmptyPage message="محصولی یافت نشد" />;
  }

  return (
    <div className="relative">
      <HomeSlider
        dir="rtl"
        slideClassName="!flex w-full"
        resetKey={products.map((product) => product.id).join("-")}
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </HomeSlider>
    </div>
  );
}
