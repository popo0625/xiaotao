import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const announcements = await prisma.announcement.findMany({
    where: { active: true },
    orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
    select: { id: true, title: true, content: true, pinned: true, createdAt: true },
  });
  return NextResponse.json(announcements);
}
