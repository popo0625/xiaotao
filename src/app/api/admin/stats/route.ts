import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-utils";

export async function GET() {
  const result = await requireAdmin();
  if ("error" in result) return result.error;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalUsers,
    totalProducts,
    activeProducts,
    pendingReports,
    todayUsers,
    todayProducts,
    recentProducts,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.product.count({ where: { status: "ACTIVE" } }),
    prisma.report.count({ where: { status: "pending" } }),
    prisma.user.count({ where: { createdAt: { gte: today } } }),
    prisma.product.count({ where: { createdAt: { gte: today } } }),
    prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        price: true,
        status: true,
        createdAt: true,
        user: { select: { id: true, name: true, avatar: true } },
        images: { take: 1, select: { url: true }, orderBy: { sortOrder: "asc" } },
      },
    }),
  ]);

  return NextResponse.json({
    totalUsers,
    totalProducts,
    activeProducts,
    pendingReports,
    todayUsers,
    todayProducts,
    recentProducts,
  });
}
