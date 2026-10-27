import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// metadata라는 이름으로 export하면 Next.js가 <head> 안에 태그를 자동 생성
export const metadata: Metadata = {
  title: "Crafboard", // <title>Crafboard</title> → 브라우저 탭에 표시
  description: "Task management dashboard", // <meta name="description"> → 검색 결과·링크 미리보기에 사용
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full">{children}</body>
    </html>
  );
}
