import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "ACTIVE";

  const products = await prisma.product.findMany({
    where: { userId: id, status: status as any },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      images: { take: 1, orderBy: { sortOrder: "asc" } },
    },
  });

  return NextResponse.json(products);
}
