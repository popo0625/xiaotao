import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().min(6, "密码至少6个字符"),
});

export const registerSchema = z.object({
  email: z.string().email("请输入有效的邮箱地址").refine((v) => v.endsWith("@qq.com"), "仅支持 QQ 邮箱注册"),
  verificationCode: z.string().regex(/^\d{6}$/, "验证码为6位数字"),
  password: z.string().min(6, "密码至少6个字符"),
  confirmPassword: z.string(),
  name: z.string().min(2, "用户名至少2个字符").max(20, "用户名最多20个字符").optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "两次密码不一致",
  path: ["confirmPassword"],
});

export const productSchema = z.object({
  title: z.string().min(2, "标题至少2个字符").max(100, "标题最多100个字符"),
  description: z.string().max(2000, "描述最多2000个字符").optional(),
  categoryId: z.number("请选择分类"),
  price: z.number("请输入价格").positive("价格必须为正数"),
  originalPrice: z.number("请输入原价").positive().optional(),
  grade: z.enum(["全新", "几乎全新", "良好", "一般", "有瑕疵"]),
  brand: z.string().optional(),
  isShippingIncluded: z.boolean().default(false),
  shippingLocation: z.string().optional(),
  sellerType: z.string().optional(),
  images: z.array(z.object({
    url: z.string(),
    sortOrder: z.number().default(0),
    type: z.string().default("image"),
  })).min(1, "至少上传一张图片").max(9, "最多上传9张图片"),
  accessories: z.array(z.object({
    accessoryId: z.number(),
    isIncluded: z.boolean().default(true),
    description: z.string().optional(),
  })).optional(),
  flaws: z.array(z.object({
    description: z.string(),
    severity: z.string().default("minor"),
    imageUrl: z.string().optional(),
  })).optional(),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, "用户名至少2个字符").max(20, "用户名最多20个字符").optional(),
  bio: z.string().max(200, "简介最多200个字符").optional(),
  campus: z.string().refine((v) => ["花江校区", "金鸡岭校区", "北海校区"].includes(v), { message: "请选择校区" }),
  location: z.string().min(1, "请填写宿舍楼").max(50, "宿舍楼最多50个字符"),
  avatar: z.string().optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "请输入当前密码"),
  newPassword: z.string().min(6, "新密码至少6个字符"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "两次密码不一致",
  path: ["confirmPassword"],
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
