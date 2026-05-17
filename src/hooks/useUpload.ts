import { useState } from "react";

export function useUpload() {
  const [uploading, setUploading] = useState(false);

  const upload = async (file: File): Promise<string | null> => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "上传失败");
      }

      const data = await res.json();
      return data.url;
    } catch (e) {
      console.error("Upload error:", e);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploading };
}
