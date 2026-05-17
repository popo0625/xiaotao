import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { disclaimerAccepted: true },
  });

  return NextResponse.json({ ok: true });
}
