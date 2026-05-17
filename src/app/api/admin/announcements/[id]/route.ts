import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-utils";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const result = await requireAdmin();
  if ("error" in result) return result.error;

  const { id } = await params;
  const { title, content, pinned, active } = await request.json();

  const data: Record<string, unknown> = {};
  if (title !== undefined) data.title = title.trim();
  if (content !== undefined) data.content = content.trim();
  if (pinned !== undefined) data.pinned = pinned;
  if (active !== undefined) data.active = active;

  const announcement = await prisma.announcement.update({ where: { id }, data });
  return NextResponse.json(announcement);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const result = await requireAdmin();
  if ("error" in result) return result.error;

  const { id } = await params;
  await prisma.announcement.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
