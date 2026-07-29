import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// 원모바일 POP체 (제목용) — 프로젝트에 포함해 self-host
const titleFont = localFont({
  src: "./fonts/ONEMobilePOP.ttf",
  variable: "--font-title",
  display: "swap",
});

export const metadata: Metadata = {
  title: "생일 방명록",
  description: "생일을 축하해 주세요 💌",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={titleFont.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
