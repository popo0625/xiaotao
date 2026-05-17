import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email, verificationCode, password, name } = await request.json();

    if (!email || !verificationCode || !password) {
      return NextResponse.json({ error: "请填写所有必填字段" }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "邮箱格式不正确" }, { status: 400 });
    }

    if (!email.endsWith("@qq.com")) {
      return NextResponse.json({ error: "仅支持 QQ 邮箱注册" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "密码至少6个字符" }, { status: 400 });
    }

    // Check email not already registered
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "该邮箱已被注册" }, { status: 400 });
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

    const passwordHash = await bcrypt.hash(password, 10);
    const displayName = name || email.split("@")[0];

    await prisma.verificationCode.update({
      where: { id: record.id },
      data: { used: true },
    });

    const user = await prisma.user.create({
      data: {
        name: displayName,
        email,
        phone: "",
        passwordHash,
      },
    });

    return NextResponse.json(
      { user: { id: user.id, name: user.name } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "注册失败，请重试" }, { status: 500 });
  }
}
