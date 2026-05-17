"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { ImageCarousel } from "@/components/products/ImageCarousel";
import { GradeBadge } from "@/components/products/GradeBadge";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { SellerInfoCard } from "@/components/products/SellerInfoCard";
import { AccessoryList } from "@/components/products/AccessoryList";
import { FlawList } from "@/components/products/FlawList";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";
import { HiHeart, HiOutlineHeart, HiChat, HiPencil } from "react-icons/hi";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [favorited, setFavorited] = useState(false);
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);

  useEffect(() => {
    const id = params.id as string;
    if (!id) return;

    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setProduct(data);
        // Load similar products by category
        if (data.categoryId) {
          fetch(`/api/products?category=${data.categoryId}&limit=5`)
            .then((r) => r.json())
            .then((d) => setSimilarProducts((d.products || []).filter((p: any) => p.id !== id).slice(0, 4)))
            .catch(() => {});
        }
      })
      .catch(() => toast.error("加载失败"))
      .finally(() => setLoading(false));
  }, [params.id]);

  const toggleFavorite = async () => {
    if (!session) {
      router.push("/login");
      return;
    }
    try {
      const res = await fetch(`/api/products/${params.id}/favorite`, { method: "POST" });
      const data = await res.json();
      setFavorited(data.favorited);
      toast.success(data.favorited ? "已收藏" : "已取消收藏");
    } catch {
      toast.error("操作失败");
    }
  };

  const handleContact = () => {
    if (!session) { router.push("/login"); return; }
    router.push(`/messages?userId=${product.userId}&productId=${product.id}`);
  };

  const handleDelist = async () => {
    if (!confirm("确定要下架该商品吗？")) return;
    try {
      const res = await fetch(`/api/products/${params.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("操作失败");
      toast.success("已下架");
      router.push(`/profile/${session?.user?.id}?tab=delisted`);
    } catch {
      toast.error("操作失败");
    }
  };

  const statusLabel: Record<string, string> = {
    ACTIVE: "在售",
    SOLD: "已售出",
    RESERVED: "已被预定",
    CANCELLED: "已下架",
  };

  if (loading) return <LoadingSpinner />;
  if (!product) return <div className="text-center py-16 text-gray-500">商品不存在</div>;

  const isOwner = session?.user?.id === product.userId;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-5">
        {/* Left: Images */}
        <div className="lg:col-span-3">
          <ImageCarousel images={product.images || []} />
        </div>

        {/* Right: Info */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {/* Grade */}
            <GradeBadge grade={product.grade} />

            {/* Title */}
            <h1 className="text-xl font-bold text-gray-900">{product.title}</h1>

            {/* Price */}
            <PriceDisplay
              price={product.price}
              originalPrice={product.originalPrice}
              size="lg"
            />

            {/* Quick Info */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="info">{product.category?.displayName}</Badge>
              {product.isShippingIncluded && <Badge variant="success">包邮</Badge>}
              {product.isVerified && <Badge variant="success">已验货</Badge>}
              {product.sellerType && <Badge>{product.sellerType}</Badge>}
              {product.status !== "ACTIVE" && (
                <Badge variant="warning">{statusLabel[product.status] || product.status}</Badge>
              )}
            </div>

            {product.brand && <p className="text-sm text-gray-500">品牌/型号：{product.brand}</p>}
            {product.shippingLocation && <p className="text-sm text-gray-500">交易地点：{product.shippingLocation}</p>}

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="text-sm font-medium text-gray-700">商品描述</h3>
                <p className="mt-1 text-sm text-gray-600 whitespace-pre-wrap">{product.description}</p>
              </div>
            )}

            {/* Accessories */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">配件清单</h3>
              <AccessoryList accessories={product.accessories || []} />
            </div>

            {/* Flaws */}
            <FlawList flaws={product.flaws || []} />

            {/* Seller */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">卖家信息</h3>
              <SellerInfoCard seller={product.user} />
            </div>

            {/* Actions */}
            {!session && (
              <div className="rounded-lg bg-gray-50 p-4 text-center text-sm text-gray-500">
                请先<a href="/login" className="text-blue-600 hover:underline">登录账号</a>后使用交易功能
              </div>
            )}
            {session && isOwner && (
              <div className="flex gap-3 pt-2">
                <Button onClick={() => router.push(`/products/${params.id}/edit`)} className="flex-1">
                  <HiPencil className="h-4 w-4 mr-1" />
                  编辑商品
                </Button>
                {product.status === "ACTIVE" && (
                  <Button variant="secondary" onClick={handleDelist}>
                    下架商品
                  </Button>
                )}
                {product.status === "CANCELLED" && (
                  <span className="inline-flex items-center rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-500">
                    已下架
                  </span>
                )}
              </div>
            )}
            {session && !isOwner && (
              <div className="flex gap-3 pt-2">
                <Button variant="secondary" onClick={handleContact} className="flex-1">
                  <HiChat className="h-4 w-4 mr-1" />
                  联系卖家
                </Button>
                <Button variant="ghost" onClick={toggleFavorite}>
                  {favorited ? <HiHeart className="h-5 w-5 text-red-500" /> : <HiOutlineHeart className="h-5 w-5" />}
                </Button>
              </div>
            )}

            <p className="text-xs text-gray-400">
              发布于 {formatDate(product.createdAt)} · 浏览 {product.viewCount} 次
            </p>
          </div>
        </div>
      </div>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-bold text-gray-900 mb-4">同分类在售</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {similarProducts.map((p: any) => (
              <Card key={p.id} padding={false}>
                <a href={`/products/${p.id}`} className="block">
                  <div className="aspect-square overflow-hidden rounded-t-xl bg-gray-100">
                    <img src={p.images?.[0]?.url || "/placeholder.png"} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium text-gray-900 truncate">{p.title}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <PriceDisplay price={p.price} size="sm" />
                      <GradeBadge grade={p.grade} />
                    </div>
                  </div>
                </a>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
