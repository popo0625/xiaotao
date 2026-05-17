"use client";

import { useState, useEffect } from "react";
import { HiSpeakerphone, HiX } from "react-icons/hi";

export function AnnouncementBanner() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetch("/api/announcements")
      .then((r) => r.json())
      .then((data) => setAnnouncements(data))
      .catch(() => {});
  }, []);

  // Rotate every 6 seconds if multiple announcements
  useEffect(() => {
    if (announcements.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % announcements.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [announcements.length]);

  if (announcements.length === 0 || dismissed) return null;

  const a = announcements[current];
  if (!a) return null;

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm">
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-2 top-2 rounded-full p-1 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
      >
        <HiX className="h-4 w-4" />
      </button>
      <div className="px-5 py-4 pr-10">
        <div className="flex items-start gap-3">
          <HiSpeakerphone className="h-5 w-5 flex-shrink-0 mt-0.5 text-blue-200" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">{a.title}</p>
            <p className="mt-0.5 text-sm text-blue-100 whitespace-pre-wrap">{a.content}</p>
          </div>
        </div>
        {announcements.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-2">
            {announcements.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === current ? "w-6 bg-white" : "w-1.5 bg-white/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
