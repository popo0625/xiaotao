import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const { email, verificationCode } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "请输入有效的邮箱地址" }, { status: 400 });
    }

    if (!email.endsWith("@qq.com")) {
      return NextResponse.json({ error: "仅支持更换为 QQ 邮箱" }, { status: 400 });
    }

    if (!/^\d{6}$/.test(verificationCode)) {
      return NextResponse.json({ error: "验证码为6位数字" }, { status: 400 });
    }

    // Check new email not already taken by another user
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing && existing.id !== session.user.id) {
      return NextResponse.json({ error: "该邮箱已被其他账号绑定" }, { status: 400 });
    }

    // Verify the code
    const record = await prisma.verificationCode.findFirst({
      where: {
        email,
        code: verificationCode,
        used: false,
        expiresAt: { gte: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!record) {
      return NextResponse.json({ error: "验证码无效或已过期" }, { status: 400 });
    }

    // Mark code as used
    await prisma.verificationCode.update({
      where: { id: record.id },
      data: { used: true },
    });

    // Update email
    await prisma.user.update({
      where: { id: session.user.id },
      data: { email },
    });

    return NextResponse.json({ message: "邮箱更换成功" });
  } catch (error) {
    console.error("Change email error:", error);
    return NextResponse.json({ error: "邮箱更换失败" }, { status: 500 });
  }
}
