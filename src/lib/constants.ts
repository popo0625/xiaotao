export const CATEGORIES = [
  { id: 1, name: "textbook", displayName: "教材教辅", icon: "📚", sortOrder: 1 },
  { id: 2, name: "electronics", displayName: "数码产品", icon: "📱", sortOrder: 2 },
  { id: 3, name: "daily", displayName: "生活日用", icon: "🧴", sortOrder: 3 },
  { id: 4, name: "clothing", displayName: "服饰鞋包", icon: "👕", sortOrder: 4 },
  { id: 5, name: "sports", displayName: "运动户外", icon: "⚽", sortOrder: 5 },
  { id: 6, name: "other", displayName: "其他闲置", icon: "📦", sortOrder: 6 },
];

export const GRADES = [
  { value: "全新", label: "全新", color: "green", description: "全新未使用，原包装完好" },
  { value: "几乎全新", label: "几乎全新", color: "blue", description: "使用过一两次，无明显痕迹" },
  { value: "良好", label: "良好", color: "cyan", description: "正常使用痕迹，功能完好" },
  { value: "一般", label: "一般", color: "yellow", description: "较多使用痕迹，不影响功能" },
  { value: "有瑕疵", label: "有瑕疵", color: "red", description: "有明显损坏或功能缺陷" },
];

export const ACCESSORY_ITEMS = [
  { id: 1, name: "包装盒", isRequired: false, sortOrder: 1 },
  { id: 2, name: "充电器", isRequired: false, sortOrder: 2 },
  { id: 3, name: "数据线", isRequired: false, sortOrder: 3 },
  { id: 4, name: "说明书", isRequired: false, sortOrder: 4 },
  { id: 5, name: "保修卡/发票", isRequired: false, sortOrder: 5 },
  { id: 6, name: "原装配件", isRequired: false, sortOrder: 6 },
];

export const GRADES_ENUM = ["全新", "几乎全新", "良好", "一般", "有瑕疵"] as const;

export const TRANSACTION_STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: "待付款",
  PAID: "已付款",
  SHIPPED: "已发货",
  RECEIVED: "已收货",
  COMPLETED: "已完成",
  CANCELLED: "已取消",
  DISPUTED: "纠纷中",
};
