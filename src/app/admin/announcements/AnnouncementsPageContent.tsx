"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { AdminTable, Column } from "@/components/admin/AdminTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";
import { HiPlus, HiPencil, HiTrash, HiStar } from "react-icons/hi";

interface Announcement {
  id: string;
  title: string;
  content: string;
  pinned: boolean;
  active: boolean;
  createdAt: string;
}

export function AnnouncementsPageContent() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [saving, setSaving] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formPinned, setFormPinned] = useState(false);

  const fetchAnnouncements = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/announcements?all=true");
      if (!res.ok) throw new Error("加载失败");
      setAnnouncements(await res.json());
    } catch {
      toast.error("加载失败");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAnnouncements(); }, [fetchAnnouncements]);

  const resetForm = () => {
    setShowForm(false);
    setEditing(null);
    setFormTitle("");
    setFormContent("");
    setFormPinned(false);
  };

  const openEdit = (a: Announcement) => {
    setEditing(a);
    setFormTitle(a.title);
    setFormContent(a.content);
    setFormPinned(a.pinned);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formTitle.trim() || !formContent.trim()) {
      toast.error("标题和内容不能为空");
      return;
    }
    setSaving(true);
    try {
      const url = editing
        ? `/api/admin/announcements/${editing.id}`
        : "/api/admin/announcements";
      const method = editing ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: formTitle, content: formContent, pinned: formPinned }),
      });
      if (!res.ok) throw new Error("保存失败");
      toast.success(editing ? "已更新" : "已发布");
      resetForm();
      fetchAnnouncements();
    } catch {
      toast.error("保存失败");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (a: Announcement) => {
    try {
      const res = await fetch(`/api/admin/announcements/${a.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !a.active }),
      });
      if (!res.ok) throw new Error("操作失败");
      toast.success(a.active ? "已下架" : "已上架");
      fetchAnnouncements();
    } catch {
      toast.error("操作失败");
    }
  };

  const handleDelete = async (a: Announcement) => {
    if (!confirm(`确定要删除公告「${a.title}」吗？`)) return;
    try {
      const res = await fetch(`/api/admin/announcements/${a.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("删除失败");
      toast.success("已删除");
      fetchAnnouncements();
    } catch {
      toast.error("删除失败");
    }
  };

  const columns: Column<Announcement>[] = [
    {
      key: "title",
      header: "标题",
      render: (a) => (
        <div className="flex items-center gap-2">
          {a.pinned && <HiStar className="h-4 w-4 text-yellow-500 flex-shrink-0" />}
          <span className="font-medium text-gray-900">{a.title}</span>
        </div>
      ),
    },
    {
      key: "content",
      header: "内容",
      render: (a) => <span className="text-xs text-gray-500 truncate block max-w-xs">{a.content}</span>,
    },
    {
      key: "active",
      header: "状态",
      render: (a) => <Badge variant={a.active ? "success" : "default"}>{a.active ? "展示中" : "已下架"}</Badge>,
    },
    {
      key: "createdAt",
      header: "发布时间",
      render: (a) => <span className="text-xs text-gray-500">{formatDate(a.createdAt)}</span>,
    },
    {
      key: "actions",
      header: "操作",
      render: (a) => (
        <div className="flex gap-1">
          <button onClick={() => openEdit(a)} className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-blue-600" title="编辑">
            <HiPencil className="h-4 w-4" />
          </button>
          <button onClick={() => handleToggleActive(a)} className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-orange-600" title={a.active ? "下架" : "上架"}>
            {a.active ? <HiTrash className="h-4 w-4 rotate-90" /> : <HiPlus className="h-4 w-4" />}
          </button>
          <button onClick={() => handleDelete(a)} className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-600" title="删除">
            <HiTrash className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">公告管理</h1>
        <Button onClick={() => { resetForm(); setShowForm(true); }}>
          <HiPlus className="h-4 w-4 mr-1" />发布公告
        </Button>
      </div>

      {/* Create/Edit form */}
      {showForm && (
        <Card className="p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            {editing ? "编辑公告" : "发布新公告"}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="公告标题"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">内容</label>
              <textarea
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                placeholder="公告内容..."
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formPinned}
                onChange={(e) => setFormPinned(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-600">置顶公告</span>
            </label>
            <div className="flex gap-3">
              <Button onClick={handleSave} loading={saving}>保存</Button>
              <Button variant="ghost" onClick={resetForm}>取消</Button>
            </div>
          </div>
        </Card>
      )}

      <AdminTable
        columns={columns}
        data={announcements}
        keyExtractor={(a) => a.id}
        loading={loading}
        emptyState={{ title: "暂无公告", description: "点击「发布公告」添加第一条公告" }}
      />
    </div>
  );
}
