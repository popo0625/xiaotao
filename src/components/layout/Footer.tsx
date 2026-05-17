import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎓</span>
            <span className="text-sm font-semibold text-gray-900">校淘</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/disclaimer" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
              免责声明
            </Link>
            <p className="text-sm text-gray-500">
              桂林电子科技大学校园二手交易平台 — 闲置变现 · 轻松淘好物
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
