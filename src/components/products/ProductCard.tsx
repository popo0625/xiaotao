"use client";

import Link from "next/link";
import { GradeBadge } from "./GradeBadge";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { formatDate } from "@/lib/utils";

interface ProductCardData {
  id: string;
  title: string;
  price: number;
  grade: string;
  createdAt: string;
  images: { url: string }[];
  user: { id: string; name: string; creditScore: number };
  shippingLocation?: string;
  isShippingIncluded?: boolean;
}

export function ProductCard({ product }: { product: ProductCardData }) {
  const thumbnail = product.images?.[0]?.url || "/placeholder.png";

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md hover:border-blue-200"
    >
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img
          src={thumbnail}
          alt={product.title}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 min-h-[2.5rem]">
            {product.title}
          </h3>
        </div>
        <div className="mt-1 flex items-center gap-2">
          <PriceDisplay price={product.price} size="sm" />
          <GradeBadge grade={product.grade} />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
          <span>{product.user?.name}</span>
          <span>{formatDate(product.createdAt)}</span>
        </div>
      </div>
    </Link>
  );
}
