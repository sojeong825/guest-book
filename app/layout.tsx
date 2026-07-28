import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// KERIS 케듀체 (Figma 제목용) — 프로젝트에 포함해 self-host
const kerisKedu = localFont({
  src: "./fonts/KerisKedu-Bold.otf",
  variable: "--font-keris",
  weight: "700",
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
    <html lang="ko" className={kerisKedu.variable}>
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
