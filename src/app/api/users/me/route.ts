import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true, name: true, email: true, avatar: true,
        creditScore: true, role: true, bio: true, campus: true, location: true,
        isVerified: true, isFirstTimeSetup: true, createdAt: true,
        _count: { select: { products: true, purchases: true, sales: true } },
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json({ error: "获取用户信息失败" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  try {
    const { name, bio, campus, location, avatar } = await request.json();

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(name !== undefined && { name }),
        ...(bio !== undefined && { bio }),
        ...(campus !== undefined && { campus }),
        ...(location !== undefined && { location }),
        ...(avatar !== undefined && { avatar: avatar || null }),
        ...(name !== undefined && { isFirstTimeSetup: false }),
      },
      select: {
        id: true, name: true, email: true, avatar: true,
        creditScore: true, role: true, bio: true, campus: true, location: true,
        isVerified: true, isFirstTimeSetup: true, createdAt: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}
