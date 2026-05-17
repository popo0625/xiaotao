import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { join } from "path";

const dbPath = join(process.cwd(), "prisma", "dev.db");
const adapter = new PrismaLibSql({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

const CATEGORIES = [
  { id: 1, name: "textbook", displayName: "教材教辅", icon: "📚", sortOrder: 1 },
  { id: 2, name: "electronics", displayName: "数码产品", icon: "📱", sortOrder: 2 },
  { id: 3, name: "daily", displayName: "生活日用", icon: "🧴", sortOrder: 3 },
  { id: 4, name: "clothing", displayName: "服饰鞋包", icon: "👕", sortOrder: 4 },
  { id: 5, name: "sports", displayName: "运动户外", icon: "⚽", sortOrder: 5 },
  { id: 6, name: "other", displayName: "其他闲置", icon: "📦", sortOrder: 6 },
];

const ACCESSORY_ITEMS = [
  { id: 1, name: "包装盒", isRequired: false, sortOrder: 1 },
  { id: 2, name: "充电器", isRequired: false, sortOrder: 2 },
  { id: 3, name: "数据线", isRequired: false, sortOrder: 3 },
  { id: 4, name: "说明书", isRequired: false, sortOrder: 4 },
  { id: 5, name: "保修卡/发票", isRequired: false, sortOrder: 5 },
  { id: 6, name: "原装配件", isRequired: false, sortOrder: 6 },
];

async function main() {
  console.log("Seeding database...");

  for (const cat of CATEGORIES) {
    await prisma.productCategory.upsert({
      where: { id: cat.id },
      update: { displayName: cat.displayName, icon: cat.icon, sortOrder: cat.sortOrder },
      create: {
        id: cat.id,
        name: cat.name,
        displayName: cat.displayName,
        icon: cat.icon,
        sortOrder: cat.sortOrder,
      },
    });
  }
  console.log("Categories seeded.");

  for (const item of ACCESSORY_ITEMS) {
    await prisma.accessoryItem.upsert({
      where: { id: item.id },
      update: { name: item.name, isRequired: item.isRequired, sortOrder: item.sortOrder },
      create: {
        id: item.id,
        name: item.name,
        isRequired: item.isRequired,
        sortOrder: item.sortOrder,
      },
    });
  }
  console.log("Accessory items seeded.");

  const adminExists = await prisma.user.findFirst({ where: { email: "admin@xiaotao.guet" } });
  if (!adminExists) {
    const bcrypt = await import("bcryptjs");
    const hash = await bcrypt.hash("admin123", 10);
    await prisma.user.create({
      data: {
        name: "管理员",
        email: "admin@xiaotao.guet",
        phone: "13800000000",
        passwordHash: hash,
        role: "ADMIN",
        creditScore: 100,
        isVerified: true,
      },
    });
    console.log("Admin user seeded.");
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
