import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category");
  const grade = searchParams.get("grade");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const sort = searchParams.get("sort") || "new";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = { status: "ACTIVE" };

  if (search) {
    where.searchText = { contains: search };
  }
  if (category) {
    where.categoryId = parseInt(category);
  }
  if (grade) {
    where.grade = grade;
  }
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) (where.price as Record<string, unknown>).gte = parseFloat(minPrice);
    if (maxPrice) (where.price as Record<string, unknown>).lte = parseFloat(maxPrice);
  }

  const orderBy: Record<string, string> =
    sort === "price_asc" ? { price: "asc" } :
    sort === "price_desc" ? { price: "desc" } :
    sort === "popular" ? { viewCount: "desc" } :
    { createdAt: "desc" };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: where as any,
      orderBy: orderBy as any,
      skip,
      take: limit,
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
        user: { select: { id: true, name: true, avatar: true, creditScore: true } },
      },
    }),
    prisma.product.count({ where: where as any }),
  ]);

  return NextResponse.json({
    products,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      title, description, categoryId, price, originalPrice,
      grade, brand,
      isShippingIncluded, shippingLocation, sellerType,
      images, accessories, flaws,
    } = body;

    if (!title || !categoryId || price === undefined || !grade) {
      return NextResponse.json({ error: "请填写必填字段" }, { status: 400 });
    }

    const searchText = [title, brand, description]
      .filter(Boolean).join(" ");

    const product = await prisma.product.create({
      data: {
        title,
        description,
        categoryId: parseInt(categoryId),
        userId: session.user.id,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        grade,
        brand,
        isShippingIncluded: isShippingIncluded || false,
        shippingLocation,
        sellerType: sellerType || "个人卖家",
        searchText,
        images: {
          create: (images || []).map((img: { url: string; sortOrder?: number; type?: string }, i: number) => ({
            url: img.url,
            sortOrder: img.sortOrder ?? i,
            type: img.type || "image",
          })),
        },
        accessories: accessories ? {
          create: accessories.map((acc: { accessoryId: number; isIncluded?: boolean; description?: string }) => ({
            accessoryId: acc.accessoryId,
            isIncluded: acc.isIncluded ?? true,
            description: acc.description,
          })),
        } : undefined,
        flaws: flaws ? {
          create: flaws.map((flaw: { description: string; severity?: string; imageUrl?: string }) => ({
            description: flaw.description,
            severity: flaw.severity || "minor",
            imageUrl: flaw.imageUrl,
          })),
        } : undefined,
      },
      include: {
        images: true,
        accessories: { include: { accessory: true } },
        flaws: true,
        category: true,
        user: { select: { id: true, name: true, avatar: true, creditScore: true } },
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json({ error: "发布失败" }, { status: 500 });
  }
}
