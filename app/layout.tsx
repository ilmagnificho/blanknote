import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { seoConfig } from "@/next-seo.config";
import { Analytics } from "@/components/common/analytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// SEO 메타데이터 적용
export const metadata: Metadata = seoConfig;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}

        {/* Footer & Disclaimer */}
        <footer className="py-8 px-6 text-center border-t border-zinc-900 mt-auto">
          <p className="text-zinc-600 text-xs mb-2">
            © 2024 Blanknote. All rights reserved.
          </p>
          <p className="text-zinc-700 text-[10px] leading-relaxed max-w-2xl mx-auto">
            본 서비스에서 제공하는 심리 분석 결과는 AI를 기반으로 생성된 참고용 자료입니다.
            전문적인 의학적 진단이나 상담을 대체할 수 없으며,
            심각한 심리적 고통이나 정신 건강 문제가 있는 경우 반드시 전문가와 상담하시기 바랍니다.
          </p>
        </footer>

        <Analytics />
      </body>
    </html>
  );
}
