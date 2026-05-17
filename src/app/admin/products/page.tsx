import { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ProductsPageContent } from "./ProductsPageContent";

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<LoadingSpinner size="lg" />}>
      <ProductsPageContent />
    </Suspense>
  );
}
