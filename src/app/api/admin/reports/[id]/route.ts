import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-utils";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const result = await requireAdmin();
  if ("error" in result) return result.error;

  const { id } = await params;
  const body = await request.json();
  const { status } = body;

  if (!status || !["resolved", "dismissed"].includes(status)) {
    return NextResponse.json({ error: "无效的状态值" }, { status: 400 });
  }

  const report = await prisma.report.findUnique({ where: { id }, select: { id: true, status: true } });
  if (!report) {
    return NextResponse.json({ error: "举报不存在" }, { status: 404 });
  }

  const updated = await prisma.report.update({
    where: { id },
    data: { status, resolvedAt: new Date() },
    select: {
      id: true, reason: true, status: true, resolvedAt: true,
      reporter: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json(updated);
}
