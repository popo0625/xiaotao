"use client";

import { useState, useEffect } from "react";
import {
  HiUsers, HiShoppingBag, HiFlag, HiEye, HiChartBar,
} from "react-icons/hi";
import { AdminStatsCard } from "@/components/admin/AdminStatsCard";
import { TrendChart } from "@/components/admin/TrendChart";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";

const STATUS_BADGE: Record<string, "success" | "warning" | "danger" | "default"> = {
  ACTIVE: "success",
  SOLD: "default",
  RESERVED: "warning",
  CANCELLED: "danger",
};

export function AdminDashboardContent() {
  const [stats, setStats] = useState<any>(null);
  const [trends, setTrends] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [statsRes, trendsRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/stats/trends"),
      ]);
      if (statsRes.status === 403 || trendsRes.status === 403) { setError("无权限访问"); return; }
      if (statsRes.status === 401 || trendsRes.status === 401) { setError("请先登录"); return; }
      if (!statsRes.ok || !trendsRes.ok) throw new Error("加载失败");
      setStats(await statsRes.json());
      setTrends(await trendsRes.json());
    } catch {
      setError("加载失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <LoadingSpinner size="lg" />;
  if (error) return (
    <div className="text-center py-16">
      <p className="text-gray-500 mb-4">{error}</p>
      {error === "请先登录" && (
        <a href="/login" className="text-blue-600 hover:underline">去登录</a>
      )}
    </div>
  );
  if (!stats || !trends) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">数据概览</h1>

      {/* Stats cards row 1 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatsCard
          title="总用户数"
          value={stats.totalUsers}
          icon={<HiUsers className="h-6 w-6" />}
          variant="default"
          trend={{ value: `今日 +${stats.todayUsers}`, isUp: true }}
        />
        <AdminStatsCard
          title="总商品数"
          value={stats.totalProducts}
          icon={<HiShoppingBag className="h-6 w-6" />}
          variant="default"
          trend={{ value: `今日 +${stats.todayProducts}`, isUp: true }}
        />
        <AdminStatsCard
          title="活跃商品"
          value={stats.activeProducts}
          icon={<HiChartBar className="h-6 w-6" />}
          variant="success"
        />
      </div>

      {/* Stats cards row 2 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatsCard
          title="待处理举报"
          value={stats.pendingReports}
          icon={<HiFlag className="h-6 w-6" />}
          variant="danger"
        />
        <AdminStatsCard
          title="总浏览"
          value={trends.totalViews}
          icon={<HiEye className="h-6 w-6" />}
          variant="info"
        />
        <AdminStatsCard
          title="日均新用户(30天)"
          value={trends.avgDailyUsers}
          icon={<HiUsers className="h-6 w-6" />}
          variant="default"
        />
        <AdminStatsCard
          title="日均新商品(30天)"
          value={trends.avgDailyProducts}
          icon={<HiShoppingBag className="h-6 w-6" />}
          variant="success"
        />
      </div>

      {/* Trend charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">新增用户趋势 (近30天)</h3>
          <p className="text-xs text-gray-400 mb-4">每日新增注册用户数</p>
          <TrendChart
            data={trends.trends}
            lines={[{ key: "newUsers", color: "#3b82f6", name: "新增用户" }]}
          />
        </Card>
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">新增商品趋势 (近30天)</h3>
          <p className="text-xs text-gray-400 mb-4">每日新发布商品数</p>
          <TrendChart
            data={trends.trends}
            lines={[{ key: "newProducts", color: "#10b981", name: "新增商品" }]}
          />
        </Card>
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">举报趋势 (近30天)</h3>
          <p className="text-xs text-gray-400 mb-4">每日举报数量</p>
          <TrendChart
            data={trends.trends}
            lines={[{ key: "reports", color: "#ef4444", name: "举报" }]}
          />
        </Card>
      </div>

      {/* Combined chart: overall activity */}
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-1">平台活跃度总览</h3>
        <p className="text-xs text-gray-400 mb-4">新增用户与商品对比</p>
        <TrendChart
          data={trends.trends}
          lines={[
            { key: "newUsers", color: "#3b82f6", name: "新增用户" },
            { key: "newProducts", color: "#10b981", name: "新增商品" },
          ]}
        />
      </Card>

      {/* Bottom section: recent products + top viewed */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent activity */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">最近发布</h2>
          <div className="rounded-lg border border-gray-200 bg-white">
            {stats.recentProducts.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-400">暂无商品</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {stats.recentProducts.map((p: any) => (
                  <div key={p.id} className="flex items-center gap-3 px-4 py-3">
                    <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-gray-100 overflow-hidden">
                      {p.images?.[0]?.url ? (
                        <img src={p.images[0].url} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-gray-400">无图</div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <a href={`/products/${p.id}`} className="text-sm font-medium text-gray-900 hover:text-blue-600 truncate block">
                        {p.title}
                      </a>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-500">{p.user?.name}</span>
                        <span className="text-xs text-gray-300">·</span>
                        <span className="text-xs text-gray-400">{formatDate(p.createdAt)}</span>
                      </div>
                    </div>
                    <Badge variant={STATUS_BADGE[p.status] || "default"}>
                      {p.status === "ACTIVE" ? "在售" : p.status === "SOLD" ? "已售" : p.status === "CANCELLED" ? "已下架" : "已预定"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Top viewed products */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">热门浏览</h2>
          <div className="rounded-lg border border-gray-200 bg-white">
            {trends.topViewed.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-400">暂无数据</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {trends.topViewed.map((p: any, i: number) => (
                  <div key={p.id} className="flex items-center gap-3 px-4 py-3">
                    <span className={`w-6 text-center text-sm font-bold ${
                      i === 0 ? "text-yellow-500" : i === 1 ? "text-gray-400" : i === 2 ? "text-amber-700" : "text-gray-300"
                    }`}>
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <a href={`/products/${p.id}`} className="text-sm font-medium text-gray-900 hover:text-blue-600 truncate block">
                        {p.title}
                      </a>
                      <p className="text-xs text-gray-500">{p.user?.name}</p>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <HiEye className="h-4 w-4" />
                      {p.viewCount}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
