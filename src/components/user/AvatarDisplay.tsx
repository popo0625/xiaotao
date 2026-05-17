"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface AvatarDisplayProps {
  src: string | null;
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "h-8 w-8 text-sm",
  md: "h-12 w-12 text-lg",
  lg: "h-20 w-20 text-2xl font-bold",
};

export function AvatarDisplay({ src, name, size = "md", className }: AvatarDisplayProps) {
  const [error, setError] = useState(false);
  const firstChar = name?.[0] || "?";

  if (src && !error) {
    return (
      <img
        src={`${src}?t=${Date.now()}`}
        alt={name}
        onError={() => setError(true)}
        className={cn("rounded-full object-cover", sizeMap[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-blue-100 font-medium text-blue-600",
        sizeMap[size],
        className
      )}
    >
      {firstChar}
    </div>
  );
}
