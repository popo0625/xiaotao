import { AuthGuard } from "@/components/layout/AuthGuard";
import { ListingForm } from "@/components/forms/ListingForm";

export default function CreateProductPage() {
  return (
    <AuthGuard>
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900">发布商品</h1>
        <p className="mt-1 text-sm text-gray-500">填写商品信息，发布到交易市场</p>
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <ListingForm />
        </div>
      </div>
    </AuthGuard>
  );
}
