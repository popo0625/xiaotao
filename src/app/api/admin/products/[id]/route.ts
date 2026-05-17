import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-utils";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const result = await requireAdmin();
  if ("error" in result) return result.error;

  const { id } = await params;
  const body = await request.json();
  const { status, isVerified } = body;

  const product = await prisma.product.findUnique({ where: { id }, select: { id: true } });
  if (!product) {
    return NextResponse.json({ error: "商品不存在" }, { status: 404 });
  }

  const data: Record<string, unknown> = {};
  if (status !== undefined && ["ACTIVE", "SOLD", "RESERVED", "CANCELLED"].includes(status)) {
    data.status = status;
  }
  if (isVerified !== undefined) data.isVerified = isVerified;

  const updated = await prisma.product.update({
    where: { id },
    data,
    select: {
      id: true, title: true, price: true, status: true, isVerified: true,
      user: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const result = await requireAdmin();
  if ("error" in result) return result.error;

  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id }, select: { id: true } });
  if (!product) {
    return NextResponse.json({ error: "商品不存在" }, { status: 404 });
  }

  await prisma.productImage.deleteMany({ where: { productId: id } });
  await prisma.productAccessory.deleteMany({ where: { productId: id } });
  await prisma.productFlaw.deleteMany({ where: { productId: id } });
  await prisma.favorite.deleteMany({ where: { productId: id } });
  await prisma.product.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
