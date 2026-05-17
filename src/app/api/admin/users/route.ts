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
  const role = searchParams.get("role") || "";
  const isVerified = searchParams.get("isVerified") || "";

  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { email: { contains: search } },
    ];
  }
  if (role && ["BUYER", "SELLER", "ADMIN"].includes(role)) {
    where.role = role;
  }
  if (isVerified === "true") where.isVerified = true;
  else if (isVerified === "false") where.isVerified = false;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: where as any,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        creditScore: true,
        isVerified: true,
        phone: true,
        createdAt: true,
        _count: { select: { products: true, reports: true } },
      },
    }),
    prisma.user.count({ where: where as any }),
  ]);

  return NextResponse.json({
    users,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}
