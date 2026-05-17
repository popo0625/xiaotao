import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const categories = await prisma.productCategory.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(categories);
}
