"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { AdminTable, Column } from "@/components/admin/AdminTable";
import { Pagination } from "@/components/ui/Pagination";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { formatDate } from "@/lib/utils";
import { HiTrash, HiBan, HiCheck, HiPencil } from "react-icons/hi";

const ROLE_BADGE: Record<string, "danger" | "info" | "default"> = {
  ADMIN: "danger",
  SELLER: "info",
  BUYER: "default",
};

const ROLE_LABEL: Record<string, string> = {
  ADMIN: "管理员",
  SELLER: "卖家",
  BUYER: "买家",
};

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: string;
  creditScore: number;
  isVerified: boolean;
  phone: string;
  createdAt: string;
  _count: { products: number; reports: number };
}

export function UsersPageContent() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [verifyFilter, setVerifyFilter] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (search) params.set("search", search);
      if (roleFilter) params.set("role", roleFilter);
      if (verifyFilter) params.set("isVerified", verifyFilter);
      const res = await fetch(`/api/admin/users?${params}`);
      if (!res.ok) throw new Error("加载失败");
      const data = await res.json();
      setUsers(data.users);
      setTotalPages(data.totalPages);
    } catch {
      toast.error("加载失败");
    } finally {
      setLoading(false);
    }
  }, [page, search, roleFilter, verifyFilter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Reset page on filter change
  useEffect(() => { setPage(1); }, [search, roleFilter, verifyFilter]);

  const handleBlock = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/block`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(data.blocked ? "已封禁" : "已解封");
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || "操作失败");
    }
  };

  const handleDelete = async (userId: string, userName: string) => {
    if (!confirm(`确定要删除用户「${userName}」吗？所有相关数据将被清除。`)) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("已删除");
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || "操作失败");
    }
  };

  const handleEditSave = async () => {
    if (!editingUser) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: editingUser.role,
          isVerified: editingUser.isVerified,
          creditScore: editingUser.creditScore,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("已更新");
      setEditingUser(null);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || "保存失败");
    } finally {
      setSaving(false);
    }
  };

  const columns: Column<User>[] = [
    {
      key: "user",
      header: "用户",
      render: (u) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium text-blue-600 overflow-hidden flex-shrink-0">
            {u.avatar ? <img src={u.avatar} alt="" className="h-full w-full object-cover" /> : u.name?.[0] || "?"}
          </div>
          <div>
            <p className="font-medium text-gray-900">{u.name || "未设置"}</p>
            <p className="text-xs text-gray-500">{u.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "角色",
      render: (u) => <Badge variant={ROLE_BADGE[u.role] || "default"}>{ROLE_LABEL[u.role] || u.role}</Badge>,
    },
    {
      key: "creditScore",
      header: "信誉分",
      render: (u) => (
        <Badge variant={u.creditScore >= 80 ? "success" : u.creditScore >= 60 ? "warning" : "danger"}>
          {u.creditScore}
        </Badge>
      ),
    },
    {
      key: "isVerified",
      header: "认证",
      render: (u) => <Badge variant={u.isVerified ? "success" : "warning"}>{u.isVerified ? "已认证" : "未认证"}</Badge>,
    },
    {
      key: "products",
      header: "商品",
      render: (u) => <span className="text-gray-600">{u._count.products}</span>,
    },
    {
      key: "createdAt",
      header: "注册时间",
      render: (u) => <span className="text-gray-500 text-xs">{formatDate(u.createdAt)}</span>,
    },
    {
      key: "actions",
      header: "操作",
      render: (u) => (
        <div className="flex gap-1">
          <button
            onClick={() => setEditingUser({ ...u })}
            className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-blue-600 transition-colors"
            title="编辑"
          >
            <HiPencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleBlock(u.id)}
            className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-orange-600 transition-colors"
            title={u.role === "ADMIN" ? "不能封禁管理员" : "封禁/解封"}
          >
            <HiBan className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(u.id, u.name || u.email)}
            className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-600 transition-colors"
            title="删除"
          >
            <HiTrash className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">用户管理</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="搜索用户名或邮箱..."
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none w-64"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="">全部角色</option>
          <option value="BUYER">买家</option>
          <option value="SELLER">卖家</option>
          <option value="ADMIN">管理员</option>
        </select>
        <select
          value={verifyFilter}
          onChange={(e) => setVerifyFilter(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="">全部认证</option>
          <option value="true">已认证</option>
          <option value="false">未认证</option>
        </select>
      </div>

      {/* Table */}
      <AdminTable
        columns={columns}
        data={users}
        keyExtractor={(u) => u.id}
        loading={loading}
        emptyState={{ title: "暂无用户", description: "没有找到匹配的用户" }}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      )}

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setEditingUser(null)}>
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">编辑用户</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">角色</label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="BUYER">买家</option>
                  <option value="SELLER">卖家</option>
                  <option value="ADMIN">管理员</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">认证状态</label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editingUser.isVerified}
                    onChange={(e) => setEditingUser({ ...editingUser, isVerified: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-600">已认证</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">信誉分 (0-100)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={editingUser.creditScore}
                  onChange={(e) => setEditingUser({ ...editingUser, creditScore: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="ghost" onClick={() => setEditingUser(null)}>取消</Button>
              <Button onClick={handleEditSave} loading={saving}>保存</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
