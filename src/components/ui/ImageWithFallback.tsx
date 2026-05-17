import { cn } from "@/lib/utils";
import { useState } from "react";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
}

export function ImageWithFallback({ src, alt, className, fallback = "/placeholder.png" }: ImageWithFallbackProps) {
  const [error, setError] = useState(false);

  return (
    <img
      src={error ? fallback : src}
      alt={alt}
      className={cn("object-cover", className)}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
}
