import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendVerificationCode } from "@/lib/email";

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "请输入有效的邮箱地址" }, { status: 400 });
    }

    if (!email.endsWith("@qq.com")) {
      return NextResponse.json({ error: "仅支持 QQ 邮箱" }, { status: 400 });
    }

    // Rate limit: check last code sent within 60s
    const recent = await prisma.verificationCode.findFirst({
      where: { email, used: false, createdAt: { gte: new Date(Date.now() - 60000) } },
      orderBy: { createdAt: "desc" },
    });
    if (recent) {
      return NextResponse.json({ error: "请60秒后再获取验证码" }, { status: 429 });
    }

    const code = generateCode();

    await prisma.verificationCode.create({
      data: {
        email,
        code,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    await sendVerificationCode(email, code);

    return NextResponse.json({ message: "验证码已发送" });
  } catch (error) {
    console.error("Send code error:", error);
    return NextResponse.json({ error: "验证码发送失败，请检查邮箱地址" }, { status: 500 });
  }
}
