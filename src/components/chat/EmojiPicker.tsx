"use client";

import { useState } from "react";
import { HiEmojiHappy } from "react-icons/hi";

const EMOJIS = [
  "😀", "😂", "🤣", "😊", "😍", "🥰", "😘", "😜",
  "👍", "👎", "👊", "✌️", "🤞", "🤝", "🙏", "💪",
  "❤️", "💕", "💖", "💔", "🔥", "⭐", "✨", "💯",
  "🎉", "🎊", "🎈", "🎁", "💡", "📚", "💰", "🏆",
  "😅", "🤔", "😤", "😭", "🥺", "😱", "🤗", "😎",
  "🙌", "👏", "💝", "🫶", "🥹", "🫡", "🤩", "😇",
  "👋", "✋", "💬", "💭", "🗣️", "📢", "📌", "✅",
  "⏰", "🚀", "⭐", "🌈", "🎵", "🎶", "🍀", "🎯",
];

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
}

export function EmojiPicker({ onSelect }: EmojiPickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="rounded-lg p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
      >
        <HiEmojiHappy className="h-5 w-5" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute bottom-full left-0 mb-2 z-20 w-72 rounded-xl border border-gray-200 bg-white p-3 shadow-lg">
            <div className="grid grid-cols-8 gap-1">
              {EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => {
                    onSelect(emoji);
                    setOpen(false);
                  }}
                  className="rounded-lg p-1.5 text-lg hover:bg-gray-100 transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
