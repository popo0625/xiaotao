import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-utils";

export async function GET(request: NextRequest) {
  const result = await requireAdmin();
  if ("error" in result) return result.error;

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));
  const status = searchParams.get("status") || "";

  const where: Record<string, unknown> = {};
  if (status) where.status = status;

  const [reports, total] = await Promise.all([
    prisma.report.findMany({
      where: where as any,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        reason: true,
        description: true,
        status: true,
        createdAt: true,
        resolvedAt: true,
        productId: true,
        reporter: { select: { id: true, name: true, email: true } },
      },
    }),
    prisma.report.count({ where: where as any }),
  ]);

  // Batch fetch product info for reports that have productId
  const productIds = reports.filter(r => r.productId).map(r => r.productId!);
  const products = productIds.length > 0
    ? await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, title: true, status: true },
      })
    : [];
  const productMap = new Map(products.map(p => [p.id, p]));

  const reportsWithProduct = reports.map(r => ({
    ...r,
    product: r.productId ? productMap.get(r.productId) || null : null,
  }));

  return NextResponse.json({
    reports: reportsWithProduct,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}
