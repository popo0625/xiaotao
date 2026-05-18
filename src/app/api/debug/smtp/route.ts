import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function GET() {
  const result: Record<string, unknown> = {
    smtpUser: process.env.SMTP_USER ? "✓ 已设置" : "✗ 未设置",
    smtpPass: process.env.SMTP_PASS ? "✓ 已设置" : "✗ 未设置",
    tests: [] as string[],
  };

  // Try SMTP connection
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.qq.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      connectionTimeout: 10000,
    });
    await transporter.verify();
    result.tests.push("✓ SMTP 连接成功");
  } catch (e) {
    result.tests.push(`✗ SMTP 连接失败: ${(e as Error).message}`);
  }

  return NextResponse.json(result);
}
