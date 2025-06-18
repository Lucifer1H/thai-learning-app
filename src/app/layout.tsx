import type { Metadata } from "next";
import { Inter, Noto_Sans_Thai, Noto_Sans_SC } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import { Providers } from '@/components/providers';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai"],
  variable: "--font-thai",
});

const notoSansChinese = Noto_Sans_SC({
  subsets: ["chinese-simplified"],
  variable: "--font-chinese",
});

export const metadata: Metadata = {
  title: "泰语学习 - Thai Language Learning for Chinese Speakers",
  description: "专为中文母语者设计的泰语学习平台 - Comprehensive Thai language learning platform designed specifically for Chinese speakers",
  keywords: "泰语学习, Thai language, 中文, Chinese, 语言学习, language learning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${inter.variable} ${notoSansThai.variable} ${notoSansChinese.variable}`}>
      <body className="antialiased bg-gray-50 text-gray-900">
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
