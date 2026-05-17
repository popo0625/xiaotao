import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-utils";

export async function GET(request: NextRequest) {
  const result = await requireAdmin();
  if ("error" in result) return result.error;

  const { searchParams } = new URL(request.url);
  const all = searchParams.get("all") === "true";

  const announcements = await prisma.announcement.findMany({
    orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
    ...(all ? {} : { where: { active: true } }),
  });
  return NextResponse.json(announcements);
}

export async function POST(request: Request) {
  const result = await requireAdmin();
  if ("error" in result) return result.error;

  const { title, content, pinned } = await request.json();
  if (!title?.trim() || !content?.trim()) {
    return NextResponse.json({ error: "标题和内容不能为空" }, { status: 400 });
  }

  const announcement = await prisma.announcement.create({
    data: { title: title.trim(), content: content.trim(), pinned: pinned || false },
  });
  return NextResponse.json(announcement, { status: 201 });
}
