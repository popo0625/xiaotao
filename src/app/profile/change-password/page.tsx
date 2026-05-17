"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { HiShieldCheck, HiArrowLeft } from "react-icons/hi";

function ChangePasswordContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [codeSending, setCodeSending] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    fetch("/api/users/me")
      .then((r) => r.json())
      .then((data) => {
        setEmail(data.email || "");
      })
      .catch(() => toast.error("加载失败"))
      .finally(() => setLoading(false));
  }, []);

  const sendCode = async () => {
    setCodeSending(true);
    try {
      const res = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "发送失败");
      setCodeSent(true);
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) { clearInterval(timer); return 0; }
          return prev - 1;
        });
      }, 1000);
      toast.success("验证码已发送至你的邮箱");
    } catch (err: any) {
      toast.error(err.message || "发送失败");
    } finally {
      setCodeSending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^\d{6}$/.test(verificationCode)) {
      toast.error("验证码为6位数字");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("新密码至少6个字符");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("两次密码不一致");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/users/me/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verificationCode, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "修改失败");
      toast.success("密码修改成功");
      router.push("/");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "修改失败");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="mx-auto max-w-lg px-4 py-8 sm:px-6 lg:px-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <HiArrowLeft className="h-4 w-4" />
        返回
      </button>

      <h1 className="text-2xl font-bold text-gray-900">修改密码</h1>
      <p className="mt-1 text-sm text-gray-500">通过邮箱验证码重置密码</p>

      <Card className="mt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email (read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">绑定邮箱</label>
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600">
              <HiShieldCheck className="h-4 w-4 text-green-500" />
              {email}
            </div>
          </div>

          {/* Verification Code */}
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                label="验证码"
                type="text"
                id="code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                placeholder="6位验证码"
                maxLength={6}
                required
              />
            </div>
            <div className="flex items-end">
              <Button
                type="button"
                variant="secondary"
                onClick={sendCode}
                disabled={codeSending || countdown > 0}
              >
                {countdown > 0 ? `${countdown}s` : codeSending ? "发送中..." : "获取验证码"}
              </Button>
            </div>
          </div>
          {codeSent && (
            <div className="text-xs text-green-600">
              <p>验证码已发送至 {email}</p>
              <p className="mt-0.5">如未收到，请检查垃圾邮件箱或等待60秒后重试</p>
            </div>
          )}

          {/* New Password */}
          <Input
            label="新密码"
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="至少6位密码"
            required
          />

          {/* Confirm Password */}
          <Input
            label="确认新密码"
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="再次输入新密码"
            required
          />

          <Button type="submit" loading={submitting} className="w-full">
            确认修改
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default function ChangePasswordPage() {
  return (
    <AuthGuard>
      <ChangePasswordContent />
    </AuthGuard>
  );
}
