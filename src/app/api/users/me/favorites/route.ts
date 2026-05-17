import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          include: {
            images: { where: { type: "image" }, take: 1, orderBy: { sortOrder: "asc" } },
            user: { select: { id: true, name: true, avatar: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(favorites.map((f) => f.product));
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json({ error: "获取收藏失败" }, { status: 500 });
  }
}
