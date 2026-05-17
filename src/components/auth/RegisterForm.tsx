"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function RegisterForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [codeSending, setCodeSending] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const sendCode = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("请输入有效的邮箱地址");
      return;
    }
    if (!email.endsWith("@qq.com")) {
      setError("仅支持 QQ 邮箱注册");
      return;
    }
    setError("");
    setCodeSending(true);

    try {
      const res = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "发送失败");
        return;
      }

      setCodeSent(true);
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch {
      setError("验证码发送失败，请重试");
    } finally {
      setCodeSending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("邮箱格式不正确");
      return;
    }
    if (!email.endsWith("@qq.com")) {
      setError("仅支持 QQ 邮箱注册");
      return;
    }

    if (!/^\d{6}$/.test(verificationCode)) {
      setError("验证码为6位数字");
      return;
    }

    if (password.length < 6) {
      setError("密码至少6个字符");
      return;
    }

    if (password !== confirmPassword) {
      setError("两次密码不一致");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          verificationCode,
          password,
          name: name || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "注册失败");
        return;
      }

      // Auto-login after successful registration
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        router.push("/login");
      } else {
        router.push("/profile/edit?firstTime=true");
        router.refresh();
      }
    } catch {
      setError("注册失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="邮箱"
        type="email"
        id="email"
        placeholder="请输入 QQ 邮箱"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <p className="-mt-3 text-xs text-gray-400">仅支持 QQ 邮箱注册</p>
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            label="验证码"
            type="text"
            id="verificationCode"
            placeholder="请输入6位验证码"
            maxLength={6}
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
            required
          />
        </div>
        <div className="flex items-end">
          <Button
            type="button"
            variant="secondary"
            onClick={sendCode}
            disabled={codeSending || countdown > 0}
            className="whitespace-nowrap"
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
      <Input
        label="密码"
        type="password"
        id="password"
        placeholder="至少6位密码"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Input
        label="确认密码"
        type="password"
        id="confirmPassword"
        placeholder="再次输入密码"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      <Input
        label="用户名（选填）"
        type="text"
        id="name"
        placeholder="留空将自动生成"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" loading={loading} className="w-full">
        注册
      </Button>
    </form>
  );
}
