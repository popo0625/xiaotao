"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { ChatWindow } from "@/components/chat/ChatWindow";

export default function ConversationPage() {
  const params = useParams();
  const conversationId = params.conversationId as string;

  return (
    <AuthGuard>
      <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-6xl">
        <div className="flex-1 bg-white">
          <div className="h-full">
            <ChatWindow withUserId={conversationId} />
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
