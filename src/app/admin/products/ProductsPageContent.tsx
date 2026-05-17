"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { AdminTable, Column } from "@/components/admin/AdminTable";
import { Pagination } from "@/components/ui/Pagination";
import { Badge } from "@/components/ui/Badge";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import { HiTrash, HiEye, HiEyeOff } from "react-icons/hi";

const STATUS_BADGE: Record<string, "success" | "default" | "warning" | "danger"> = {
  ACTIVE: "success",
  SOLD: "default",
  RESERVED: "warning",
  CANCELLED: "danger",
};

const STATUS_LABEL: Record<string, string> = {
  ACTIVE: "在售",
  SOLD: "已售出",
  RESERVED: "已被预定",
  CANCELLED: "已下架",
};

interface Product {
  id: string;
  title: string;
  price: number;
  status: string;
  isVerified: boolean;
  viewCount: number;
  createdAt: string;
  user: { id: string; name: string; email: string; avatar: string | null };
  category: { id: number; displayName: string } | null;
  images: { url: string }[];
}

export function ProductsPageContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      const res = await fetch(`/api/admin/products?${params}`);
      if (!res.ok) throw new Error("加载失败");
      const data = await res.json();
      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch {
      toast.error("加载失败");
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => { setPage(1); }, [search, statusFilter]);

  const handleToggleStatus = async (productId: string, currentStatus: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "CANCELLED" : "ACTIVE";
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(newStatus === "ACTIVE" ? "已上架" : "已下架");
      fetchProducts();
    } catch (err: any) {
      toast.error(err.message || "操作失败");
    }
  };

  const handleDelete = async (productId: string, title: string) => {
    if (!confirm(`确定要删除商品「${title}」吗？`)) return;
    try {
      const res = await fetch(`/api/admin/products/${productId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("已删除");
      fetchProducts();
    } catch (err: any) {
      toast.error(err.message || "操作失败");
    }
  };

  const columns: Column<Product>[] = [
    {
      key: "product",
      header: "商品",
      render: (p) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-gray-100 overflow-hidden">
            {p.images?.[0]?.url ? (
              <img src={p.images[0].url} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-gray-400">无图</div>
            )}
          </div>
          <div className="min-w-0">
            <a href={`/products/${p.id}`} className="text-sm font-medium text-gray-900 hover:text-blue-600 truncate block max-w-[200px]">
              {p.title}
            </a>
            <p className="text-xs text-gray-500">{p.user?.name}</p>
          </div>
        </div>
      ),
    },
    {
      key: "price",
      header: "价格",
      render: (p) => <PriceDisplay price={p.price} size="sm" />,
    },
    {
      key: "category",
      header: "分类",
      render: (p) => <span className="text-xs text-gray-600">{p.category?.displayName || "-"}</span>,
    },
    {
      key: "status",
      header: "状态",
      render: (p) => <Badge variant={STATUS_BADGE[p.status] || "default"}>{STATUS_LABEL[p.status] || p.status}</Badge>,
    },
    {
      key: "isVerified",
      header: "审核",
      render: (p) => <Badge variant={p.isVerified ? "success" : "warning"}>{p.isVerified ? "已验货" : "未验货"}</Badge>,
    },
    {
      key: "viewCount",
      header: "浏览",
      render: (p) => <span className="text-xs text-gray-600">{p.viewCount}</span>,
    },
    {
      key: "createdAt",
      header: "发布时间",
      render: (p) => <span className="text-xs text-gray-500">{formatDate(p.createdAt)}</span>,
    },
    {
      key: "actions",
      header: "操作",
      render: (p) => (
        <div className="flex gap-1">
          <button
            onClick={() => handleToggleStatus(p.id, p.status)}
            className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-blue-600 transition-colors"
            title={p.status === "ACTIVE" ? "下架" : "恢复上架"}
          >
            {p.status === "ACTIVE" ? <HiEyeOff className="h-4 w-4" /> : <HiEye className="h-4 w-4" />}
          </button>
          <button
            onClick={() => handleDelete(p.id, p.title)}
            className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-600 transition-colors"
            title="删除"
          >
            <HiTrash className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">商品管理</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="搜索商品名称..."
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none w-64"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="">全部状态</option>
          <option value="ACTIVE">在售</option>
          <option value="SOLD">已售出</option>
          <option value="RESERVED">已被预定</option>
          <option value="CANCELLED">已下架</option>
        </select>
      </div>

      <AdminTable
        columns={columns}
        data={products}
        keyExtractor={(p) => p.id}
        loading={loading}
        emptyState={{ title: "暂无商品", description: "没有找到匹配的商品" }}
      />

      {totalPages > 1 && (
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      )}
    </div>
  );
}
