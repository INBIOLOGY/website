import type { Metadata } from "next";
import { CartProvider } from "@/components/cart-provider";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: "INBIOLOGY Academy",
  description: "เรียนชีวะให้เข้าใจ ไม่ใช่แค่จำ",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="th"><body><CartProvider><SiteHeader />{children}</CartProvider></body></html>;
}
