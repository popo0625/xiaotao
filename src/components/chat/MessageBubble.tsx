import { formatDate } from "@/lib/utils";
import { useState } from "react";

interface MessageBubbleProps {
  content: string;
  imageUrl?: string | null;
  createdAt: string;
  isOwn: boolean;
  senderName: string;
}

export function MessageBubble({ content, imageUrl, createdAt, isOwn }: MessageBubbleProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div className="max-w-[75%]">
        {imageUrl && !imgError ? (
          <div
            className={`overflow-hidden rounded-2xl ${
              isOwn ? "rounded-br-md" : "rounded-bl-md"
            } ${content ? "mb-1" : ""}`}
          >
            <img
              src={imageUrl}
              alt="图片消息"
              className="max-w-full max-h-72 object-contain cursor-pointer"
              onClick={() => window.open(imageUrl, "_blank")}
              onError={() => setImgError(true)}
            />
          </div>
        ) : null}
        {content ? (
          <div
            className={`rounded-2xl px-4 py-2.5 text-sm ${
              isOwn
                ? "bg-blue-600 text-white rounded-br-md"
                : "bg-gray-100 text-gray-900 rounded-bl-md"
            }`}
          >
            {content}
          </div>
        ) : null}
        <p className={`mt-1 text-xs text-gray-400 ${isOwn ? "text-right" : "text-left"}`}>
          {formatDate(createdAt)}
        </p>
      </div>
    </div>
  );
}
