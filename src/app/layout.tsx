import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DisclaimerModal } from "@/components/DisclaimerModal";

export const metadata: Metadata = {
  title: "校淘 - 桂电二手交易平台",
  description: "校淘是桂林电子科技大学的校园二手交易平台，专注教材、数码、生活用品等闲置交易，安全靠谱的桂电校内跳蚤市场。",
};

export const viewport: Viewport = {
  width: 1280,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-gray-50">
        <Providers>
          <Navbar />
          <DisclaimerModal />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
