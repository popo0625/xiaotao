import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface PriceDisplayProps {
  price: number;
  originalPrice?: number | null;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function PriceDisplay({ price, originalPrice, className, size = "md" }: PriceDisplayProps) {
  const sizeClass = { sm: "text-sm", md: "text-lg", lg: "text-2xl" }[size];
  return (
    <div className={cn("flex items-baseline gap-2", className)}>
      <span className={cn("font-bold text-red-600", sizeClass)}>{formatPrice(price)}</span>
      {originalPrice && originalPrice > price && (
        <span className="text-sm text-gray-400 line-through">{formatPrice(originalPrice)}</span>
      )}
    </div>
  );
}
