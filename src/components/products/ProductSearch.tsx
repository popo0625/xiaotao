"use client";

import { HiSearch } from "react-icons/hi";

interface ProductSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
}

export function ProductSearch({ value, onChange, onSearch }: ProductSearchProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") onSearch();
  };

  return (
    <div className="relative">
      <HiSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="搜索教材、数码、生活用品..."
        className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>
  );
}
