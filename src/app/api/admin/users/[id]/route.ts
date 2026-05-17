import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-utils";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const result = await requireAdmin();
  if ("error" in result) return result.error;

  const { id } = await params;
  const body = await request.json();
  const { role, isVerified, creditScore, name } = body;

  // Prevent modifying another admin
  const target = await prisma.user.findUnique({ where: { id }, select: { role: true } });
  if (!target) {
    return NextResponse.json({ error: "用户不存在" }, { status: 404 });
  }
  if (target.role === "ADMIN" && result.session.user.id !== id) {
    return NextResponse.json({ error: "不能修改其他管理员" }, { status: 403 });
  }

  const data: Record<string, unknown> = {};
  if (role !== undefined && ["BUYER", "SELLER", "ADMIN"].includes(role)) data.role = role;
  if (isVerified !== undefined) data.isVerified = isVerified;
  if (creditScore !== undefined) data.creditScore = Math.max(0, Math.min(100, creditScore));
  if (name !== undefined) data.name = name;

  const user = await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true, name: true, email: true, avatar: true, role: true,
      creditScore: true, isVerified: true, createdAt: true,
    },
  });

  return NextResponse.json(user);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const result = await requireAdmin();
  if ("error" in result) return result.error;
  const adminId = result.session.user.id;

  const { id } = await params;
  if (id === adminId) {
    return NextResponse.json({ error: "不能删除自己" }, { status: 400 });
  }

  const target = await prisma.user.findUnique({ where: { id }, select: { id: true } });
  if (!target) {
    return NextResponse.json({ error: "用户不存在" }, { status: 404 });
  }

  // Delete related data in order (same pattern as cleanup script)
  const products = await prisma.product.findMany({ where: { userId: id }, select: { id: true } });
  const productIds = products.map(p => p.id);

  for (const pid of productIds) {
    await prisma.productImage.deleteMany({ where: { productId: pid } });
    await prisma.productAccessory.deleteMany({ where: { productId: pid } });
    await prisma.productFlaw.deleteMany({ where: { productId: pid } });
    await prisma.favorite.deleteMany({ where: { productId: pid } });
  }
  await prisma.product.deleteMany({ where: { userId: id } });
  await prisma.message.deleteMany({ where: { OR: [{ senderId: id }, { receiverId: id }] } });
  await prisma.review.deleteMany({ where: { reviewerId: id } });
  await prisma.favorite.deleteMany({ where: { userId: id } });
  await prisma.report.deleteMany({ where: { reporterId: id } });
  await prisma.blockedUser.deleteMany({ where: { OR: [{ blockerId: id }, { blockedId: id }] } });
  await prisma.transaction.deleteMany({ where: { OR: [{ buyerId: id }, { sellerId: id }] } });
  await prisma.verificationCode.deleteMany({ where: { email: (await prisma.user.findUnique({ where: { id }, select: { email: true } }))?.email || "" } });
  await prisma.user.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
