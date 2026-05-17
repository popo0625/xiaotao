import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-utils";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const result = await requireAdmin();
  if ("error" in result) return result.error;
  const adminId = result.session.user.id;

  const { id } = await params;
  if (id === adminId) {
    return NextResponse.json({ error: "不能封禁自己" }, { status: 400 });
  }

  const target = await prisma.user.findUnique({ where: { id }, select: { role: true } });
  if (!target) {
    return NextResponse.json({ error: "用户不存在" }, { status: 404 });
  }
  if (target.role === "ADMIN") {
    return NextResponse.json({ error: "不能封禁管理员" }, { status: 403 });
  }

  // Toggle block
  const existing = await prisma.blockedUser.findFirst({
    where: { blockerId: adminId, blockedId: id },
  });

  if (existing) {
    await prisma.blockedUser.delete({ where: { id: existing.id } });
    return NextResponse.json({ blocked: false });
  } else {
    await prisma.blockedUser.create({ data: { blockerId: adminId, blockedId: id } });
    return NextResponse.json({ blocked: true });
  }
}
