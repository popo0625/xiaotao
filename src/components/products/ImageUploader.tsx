"use client";

import { useState, useRef } from "react";
import { HiPhotograph, HiX, HiUpload } from "react-icons/hi";
import toast from "react-hot-toast";

interface ImageItem {
  url: string;
  sortOrder: number;
  type: string;
}

interface ImageUploaderProps {
  images: ImageItem[];
  onChange: (images: ImageItem[]) => void;
  maxImages?: number;
}

export function ImageUploader({ images, onChange, maxImages = 9 }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    const remaining = maxImages - images.length;
    const toUpload = Array.from(files).slice(0, remaining);

    setUploading(true);
    let successCount = 0;

    for (const file of toUpload) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        if (!res.ok) {
          const err = await res.json();
          toast.error(err.error || "上传失败");
          continue;
        }
        const data = await res.json();
        onChange([...images, { url: data.url, sortOrder: images.length + successCount, type: "image" }]);
        successCount++;
      } catch {
        toast.error("上传失败");
      }
    }

    setUploading(false);
    if (successCount > 0) {
      toast.success(`成功上传 ${successCount} 张图片`);
    }

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
        {images.map((img, index) => (
          <div key={index} className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
            <img src={img.url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute right-1 top-1 hidden rounded-full bg-black/50 p-1 text-white group-hover:block"
            >
              <HiX className="h-3 w-3" />
            </button>
            <div className="absolute bottom-1 left-1 rounded bg-black/50 px-1.5 py-0.5 text-xs text-white">
              {index + 1}
            </div>
          </div>
        ))}
        {images.length < maxImages && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-gray-400 transition-colors hover:border-blue-400 hover:text-blue-500 disabled:opacity-50"
          >
            {uploading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
            ) : (
              <div className="flex flex-col items-center gap-1">
                <HiUpload className="h-5 w-5" />
                <span className="text-xs">{images.length}/{maxImages}</span>
              </div>
            )}
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleUpload}
      />
      <p className="mt-2 text-xs text-gray-500">
        <HiPhotograph className="mr-1 inline h-3 w-3" />
        支持 JPG / PNG / WebP，最多 {maxImages} 张，单张不超过 20MB
      </p>
    </div>
  );
}
