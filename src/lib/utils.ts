import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(price: number): string {
  return `¥${price.toFixed(2)}`;
}

export function formatDateFull(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (hours < 1) return "刚刚";
  if (hours < 24) return `${hours}小时前`;
  if (days < 30) return `${days}天前`;
  if (days < 365) {
    const months = Math.floor(days / 30);
    return `${months}个月前`;
  }
  return d.toLocaleDateString("zh-CN");
}

const randomNames = [
  "淘淘", "校园君", "闲置达人", "桂花学子", "易物小能手",
  "绿色先锋", "物尽其用", "桂电小淘", "宿舍小当家", "二手宝藏",
  "北极星", "小太阳", "清风", "暖阳", "星河", "追梦人", "晨曦",
  "邻家学长", "学姐推荐", "物语者", "简约派", "校园风",
];

const randomAnimals = [
  "猫", "狗", "兔", "熊", "鹿", "松鼠", "熊猫", "海豚", "企鹅", "狐狸",
  "考拉", "小鹰", "仓鼠", "刺猬", "浣熊",
];

export function generateRandomName(): string {
  const base = randomNames[Math.floor(Math.random() * randomNames.length)];
  const animal = randomAnimals[Math.floor(Math.random() * randomAnimals.length)];
  // 50% chance to append an animal suffix
  if (Math.random() > 0.5) {
    return `${base}${animal}`;
  }
  return base;
}

export function generateRandomAvatar(name: string): string {
  // Use DiceBear thumbs avatar style seeded by name
  return `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(name)}&backgroundColor=ffdfbf,c0aede,d1d4f9`;
}

export function generateSearchText(
  title: string,
  brand?: string | null,
  description?: string | null
): string {
  return [title, brand, description]
    .filter(Boolean)
    .join(" ");
}
