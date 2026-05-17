"use client";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-gray-300">出错了</h1>
      <p className="mt-4 text-gray-600">页面遇到了问题，请稍后重试</p>
      <button onClick={reset} className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
        重试
      </button>
    </div>
  );
}
