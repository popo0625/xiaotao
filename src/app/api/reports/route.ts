import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  try {
    const { productId, reason, description } = await request.json();

    const report = await prisma.report.create({
      data: {
        reporterId: session.user.id,
        productId,
        reason: reason || "其他",
        description,
      },
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error("Report error:", error);
    return NextResponse.json({ error: "举报失败" }, { status: 500 });
  }
}
