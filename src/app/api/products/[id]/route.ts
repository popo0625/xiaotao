import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      accessories: { include: { accessory: true } },
      flaws: true,
      category: true,
      user: { select: { id: true, name: true, avatar: true, creditScore: true, location: true, createdAt: true, studentIdVerified: true } },
    },
  });

  if (!product) {
    return NextResponse.json({ error: "商品不存在" }, { status: 404 });
  }

  await prisma.product.update({ where: { id }, data: { viewCount: { increment: 1 } } });

  return NextResponse.json(product);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    return NextResponse.json({ error: "商品不存在" }, { status: 404 });
  }
  if (product.userId !== session.user.id) {
    return NextResponse.json({ error: "无权编辑" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const updateData: Record<string, unknown> = {};

    const fields = ["title", "description", "price", "originalPrice", "grade", "brand", "isShippingIncluded", "shippingLocation", "sellerType", "status"];
    for (const field of fields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    // Handle images update
    if (body.images !== undefined) {
      await prisma.productImage.deleteMany({ where: { productId: id } });
      await prisma.productImage.createMany({
        data: body.images.map((img: { url: string; sortOrder?: number; type?: string }, i: number) => ({
          productId: id,
          url: img.url,
          sortOrder: img.sortOrder ?? i,
          type: img.type ?? "image",
        })),
      });
    }

    // Handle accessories update
    if (body.accessories !== undefined) {
      await prisma.productAccessory.deleteMany({ where: { productId: id } });
      if (body.accessories.length > 0) {
        await prisma.productAccessory.createMany({
          data: body.accessories.map((a: { accessoryId: number; isIncluded: boolean }) => ({
            productId: id,
            accessoryId: a.accessoryId,
            isIncluded: a.isIncluded,
          })),
        });
      }
    }

    // Handle flaws update
    if (body.flaws !== undefined) {
      await prisma.productFlaw.deleteMany({ where: { productId: id } });
      if (body.flaws.length > 0) {
        await prisma.productFlaw.createMany({
          data: body.flaws.map((f: { description: string; severity: string }) => ({
            productId: id,
            description: f.description,
            severity: f.severity,
          })),
        });
      }
    }

    const updated = await prisma.product.update({
      where: { id },
      data: updateData as any,
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        accessories: { include: { accessory: true } },
        flaws: true,
        category: true,
        user: { select: { id: true, name: true, avatar: true, creditScore: true, studentIdVerified: true } },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json({ error: "编辑失败" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    return NextResponse.json({ error: "商品不存在" }, { status: 404 });
  }
  if (product.userId !== session.user.id) {
    return NextResponse.json({ error: "无权删除" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const hard = searchParams.get("hard") === "true";

  if (hard) {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true, hard: true });
  }

  await prisma.product.update({
    where: { id },
    data: { status: "CANCELLED" },
  });

  return NextResponse.json({ success: true });
}
