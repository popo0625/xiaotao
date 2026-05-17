"use client";

import { Input } from "@/components/ui/Input";

interface StepBasicData {
  title: string;
  categoryId: string;
  brand: string;
  description: string;
}

interface Props {
  data: StepBasicData;
  onChange: (data: StepBasicData) => void;
  categories: { id: number; displayName: string }[];
}

export function ListingStepBasic({ data, onChange, categories }: Props) {
  const update = (field: keyof StepBasicData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          商品标题 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => update("title", e.target.value)}
          placeholder="例如：高等数学第七版、iPhone 13 保护壳"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        />
        <p className="mt-1 text-xs text-gray-500">建议包含：书名/型号、规格，方便同学搜索</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          分类 <span className="text-red-500">*</span>
        </label>
        <select
          value={data.categoryId}
          onChange={(e) => update("categoryId", e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        >
          <option value="">请选择分类</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.displayName}</option>
          ))}
        </select>
      </div>

      <Input label="品牌/型号（选填）" placeholder="如：Apple、华为、高教出版社" value={data.brand} onChange={(e) => update("brand", e.target.value)} />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">商品描述</label>
        <textarea
          value={data.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="描述商品详情、使用时间、购买渠道、瑕疵说明等..."
          rows={4}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}
