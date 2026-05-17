"use client";

import { Input } from "@/components/ui/Input";
import { PriceDisplay } from "@/components/ui/PriceDisplay";

interface ImageItem {
  url: string;
  sortOrder: number;
  type: string;
}

interface Props {
  price: string;
  originalPrice: string;
  isShippingIncluded: boolean;
  shippingLocation: string;
  sellerType: string;
  onChangePrice: (v: string) => void;
  onChangeOriginalPrice: (v: string) => void;
  onChangeShipping: (v: boolean) => void;
  onChangeLocation: (v: string) => void;
  onChangeSellerType: (v: string) => void;
  preview: {
    title: string;
    price: string;
    grade: string;
    images: ImageItem[];
  };
}

export function ListingStepPrice({
  price, originalPrice, isShippingIncluded, shippingLocation, sellerType,
  onChangePrice, onChangeOriginalPrice, onChangeShipping, onChangeLocation, onChangeSellerType,
  preview,
}: Props) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="价格" placeholder="0.00"
          type="number" step="0.01" min="0"
          value={price}
          onChange={(e) => onChangePrice(e.target.value)}
          required
        />
        <Input
          label="原价（选填）" placeholder="参考原价"
          type="number" step="0.01" min="0"
          value={originalPrice}
          onChange={(e) => onChangeOriginalPrice(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="freeShipping"
          checked={isShippingIncluded}
          onChange={(e) => onChangeShipping(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600"
        />
        <label htmlFor="freeShipping" className="text-sm text-gray-700">包邮（校园内可送到宿舍/教学楼）</label>
      </div>

      <Input
        label="交易地点" placeholder="如：花江校区D区宿舍、金鸡岭校区"
        value={shippingLocation}
        onChange={(e) => onChangeLocation(e.target.value)}
      />

      {/* Preview */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">发布预览</h3>
        <div className="flex gap-4">
          {preview.images[0] && (
            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200">
              <img src={preview.images[0].url} alt="" className="h-full w-full object-cover" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 truncate">{preview.title || "商品标题"}</p>
            <div className="mt-1 flex items-center gap-2">
              <PriceDisplay price={parseFloat(price) || 0} size="sm" />
              {preview.grade && (
                <span className="text-xs text-gray-500">· {preview.grade}</span>
              )}
            </div>
            {isShippingIncluded && <span className="mt-1 inline-block text-xs text-green-600">包邮</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
