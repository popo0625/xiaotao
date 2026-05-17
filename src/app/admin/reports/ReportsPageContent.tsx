"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { AdminTable, Column } from "@/components/admin/AdminTable";
import { Pagination } from "@/components/ui/Pagination";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import { HiCheck, HiX } from "react-icons/hi";

const STATUS_BADGE: Record<string, "warning" | "success" | "default"> = {
  pending: "warning",
  resolved: "success",
  dismissed: "default",
};

const STATUS_LABEL: Record<string, string> = {
  pending: "待处理",
  resolved: "已处理",
  dismissed: "已驳回",
};

interface Report {
  id: string;
  reason: string;
  description: string | null;
  status: string;
  createdAt: string;
  resolvedAt: string | null;
  productId: string | null;
  product: { id: string; title: string; status: string } | null;
  reporter: { id: string; name: string; email: string };
}

export function ReportsPageContent() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("pending");

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (statusFilter) params.set("status", statusFilter);
      const res = await fetch(`/api/admin/reports?${params}`);
      if (!res.ok) throw new Error("加载失败");
      const data = await res.json();
      setReports(data.reports);
      setTotalPages(data.totalPages);
    } catch {
      toast.error("加载失败");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => { fetchReports(); }, [fetchReports]);
  useEffect(() => { setPage(1); }, [statusFilter]);

  const handleResolve = async (reportId: string) => {
    try {
      const res = await fetch(`/api/admin/reports/${reportId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "resolved" }),
      });
      if (!res.ok) throw new Error("操作失败");
      toast.success("已标记为已处理");
      fetchReports();
    } catch {
      toast.error("操作失败");
    }
  };

  const handleDismiss = async (reportId: string) => {
    try {
      const res = await fetch(`/api/admin/reports/${reportId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "dismissed" }),
      });
      if (!res.ok) throw new Error("操作失败");
      toast.success("已驳回");
      fetchReports();
    } catch {
      toast.error("操作失败");
    }
  };

  const columns: Column<Report>[] = [
    {
      key: "reporter",
      header: "举报人",
      render: (r) => (
        <div>
          <p className="text-sm font-medium text-gray-900">{r.reporter.name}</p>
          <p className="text-xs text-gray-500">{r.reporter.email}</p>
        </div>
      ),
    },
    {
      key: "reason",
      header: "举报原因",
      render: (r) => (
        <div>
          <p className="text-sm text-gray-900">{r.reason}</p>
          {r.description && <p className="text-xs text-gray-500 mt-0.5 max-w-[200px] truncate">{r.description}</p>}
        </div>
      ),
    },
    {
      key: "product",
      header: "关联商品",
      render: (r) =>
        r.product ? (
          <a href={`/products/${r.product.id}`} className="text-sm text-blue-600 hover:underline truncate block max-w-[150px]">
            {r.product.title}
          </a>
        ) : (
          <span className="text-xs text-gray-400">无</span>
        ),
    },
    {
      key: "status",
      header: "状态",
      render: (r) => <Badge variant={STATUS_BADGE[r.status] || "default"}>{STATUS_LABEL[r.status] || r.status}</Badge>,
    },
    {
      key: "createdAt",
      header: "举报时间",
      render: (r) => <span className="text-xs text-gray-500">{formatDate(r.createdAt)}</span>,
    },
    {
      key: "actions",
      header: "操作",
      render: (r) =>
        r.status === "pending" ? (
          <div className="flex gap-1">
            <button
              onClick={() => handleResolve(r.id)}
              className="rounded p-1.5 text-gray-400 hover:bg-green-50 hover:text-green-600 transition-colors"
              title="标记已处理"
            >
              <HiCheck className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDismiss(r.id)}
              className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
              title="驳回"
            >
              <HiX className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <span className="text-xs text-gray-400">-</span>
        ),
    },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">举报管理</h1>

      {/* Status tabs */}
      <div className="flex gap-1 rounded-lg bg-gray-100 p-1 w-fit">
        {["pending", "resolved", "dismissed", ""].map((s) => {
          const labels: Record<string, string> = { pending: "待处理", resolved: "已处理", dismissed: "已驳回", "": "全部" };
          return (
            <button
              key={s || "all"}
              onClick={() => setStatusFilter(s)}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                statusFilter === s ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {labels[s]}
            </button>
          );
        })}
      </div>

      <AdminTable
        columns={columns}
        data={reports}
        keyExtractor={(r) => r.id}
        loading={loading}
        emptyState={{ title: "暂无举报", description: "没有找到匹配的举报记录" }}
      />

      {totalPages > 1 && (
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      )}
    </div>
  );
}
