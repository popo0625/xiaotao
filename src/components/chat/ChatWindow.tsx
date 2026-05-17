"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { MessageBubble } from "./MessageBubble";
import { EmojiPicker } from "./EmojiPicker";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { HiPhotograph } from "react-icons/hi";

interface ChatWindowProps {
  withUserId: string;
  productId?: string;
}

export function ChatWindow({ withUserId, productId }: ChatWindowProps) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [partner, setPartner] = useState<{ name: string; avatar: string | null }>({ name: "", avatar: null });
  const fileRef = useRef<HTMLInputElement>(null);

  // Fetch partner info
  useEffect(() => {
    fetch(`/api/users/${withUserId}`)
      .then((r) => r.json())
      .then((data) => {
        setPartner({ name: data.name || "用户", avatar: data.avatar || null });
      })
      .catch(() => setPartner((p) => ({ ...p, name: "用户" })));
  }, [withUserId]);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/messages?withUserId=${withUserId}`);
      const data = await res.json();
      setMessages(data);
      if (data.length > 0) {
        setPartner({ name: data[0].sender?.name || "用户", avatar: data[0].sender?.avatar || null });
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [withUserId]);

  useEffect(() => {
    if (withUserId && session?.user?.id) {
      fetch(`/api/messages/read`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderId: withUserId }),
      }).catch(() => {});
    }
  }, [withUserId, messages.length]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("请选择图片文件");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      toast.error("图片大小不能超过20MB");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("type", "chat");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("上传失败");
      const { url } = await res.json();
      // Send message with image
      const msgRes = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: withUserId,
          imageUrl: url,
          content: input.trim() || "",
          productId: productId || undefined,
        }),
      });
      if (!msgRes.ok) {
        const err = await msgRes.json().catch(() => ({ error: "图片发送失败" }));
        throw new Error(err.error || `HTTP ${msgRes.status}`);
      }
      setInput("");
      await fetchMessages();
    } catch {
      toast.error("图片发送失败");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: withUserId,
          content: input.trim(),
          productId: productId || undefined,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "未知错误" }));
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      setInput("");
      await fetchMessages();
    } catch (e: any) {
      toast.error(e.message || "发送失败");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600 overflow-hidden flex-shrink-0">
          {partner.avatar ? (
            <img src={partner.avatar} alt="" className="h-full w-full object-cover" />
          ) : (
            partner.name?.[0] || "?"
          )}
        </div>
        <span className="text-sm font-medium text-gray-900">{partner.name}</span>
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-gray-400">发送第一条消息开始交流</p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              content={msg.content}
              imageUrl={msg.imageUrl}
              createdAt={msg.createdAt}
              isOwn={msg.senderId === session?.user?.id}
              senderName={msg.sender?.name || "用户"}
            />
          ))
        )}
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex gap-3 items-end">
          <div className="flex-1 flex items-end gap-2 rounded-xl border border-gray-300 px-3 py-2 focus-within:border-blue-500 transition-colors">
            <EmojiPicker onSelect={(emoji) => setInput((prev) => prev + emoji)} />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入消息..."
              className="flex-1 text-sm outline-none"
            />
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-blue-600 transition-colors disabled:opacity-50"
              title="发送图片"
            >
              {uploading ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <HiPhotograph className="h-5 w-5" />
              )}
            </button>
          </div>
          <button
            onClick={sendMessage}
            disabled={(!input.trim() && !uploading) || sending}
            className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            发送
          </button>
        </div>
      </div>
    </div>
  );
}
