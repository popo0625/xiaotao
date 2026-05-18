import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtpdm.aliyun.com",
  port: Number(process.env.SMTP_PORT) || 465,
  secure: process.env.SMTP_SECURE !== "false",
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
});

export async function sendVerificationCode(email: string, code: string): Promise<void> {
  const fromName = process.env.SMTP_FROM_NAME || "校淘";
  const fromAddr = process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@xiaotao.com";

  await transporter.sendMail({
    from: `"${fromName}" <${fromAddr}>`,
    to: email,
    subject: "校淘验证码",
    html: `
      <div style="max-width:480px;margin:0 auto;padding:24px;font-family:'Microsoft YaHei','PingFang SC',sans-serif;">
        <div style="text-align:center;padding:24px 0;border-bottom:1px solid #e5e7eb;">
          <span style="font-size:24px;">🎓</span>
          <span style="font-size:20px;font-weight:bold;color:#1f2937;margin-left:8px;">校淘</span>
        </div>
        <div style="padding:24px 0;">
          <p style="margin:0 0 16px;color:#374151;font-size:15px;">你好，</p>
          <p style="margin:0 0 16px;color:#374151;font-size:15px;">你的校淘验证码为：</p>
          <div style="background:#f3f4f6;border-radius:12px;padding:20px;text-align:center;margin:16px 0;">
            <span style="font-size:36px;font-weight:bold;color:#2563eb;letter-spacing:8px;font-family:monospace;">${code}</span>
          </div>
          <p style="margin:16px 0 0;color:#6b7280;font-size:13px;">验证码有效期为5分钟，请勿泄露给他人。</p>
          <p style="margin:4px 0 0;color:#6b7280;font-size:13px;">如非本人操作，请忽略此邮件。</p>
        </div>
        <div style="border-top:1px solid #e5e7eb;padding:16px 0;text-align:center;">
          <p style="margin:0;color:#9ca3af;font-size:12px;">此邮件由校淘系统自动发送，请勿回复</p>
        </div>
      </div>
    `,
  });
}
