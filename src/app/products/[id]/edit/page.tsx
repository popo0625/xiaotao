import { AuthGuard } from "@/components/layout/AuthGuard";
import { ListingForm } from "@/components/forms/ListingForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <AuthGuard>
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900">编辑商品</h1>
        <p className="mt-1 text-sm text-gray-500">修改商品信息后保存</p>
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <ListingForm productId={id} />
        </div>
      </div>
    </AuthGuard>
  );
}
