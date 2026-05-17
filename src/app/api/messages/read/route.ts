import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  const { senderId } = await request.json();

  const result = await prisma.message.updateMany({
    where: {
      senderId,
      receiverId: session.user.id,
      isRead: false,
    },
    data: { isRead: true },
  });

  return NextResponse.json({ count: result.count });
}
