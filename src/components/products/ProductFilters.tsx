"use client";

import { CATEGORIES, GRADES } from "@/lib/constants";
import { Button } from "@/components/ui/Button";

interface FilterValues {
  category: string;
  grade: string;
  minPrice: string;
  maxPrice: string;
}

interface Props {
  values: FilterValues;
  onChange: (values: FilterValues) => void;
  onReset: () => void;
}

export function ProductFilters({ values, onChange, onReset }: Props) {
  const update = (field: keyof FilterValues, v: string) => {
    onChange({ ...values, [field]: v });
  };

  const hasFilters = values.category || values.grade || values.minPrice || values.maxPrice;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">筛选</h3>
        {hasFilters && (
          <button onClick={onReset} className="text-xs text-blue-600 hover:underline">
            重置
          </button>
        )}
      </div>

      {/* Category */}
      <div>
        <h4 className="mb-2 text-xs font-medium text-gray-500 uppercase tracking-wide">分类</h4>
        <div className="space-y-1">
          <button
            onClick={() => update("category", "")}
            className={`block w-full rounded px-2 py-1 text-left text-sm ${
              !values.category ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            全部分类
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => update("category", values.category === String(cat.id) ? "" : String(cat.id))}
              className={`block w-full rounded px-2 py-1 text-left text-sm ${
                values.category === String(cat.id)
                  ? "text-blue-600 bg-blue-50 font-medium"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {cat.icon} {cat.displayName}
            </button>
          ))}
        </div>
      </div>

      {/* Grade */}
      <div>
        <h4 className="mb-2 text-xs font-medium text-gray-500 uppercase tracking-wide">成色</h4>
        <div className="space-y-1">
          {GRADES.map((g) => (
            <button
              key={g.value}
              onClick={() => update("grade", values.grade === g.value ? "" : g.value)}
              className={`block w-full rounded px-2 py-1 text-left text-sm ${
                values.grade === g.value
                  ? "text-blue-600 bg-blue-50 font-medium"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h4 className="mb-2 text-xs font-medium text-gray-500 uppercase tracking-wide">价格区间</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="最低"
            value={values.minPrice}
            onChange={(e) => update("minPrice", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm"
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            placeholder="最高"
            value={values.maxPrice}
            onChange={(e) => update("maxPrice", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm"
          />
        </div>
      </div>

      {hasFilters && (
        <Button variant="secondary" size="sm" className="w-full" onClick={onReset}>
          清除筛选
        </Button>
      )}
    </div>
  );
}
