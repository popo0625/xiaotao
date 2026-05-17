import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true, name: true, avatar: true, creditScore: true,
        bio: true, campus: true, location: true, studentIdVerified: true,
        isVerified: true, role: true, createdAt: true,
        _count: {
          select: {
            products: true,
            purchases: true,
            sales: { where: { status: "COMPLETED" } },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json({ error: "获取用户信息失败" }, { status: 500 });
  }
}
