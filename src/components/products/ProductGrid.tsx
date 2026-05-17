import { ProductCard } from "./ProductCard";

interface Product {
  id: string;
  title: string;
  price: number;
  grade: string;
  createdAt: string;
  images: { url: string }[];
  user: { id: string; name: string; creditScore: number };
}

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
