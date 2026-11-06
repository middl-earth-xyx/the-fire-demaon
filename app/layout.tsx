import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Fire Daemon",
  description: "用 JEF 為邊緣閘道與韌體報告分級。分數到了，處置仍留給人。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
