"use client";

import { ImageUploader } from "@/components/products/ImageUploader";

interface ImageItem {
  url: string;
  sortOrder: number;
  type: string;
}

interface Props {
  images: ImageItem[];
  onChange: (images: ImageItem[]) => void;
}

export function ListingStepMedia({ images, onChange }: Props) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        商品图片 <span className="text-red-500">*</span>
      </label>
      <ImageUploader images={images} onChange={onChange} maxImages={9} />
      <p className="mt-2 text-xs text-gray-500">
        建议上传多角度照片：正面、背面、配件合照、瑕疵特写。至少上传1张。
      </p>
    </div>
  );
}
