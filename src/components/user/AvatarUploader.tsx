"use client";

import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { AvatarDisplay } from "./AvatarDisplay";

interface AvatarUploaderProps {
  currentAvatar: string | null;
  userName: string;
  onUpload: (url: string) => void;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export function AvatarUploader({ currentAvatar, userName, onUpload }: AvatarUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("仅支持 JPG/PNG/WebP 格式");
      return;
    }
    if (file.size > MAX_SIZE) {
      toast.error("头像文件大小不能超过 5MB");
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("type", "avatar");

      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error();
      const { url } = await res.json();
      onUpload(url);
      toast.success("头像已更新");
    } catch {
      toast.error("上传失败，请重试");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="flex items-center gap-4">
      <AvatarDisplay src={currentAvatar} name={userName} size="lg" />
      <div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          {uploading ? "上传中..." : "更换头像"}
        </button>
        <p className="mt-1 text-xs text-gray-400">支持 JPG/PNG/WebP，最大 5MB</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}
