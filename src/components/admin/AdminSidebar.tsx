"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  HiChartBar, HiUsers, HiShoppingBag, HiFlag, HiArrowLeft,
  HiMenu, HiX, HiCog, HiSpeakerphone,
} from "react-icons/hi";

const NAV_ITEMS = [
  { href: "/admin", label: "数据概览", icon: HiChartBar },
  { href: "/admin/users", label: "用户管理", icon: HiUsers },
  { href: "/admin/products", label: "商品管理", icon: HiShoppingBag },
  { href: "/admin/reports", label: "举报管理", icon: HiFlag },
  { href: "/admin/announcements", label: "公告管理", icon: HiSpeakerphone },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-gray-200 px-6">
        <HiCog className="h-6 w-6 text-blue-600" />
        <span className="text-lg font-bold text-gray-900">校淘管理</span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: back to front + admin info */}
      <div className="border-t border-gray-200 p-4">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <HiArrowLeft className="h-4 w-4" />
          返回前台
        </Link>
        {session?.user && (
          <div className="mt-3 flex items-center gap-3 px-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600 overflow-hidden">
              {session.user.image ? (
                <img src={session.user.image} alt="" className="h-full w-full object-cover" />
              ) : (
                session.user.name?.[0] || "A"
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">{session.user.name}</p>
              <p className="text-xs text-gray-500">管理员</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed left-4 top-3 z-50 rounded-lg border border-gray-200 bg-white p-2 shadow-sm lg:hidden"
      >
        {mobileOpen ? <HiX className="h-5 w-5" /> : <HiMenu className="h-5 w-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white transition-transform duration-200 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64">
        <div className="flex w-full flex-col border-r border-gray-200 bg-white">
          {sidebarContent}
        </div>
      </div>
    </>
  );
}
