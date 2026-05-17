import { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import ProductsPageContent from "./ProductsPageContent";

export const dynamic = "force-dynamic";

export default function ProductsPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ProductsPageContent />
    </Suspense>
  );
}
