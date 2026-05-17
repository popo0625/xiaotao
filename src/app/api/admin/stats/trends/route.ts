import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-utils";

export async function GET() {
  const result = await requireAdmin();
  if ("error" in result) return result.error;

  // Generate last 30 days
  const days: { start: Date; end: Date; label: string }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    const label = `${d.getMonth() + 1}/${d.getDate()}`;
    days.push({ start, end, label });
  }

  // Query counts per day
  const usersPromise = Promise.all(
    days.map((d) =>
      prisma.user.count({ where: { createdAt: { gte: d.start, lt: d.end } } })
    )
  );
  const productsPromise = Promise.all(
    days.map((d) =>
      prisma.product.count({ where: { createdAt: { gte: d.start, lt: d.end } } })
    )
  );
  const reportsPromise = Promise.all(
    days.map((d) =>
      prisma.report.count({ where: { createdAt: { gte: d.start, lt: d.end } } })
    )
  );
  // Active products count per day (products created AND not cancelled by end of that day)
  const activeProductsPromise = Promise.all(
    days.map((d) =>
      prisma.product.count({
        where: {
          createdAt: { lte: d.end },
          status: "ACTIVE",
        },
      })
    )
  );

  const [users, products, reports, activeProducts] = await Promise.all([
    usersPromise,
    productsPromise,
    reportsPromise,
    activeProductsPromise,
  ]);

  const trends = days.map((d, i) => ({
    date: d.label,
    newUsers: users[i],
    newProducts: products[i],
    reports: reports[i],
    activeProducts: activeProducts[i],
  }));

  // Total aggregate stats
  const totalUsers = trends.reduce((s, v) => s + v.newUsers, 0);
  const totalProducts = trends.reduce((s, v) => s + v.newProducts, 0);
  const totalReports = trends.reduce((s, v) => s + v.reports, 0);

  // Product view stats
  const viewStats = await prisma.product.aggregate({ _sum: { viewCount: true } });
  const totalViews = viewStats._sum.viewCount || 0;

  // Top viewed products
  const topViewed = await prisma.product.findMany({
    orderBy: { viewCount: "desc" },
    take: 5,
    select: {
      id: true,
      title: true,
      viewCount: true,
      user: { select: { name: true } },
    },
  });

  // Verification code sending stats (as proxy for "active users" attempting login)
  const verificationSent = await Promise.all(
    days.map((d) =>
      prisma.verificationCode.count({ where: { createdAt: { gte: d.start, lt: d.end } } })
    )
  );

  return NextResponse.json({
    trends,
    verificationSent,
    totalUsers,
    totalProducts,
    totalReports,
    totalViews,
    topViewed,
    avgDailyUsers: Math.round(totalUsers / 30),
    avgDailyProducts: Math.round(totalProducts / 30),
  });
}
