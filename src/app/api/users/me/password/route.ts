import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const { verificationCode, newPassword } = await request.json();

    if (!verificationCode || !/^\d{6}$/.test(verificationCode)) {
      return NextResponse.json({ error: "验证码为6位数字" }, { status: 400 });
    }

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: "新密码至少6个字符" }, { status: 400 });
    }

    // Get user email for code verification
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true },
    });

    if (!user?.email) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    // Verify the code
    const record = await prisma.verificationCode.findFirst({
      where: {
        email: user.email,
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

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: session.user.id },
      data: { passwordHash },
    });

    return NextResponse.json({ message: "密码修改成功" });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json({ error: "密码修改失败" }, { status: 500 });
  }
}
