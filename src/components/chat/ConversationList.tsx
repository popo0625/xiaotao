"use client";

import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface Conversation {
  partnerId: string;
  partnerName: string;
  partnerAvatar: string | null;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  productTitle?: string;
}

export function ConversationList({ conversations, isLoading }: { conversations: Conversation[]; isLoading: boolean }) {
  if (isLoading) return <LoadingSpinner />;

  if (conversations.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-gray-400">暂无消息</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {conversations.map((conv) => (
        <Link
          key={conv.partnerId}
          href={`/messages/${conv.partnerId}`}
          className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-gray-50"
        >
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600 overflow-hidden">
            {conv.partnerAvatar ? (
              <img src={conv.partnerAvatar} alt="" className="h-full w-full object-cover" />
            ) : (
              conv.partnerName?.[0] || "?"
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">{conv.partnerName}</span>
              <span className="text-xs text-gray-400">{formatDate(conv.lastMessageAt)}</span>
            </div>
            <p className="mt-0.5 truncate text-sm text-gray-500">{conv.lastMessage || "暂无消息"}</p>
            {conv.productTitle && (
              <p className="mt-0.5 text-xs text-blue-500 truncate">关于：{conv.productTitle}</p>
            )}
          </div>
          {conv.unreadCount > 0 && (
            <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {conv.unreadCount > 9 ? "9+" : conv.unreadCount}
            </div>
          )}
        </Link>
      ))}
    </div>
  );
}
