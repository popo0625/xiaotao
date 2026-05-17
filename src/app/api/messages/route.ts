import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const withUserId = searchParams.get("withUserId");
  const afterId = searchParams.get("afterId");

  if (!withUserId) {
    return NextResponse.json({ error: "缺少参数" }, { status: 400 });
  }

  const where: Record<string, unknown> = {
    OR: [
      { senderId: session.user.id, receiverId: withUserId },
      { senderId: withUserId, receiverId: session.user.id },
    ],
  };

  if (afterId) {
    const lastMsg = await prisma.message.findUnique({ where: { id: afterId } });
    if (lastMsg) {
      (where as any).createdAt = { gt: lastMsg.createdAt };
    }
  }

  const messages = await prisma.message.findMany({
    where: where as any,
    orderBy: { createdAt: "asc" },
    take: 100,
    include: {
      sender: { select: { id: true, name: true, avatar: true } },
    },
  });

  return NextResponse.json(messages);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  try {
    const { receiverId, productId, content, imageUrl } = await request.json();

    if (!receiverId) {
      return NextResponse.json({ error: "请填写完整信息" }, { status: 400 });
    }
    if (!content?.trim() && !imageUrl) {
      return NextResponse.json({ error: "请填写内容或选择图片" }, { status: 400 });
    }

    const message = await prisma.message.create({
      data: {
        senderId: session.user.id,
        receiverId,
        productId: productId || null,
        content: content?.trim() || "",
        imageUrl: imageUrl || null,
      },
      include: {
        sender: { select: { id: true, name: true, avatar: true } },
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Send message error:", error);
    return NextResponse.json({ error: "发送失败" }, { status: 500 });
  }
}
