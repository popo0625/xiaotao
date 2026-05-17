"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { AvatarUploader } from "@/components/user/AvatarUploader";
import { generateRandomName, generateRandomAvatar } from "@/lib/utils";
import { HiShieldCheck } from "react-icons/hi";

function EditProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [campus, setCampus] = useState("");
  const [dormitory, setDormitory] = useState("");
  const [email, setEmail] = useState("");

  // Email change state
  const [changingEmail, setChangingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [emailCodeSending, setEmailCodeSending] = useState(false);
  const [emailCodeSent, setEmailCodeSent] = useState(false);
  const [emailCountdown, setEmailCountdown] = useState(0);

  const isFirstTime = searchParams.get("firstTime") === "true";

  useEffect(() => {
    fetch("/api/users/me")
      .then((r) => r.json())
      .then((data) => {
        setAvatar(data.avatar || null);
        setName(data.name || "");
        setBio(data.bio || "");
        setCampus(data.campus || "");
        setDormitory(data.location || "");
        setEmail(data.email || "");
      })
      .catch(() => toast.error("加载失败"))
      .finally(() => setLoading(false));
  }, []);

  const handleRandomName = () => {
    const newName = generateRandomName();
    setName(newName);
  };

  const handleRandomAvatar = () => {
    const seed = name || generateRandomName();
    const url = generateRandomAvatar(seed);
    setAvatar(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!campus) {
      toast.error("请选择校区");
      return;
    }
    if (!dormitory.trim()) {
      toast.error("请填写宿舍楼");
      return;
    }

    const displayName = name.trim() || generateRandomName();

    setSaving(true);
    try {
      const res = await fetch("/api/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: displayName,
          bio,
          campus,
          location: dormitory,
          avatar,
        }),
      });
      if (!res.ok) throw new Error("保存失败");
      toast.success("保存成功");
      await update({ image: avatar });
      if (session?.user?.id) {
        router.push(`/profile/${session.user.id}`);
      } else {
        router.refresh();
      }
    } catch {
      toast.error("保存失败");
    } finally {
      setSaving(false);
    }
  };

  const handleSendEmailCode = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      toast.error("请输入有效的邮箱地址");
      return;
    }
    setEmailCodeSending(true);
    try {
      const res = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "发送失败");
      setEmailCodeSent(true);
      setEmailCountdown(60);
      const timer = setInterval(() => {
        setEmailCountdown((prev) => {
          if (prev <= 1) { clearInterval(timer); return 0; }
          return prev - 1;
        });
      }, 1000);
      toast.success("验证码已发送，请查看邮箱（如未收到请检查垃圾邮件）");
    } catch (err: any) {
      toast.error(err.message || "发送失败");
    } finally {
      setEmailCodeSending(false);
    }
  };

  const handleChangeEmail = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      toast.error("请输入有效的邮箱地址");
      return;
    }
    if (!/^\d{6}$/.test(emailCode)) {
      toast.error("验证码为6位数字");
      return;
    }
    try {
      const res = await fetch("/api/users/me/email", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail, verificationCode: emailCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "更换失败");
      toast.success("邮箱更换成功");
      setEmail(newEmail);
      setChangingEmail(false);
      setNewEmail("");
      setEmailCode("");
      setEmailCodeSent(false);
    } catch (err: any) {
      toast.error(err.message || "更换失败");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900">编辑资料</h1>

      {isFirstTime && (
        <div className="mt-4 rounded-lg bg-blue-50 p-4 text-sm text-blue-700">
          欢迎！请完善你的个人资料后开始使用。
        </div>
      )}

      <Card className="mt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">头像</label>
            <div className="flex items-center gap-3">
              <AvatarUploader
                currentAvatar={avatar}
                userName={name || "?"}
                onUpload={(url) => setAvatar(url)}
              />
              <Button type="button" variant="ghost" size="sm" onClick={handleRandomAvatar}>
                随机头像
              </Button>
            </div>
          </div>

          {/* Username */}
          <div>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Input
                  label="用户名"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="留空将自动生成"
                />
              </div>
              <div className="flex items-end">
                <Button type="button" variant="ghost" size="sm" onClick={handleRandomName}>
                  随机
                </Button>
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-400">选填，不填将自动生成</p>
          </div>

          {/* Campus */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">校区</label>
            <select
              value={campus}
              onChange={(e) => setCampus(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              required
            >
              <option value="">请选择校区</option>
              <option value="花江校区">花江校区</option>
              <option value="金鸡岭校区">金鸡岭校区</option>
              <option value="北海校区">北海校区</option>
            </select>
          </div>

          {/* Dormitory */}
          <Input
            label="宿舍楼"
            id="dormitory"
            value={dormitory}
            onChange={(e) => setDormitory(e.target.value)}
            placeholder="如：D区25栋"
            required
          />

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600 flex-1">
                <HiShieldCheck className="h-4 w-4 text-green-500" />
                {email}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setChangingEmail(!changingEmail)}
              >
                {changingEmail ? "取消" : "更换邮箱"}
              </Button>
            </div>

            {changingEmail && (
              <div className="mt-3 space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                <Input
                  label="新邮箱"
                  type="email"
                  id="newEmail"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="请输入新邮箱地址"
                />
                <p className="text-xs text-gray-400">仅支持更换为 QQ 邮箱</p>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      label="验证码"
                      type="text"
                      id="emailCode"
                      value={emailCode}
                      onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, ""))}
                      placeholder="6位验证码"
                      maxLength={6}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={handleSendEmailCode}
                      disabled={emailCodeSending || emailCountdown > 0}
                    >
                      {emailCountdown > 0 ? `${emailCountdown}s` : emailCodeSending ? "发送中..." : "获取验证码"}
                    </Button>
                  </div>
                </div>
                <Button type="button" size="sm" onClick={handleChangeEmail}>
                  确认更换
                </Button>
              </div>
            )}
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">个人简介</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="介绍你自己..."
              maxLength={200}
            />
            <p className="mt-1 text-xs text-gray-400">{bio.length}/200</p>
          </div>

          <div className="flex gap-3">
            <Button type="submit" loading={saving}>保存</Button>
            <Button type="button" variant="ghost" onClick={() => router.back()}>取消</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default function EditProfilePage() {
  return (
    <AuthGuard>
      <Suspense fallback={<LoadingSpinner />}>
        <EditProfileContent />
      </Suspense>
    </AuthGuard>
  );
}
