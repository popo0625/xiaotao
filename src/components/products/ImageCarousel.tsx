"use client";

import { useState } from "react";
import { HiChevronLeft, HiChevronRight, HiPhotograph } from "react-icons/hi";

interface ImageItem {
  url: string;
  type?: string;
}

export function ImageCarousel({ images }: { images: ImageItem[] }) {
  const [current, setCurrent] = useState(0);

  if (!images.length) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-xl bg-gray-100">
        <HiPhotograph className="h-16 w-16 text-gray-300" />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl bg-gray-100">
      <div className="relative aspect-square">
        <img
          src={images[current]?.url}
          alt=""
          className="h-full w-full object-contain"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={() => setCurrent(Math.max(0, current - 1))}
              disabled={current === 0}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 text-gray-700 shadow hover:bg-white disabled:opacity-30"
            >
              <HiChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => setCurrent(Math.min(images.length - 1, current + 1))}
              disabled={current === images.length - 1}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 text-gray-700 shadow hover:bg-white disabled:opacity-30"
            >
              <HiChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 w-2 rounded-full transition-colors ${
                i === current ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto p-3">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 ${
                i === current ? "border-blue-500" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img src={img.url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
