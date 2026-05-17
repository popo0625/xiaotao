import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-utils";

export async function GET(request: NextRequest) {
  const result = await requireAdmin();
  if ("error" in result) return result.error;

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const categoryId = searchParams.get("categoryId") || "";

  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [{ title: { contains: search } }, { searchText: { contains: search } }];
  }
  if (status) where.status = status;
  if (categoryId) where.categoryId = parseInt(categoryId);

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: where as any,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        title: true,
        price: true,
        status: true,
        isVerified: true,
        viewCount: true,
        createdAt: true,
        user: { select: { id: true, name: true, email: true, avatar: true } },
        category: { select: { id: true, displayName: true } },
        images: { take: 1, select: { url: true }, orderBy: { sortOrder: "asc" } },
      },
    }),
    prisma.product.count({ where: where as any }),
  ]);

  return NextResponse.json({
    products,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}
