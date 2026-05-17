import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4", "video/webm"];

export async function uploadFile(file: File, type: "product" | "avatar" = "product"): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("不支持的文件类型");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("文件大小超过20MB限制");
  }

  const subDir = type === "avatar" ? "avatars" : "products";
  const uploadDir = join(process.cwd(), "public", "uploads", subDir);
  await mkdir(uploadDir, { recursive: true });

  const ext = file.name.split(".").pop() || "jpg";
  const filename = `${uuidv4()}.${ext}`;
  const filepath = join(uploadDir, filename);

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  await writeFile(filepath, buffer);

  return `/uploads/${subDir}/${filename}`;
}
