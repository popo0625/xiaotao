"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ProductGrid } from "@/components/products/ProductGrid";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { AvatarDisplay } from "@/components/user/AvatarDisplay";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { HiPencil, HiArrowUp, HiTrash, HiLockOpen } from "react-icons/hi";

type TabType = "active" | "delisted" | "favorites";

function ProfileContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("active");
  const [loading, setLoading] = useState(true);

  const isOwnProfile = session?.user?.id === params.id;

  const loadProducts = useCallback(async (tab: TabType) => {
    setActiveTab(tab);
    setProducts([]); // Clear immediately to avoid flash of previous data
    if (tab === "favorites") {
      const data = await fetch("/api/users/me/favorites").then((r) => r.json());
      setProducts(data);
    } else if (tab === "delisted") {
      const data = await fetch(`/api/users/${params.id}/products?status=CANCELLED`).then((r) => r.json());
      setProducts(data);
    } else {
      const data = await fetch(`/api/users/${params.id}/products?status=ACTIVE`).then((r) => r.json());
      setProducts(data);
    }
  }, [params.id]);

  useEffect(() => {
    const userId = params.id as string;
    if (!userId) return;

    const tab = searchParams.get("tab");
    const initialStatus = tab === "delisted" ? "CANCELLED" : "ACTIVE";

    Promise.all([
      fetch(`/api/users/${userId}`).then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || "用户不存在");
        return data;
      }),
      fetch(`/api/users/${userId}/products?status=${initialStatus}`).then((r) => r.json()),
    ])
      .then(([userData, productsData]) => {
        setUser(userData);
        setProducts(productsData);
        if (tab === "delisted" && isOwnProfile) {
          setActiveTab("delisted");
        }
      })
      .catch((e) => {
        console.error("Profile load error:", e);
      })
      .finally(() => setLoading(false));
  }, [params.id, searchParams, isOwnProfile]);

  const handleRelist = async (productId: string) => {
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ACTIVE" }),
      });
      if (!res.ok) throw new Error("操作失败");
      toast.success("已重新上架");
      loadProducts("delisted");
    } catch {
      toast.error("操作失败");
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("确定要永久删除该商品记录吗？此操作不可撤销。")) return;
    try {
      const res = await fetch(`/api/products/${productId}?hard=true`, { method: "DELETE" });
      if (!res.ok) throw new Error("操作失败");
      toast.success("已删除");
      loadProducts("delisted");
    } catch {
      toast.error("操作失败");
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!user) return <div className="text-center py-16 text-gray-500">用户不存在</div>;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Profile Header */}
      <Card>
        <div className="flex items-center gap-6">
          <div className="relative">
            <AvatarDisplay src={user.avatar} name={user.name} size="lg" />
            {isOwnProfile && (
              <Link
                href="/profile/change-password"
                className="absolute -bottom-1 -right-1 rounded-full bg-white p-1 shadow-md border border-gray-200 hover:bg-gray-50"
                title="修改密码"
              >
                <HiLockOpen className="h-3.5 w-3.5 text-gray-500" />
              </Link>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              {user.isVerified && <Badge variant="success">已认证</Badge>}
              {user.role === "ADMIN" && <Badge variant="danger">管理员</Badge>}
            </div>
            <div className="mt-2">
              {user.bio ? (
                <p className="text-sm text-gray-600">{user.bio}</p>
              ) : (
                isOwnProfile && <p className="text-sm text-gray-400 italic">暂无简介，去编辑资料完善</p>
              )}
            </div>
            <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
              {user.campus && <span>📍 {user.campus}{user.location ? ` · ${user.location}` : ""}</span>}
              <span>🕐 加入 {formatDate(user.createdAt)}</span>
              <span>📦 {user._count?.products || 0} 件商品</span>
              <span>✅ {user._count?.sales || 0} 笔成交</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Products */}
      <div className="mt-8">
        <div className="flex gap-4 border-b border-gray-200">
          <button
            onClick={() => loadProducts("active")}
            className={`pb-3 text-sm font-medium ${
              activeTab === "active" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"
            }`}
          >
            在售
          </button>
          {isOwnProfile && (
            <button
              onClick={() => loadProducts("delisted")}
              className={`pb-3 text-sm font-medium ${
                activeTab === "delisted" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"
              }`}
            >
              已下架
            </button>
          )}
          {isOwnProfile && (
            <button
              onClick={() => loadProducts("favorites")}
              className={`pb-3 text-sm font-medium ${
                activeTab === "favorites" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"
              }`}
            >
              收藏
            </button>
          )}
        </div>
        <div className="mt-6">
          {products.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-8">
              {activeTab === "favorites" ? "暂无收藏" : activeTab === "delisted" ? "暂无下架商品" : "暂无商品"}
            </p>
          ) : activeTab === "delisted" ? (
            <div className="space-y-3">
              {products.map((product) => (
                <Card key={product.id}>
                  <div className="flex items-center gap-4">
                    <a href={`/products/${product.id}`} className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                      <img
                        src={product.images?.[0]?.url || "/placeholder.png"}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </a>
                    <div className="min-w-0 flex-1">
                      <a href={`/products/${product.id}`} className="text-sm font-medium text-gray-900 hover:text-blue-600 truncate block">
                        {product.title}
                      </a>
                      <p className="mt-0.5 text-xs text-gray-500">
                        下架时间：{formatDate(product.updatedAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => router.push(`/products/${product.id}/edit`)}>
                        <HiPencil className="h-4 w-4 mr-1" />
                        编辑
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => handleRelist(product.id)}>
                        <HiArrowUp className="h-4 w-4 mr-1" />
                        重新上架
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteProduct(product.id)} className="text-red-500 hover:text-red-700">
                        <HiTrash className="h-4 w-4 mr-1" />
                        删除
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <ProductGrid products={products} />
          )}
        </div>
      </div>

    </div>
  );
}

export default function UserProfilePage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ProfileContent />
    </Suspense>
  );
}
