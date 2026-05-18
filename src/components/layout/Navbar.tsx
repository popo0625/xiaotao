"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { HiMenu, HiX, HiUser, HiLogout, HiPlus, HiLockOpen, HiCog } from "react-icons/hi";
import { AvatarDisplay } from "@/components/user/AvatarDisplay";
export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Hide navbar on admin pages
  if (pathname.startsWith("/admin")) return null;

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">🎓</span>
            <span className="text-xl font-bold text-gray-900">校淘</span>
          </Link>

          {/* Nav Links - Desktop */}
          <div className="hidden md:flex md:items-center md:gap-6">
            <Link href="/products" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              浏览商品
            </Link>
            {session ? (
              <>
                <Link
                  href="/products/create"
                  className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  <HiPlus className="h-4 w-4" />
                  发布商品
                </Link>
                <Link href="/messages" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                  消息
                </Link>
                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 rounded-lg p-2 text-sm text-gray-600 hover:bg-gray-100"
                  >
                    <AvatarDisplay src={session.user?.image || null} name={session.user?.name || "U"} size="sm" />
                    <span className="hidden lg:inline">{session.user?.name}</span>
                  </button>
                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                      <div className="absolute right-0 z-20 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                        {session?.user?.id && (
                          <Link
                            href={`/profile/${session.user.id}`}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <HiUser className="h-4 w-4" />
                            个人主页
                          </Link>
                        )}
                        <Link
                          href="/profile/edit"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <HiUser className="h-4 w-4" />
                          编辑资料
                        </Link>
                        <Link
                          href="/profile/change-password"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <HiLockOpen className="h-4 w-4" />
                          修改密码
                        </Link>
                        {session?.user?.role === "ADMIN" && (
                          <Link
                            href="/admin"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <HiCog className="h-4 w-4" />
                            管理后台
                          </Link>
                        )}
                        <button
                          onClick={() => { signOut({ redirect: false }).then(() => { window.location.href = "/"; }); setUserMenuOpen(false); }}
                          className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                        >
                          <HiLogout className="h-4 w-4" />
                          退出登录
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                  登录
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  注册
                </Link>
              </div>
            )}
          </div>

          {/* Mobile right side */}
          <div className="flex items-center gap-1 md:hidden">
            {!session && (
              <>
                <Link href="/login" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
                  登录
                </Link>
                <Link href="/register" className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700">
                  注册
                </Link>
              </>
            )}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-gray-600 hover:bg-gray-100"
            >
              {mobileOpen ? <HiX className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-gray-200 md:hidden">
          <div className="space-y-1 px-4 py-3">
            <Link href="/products" className="block rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100">
              浏览商品
            </Link>
            {session ? (
              <>
                <Link href="/products/create" className="block rounded-lg px-3 py-2 text-sm font-medium text-blue-600 hover:bg-gray-100">
                  发布商品
                </Link>
                <Link href="/messages" className="block rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100">
                  消息
                </Link>
                {session?.user?.id && (
                  <Link href={`/profile/${session.user.id}`} className="block rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100">
                    个人主页
                  </Link>
                )}
                {session?.user?.role === "ADMIN" && (
                  <Link href="/admin" className="block rounded-lg px-3 py-2 text-sm text-blue-600 hover:bg-gray-100">
                    管理后台
                  </Link>
                )}
                <button
                  onClick={() => { signOut({ redirect: false }).then(() => { window.location.href = "/"; }); }}
                  className="block w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                >
                  退出登录
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link href="/login" className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-center text-sm text-gray-700">
                  登录
                </Link>
                <Link href="/register" className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-center text-sm text-white">
                  注册
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
