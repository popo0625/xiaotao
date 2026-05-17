"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

export function DisclaimerModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch("/api/user/disclaimer-status")
      .then((r) => r.json())
      .then((data) => {
        if (data.accepted === false) setOpen(true);
      })
      .catch(() => {});
  }, []);

  const handleAccept = async () => {
    try {
      const res = await fetch("/api/user/disclaimer-accept", { method: "POST" });
      if (!res.ok) throw new Error();
      setOpen(false);
    } catch {
      toast.error("操作失败，请重试");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-bold text-gray-900">欢迎使用校淘</h2>
        <p className="mt-3 text-sm text-gray-600 leading-relaxed">
          在使用本平台前，请仔细阅读
          <Link href="/disclaimer" className="text-blue-600 hover:underline" target="_blank" onClick={() => setOpen(false)}>
            免责声明
          </Link>
          。校淘仅作为校园信息撮合平台，不参与用户之间的实际交易，不对交易双方的履约行为承担保证责任。
        </p>
        <div className="mt-6 flex gap-3 justify-end">
          <Link
            href="/disclaimer"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            target="_blank"
            onClick={() => setOpen(false)}
          >
            查看详情
          </Link>
          <button
            onClick={handleAccept}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 transition-colors"
          >
            我已阅读并同意
          </button>
        </div>
      </div>
    </div>
  );
}
