import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const items = await prisma.accessoryItem.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(items);
}
