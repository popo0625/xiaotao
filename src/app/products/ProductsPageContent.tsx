"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnnouncementBanner } from "@/components/announcements/AnnouncementBanner";
import { ProductSearch } from "@/components/products/ProductSearch";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductSort } from "@/components/products/ProductSort";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Pagination } from "@/components/ui/Pagination";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { HiSearch } from "react-icons/hi";

export default function ProductsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [grade, setGrade] = useState(searchParams.get("grade") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "new");
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1"));

  const [products, setProducts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (grade) params.set("grade", grade);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (sort) params.set("sort", sort);
    params.set("page", String(page));

    const query = params.toString();
    router.replace(`/products${query ? `?${query}` : ""}`, { scroll: false });

    try {
      const res = await fetch(`/api/products${query ? `?${query}` : ""}`);
      const data = await res.json();
      setProducts(data.products || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 0);
    } catch {
      console.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, [search, category, grade, minPrice, maxPrice, sort, page, router]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Safety timeout: if loading takes >15s, show error
  useEffect(() => {
    if (!loading) return;
    const timer = setTimeout(() => setLoadError(true), 15000);
    return () => clearTimeout(timer);
  }, [loading]);

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const handleFilterChange = (values: { category: string; grade: string; minPrice: string; maxPrice: string }) => {
    setCategory(values.category);
    setGrade(values.grade);
    setMinPrice(values.minPrice);
    setMaxPrice(values.maxPrice);
    setPage(1);
  };

  const resetFilters = () => {
    setCategory("");
    setGrade("");
    setMinPrice("");
    setMaxPrice("");
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <AnnouncementBanner />
      <div className="mt-4">
        <ProductSearch value={searchInput} onChange={setSearchInput} onSearch={handleSearch} />
      </div>

      <div className="mt-6 flex gap-8">
        <aside className="hidden w-56 flex-shrink-0 lg:block">
          <div className="sticky top-24">
            <ProductFilters
              values={{ category, grade, minPrice, maxPrice }}
              onChange={handleFilterChange}
              onReset={resetFilters}
            />
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">共 {total} 件商品</p>
            <ProductSort value={sort} onChange={(v) => { setSort(v); setPage(1); }} />
          </div>

          {loading && !loadError ? (
            <LoadingSpinner />
          ) : loadError ? (
            <div className="text-center py-16">
              <p className="text-gray-500">加载失败，请检查网络后重试</p>
              <button onClick={fetchProducts} className="mt-4 text-sm text-blue-600 hover:underline">
                重新加载
              </button>
            </div>
          ) : products.length === 0 ? (
            <EmptyState icon={<HiSearch />} title="没有找到商品" description="试试调整搜索条件或筛选" />
          ) : (
            <>
              <ProductGrid products={products} />
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
