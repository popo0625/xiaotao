import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.favorite.findUnique({
    where: { userId_productId: { userId: session.user.id, productId: id } },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    await prisma.product.update({ where: { id }, data: { favoriteCount: { decrement: 1 } } });
    return NextResponse.json({ favorited: false });
  } else {
    await prisma.favorite.create({
      data: { userId: session.user.id, productId: id },
    });
    await prisma.product.update({ where: { id }, data: { favoriteCount: { increment: 1 } } });
    return NextResponse.json({ favorited: true });
  }
}
