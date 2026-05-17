import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  // Get all distinct conversation partners
  const sentTo = await prisma.message.findMany({
    where: { senderId: session.user.id },
    select: { receiverId: true },
    distinct: ["receiverId"],
  });

  const receivedFrom = await prisma.message.findMany({
    where: { receiverId: session.user.id },
    select: { senderId: true },
    distinct: ["senderId"],
  });

  const partnerIds = new Set<string>();
  sentTo.forEach((m) => partnerIds.add(m.receiverId));
  receivedFrom.forEach((m) => partnerIds.add(m.senderId));

  const conversations = await Promise.all(
    Array.from(partnerIds).map(async (partnerId) => {
      const partner = await prisma.user.findUnique({
        where: { id: partnerId },
        select: { id: true, name: true, avatar: true },
      });

      const lastMessage = await prisma.message.findFirst({
        where: {
          OR: [
            { senderId: session.user.id, receiverId: partnerId },
            { senderId: partnerId, receiverId: session.user.id },
          ],
        },
        orderBy: { createdAt: "desc" },
        include: { product: { select: { id: true, title: true } } },
      });

      const unreadCount = await prisma.message.count({
        where: {
          senderId: partnerId,
          receiverId: session.user.id,
          isRead: false,
        },
      });

      return {
        partnerId,
        partnerName: partner?.name || "未知用户",
        partnerAvatar: partner?.avatar,
        lastMessage: lastMessage?.content || "",
        lastMessageAt: lastMessage?.createdAt || new Date(0),
        unreadCount,
        productId: lastMessage?.product?.id,
        productTitle: lastMessage?.product?.title,
      };
    })
  );

  conversations.sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());

  return NextResponse.json(conversations);
}
