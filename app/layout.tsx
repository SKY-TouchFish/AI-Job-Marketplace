import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Job Marketplace",
  description: "Minimal Supabase authentication scaffold with Next.js App Router."
};

// 为 App Router 下的所有页面提供共享文档结构。
// Provide the shared document structure for all App Router pages.
export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
