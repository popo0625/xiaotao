"use client";

import { useSearchParams } from "next/navigation";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { ConversationList } from "@/components/chat/ConversationList";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { useConversations } from "@/hooks/useMessages";

export default function MessagesPageContent() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const productId = searchParams.get("productId") || undefined;
  const { conversations, isLoading } = useConversations();

  return (
    <AuthGuard>
      <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-3xl">
        <div className="w-72 flex-shrink-0 border-r border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-4 py-3">
            <h2 className="text-base font-semibold text-gray-900">消息</h2>
          </div>
          <div className="h-[calc(100%-3rem)] overflow-y-auto">
            <ConversationList conversations={conversations} isLoading={isLoading} />
          </div>
        </div>
        <div className="flex-1 bg-white">
          {userId ? (
            <ChatWindow withUserId={userId} productId={productId} />
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-gray-400">选择一个对话开始聊天</p>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
