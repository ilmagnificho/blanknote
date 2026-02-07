// next-seo.config.ts
// SEO 기본 설정

import type { Metadata } from "next";

const SITE_NAME = "Blanknote";
const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://blanknote.xyz";

export const seoConfig: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: "Blanknote - 당신의 빈칸에는 무엇이 숨어있나요?",
        template: "%s | Blanknote",
    },
    description:
        "AI가 분석하는 문장완성검사(SCT). 무의식 속 당신의 모습을 발견하세요. 빈칸을 채우고, 숨겨진 자아를 마주하세요.",
    keywords: [
        "심리테스트",
        "문장완성검사",
        "SCT",
        "무의식",
        "자아분석",
        "AI심리분석",
        "인간관계",
        "성격테스트",
        "MBTI대안",
    ],
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    openGraph: {
        title: "Blanknote - 당신의 빈칸에는 무엇이 숨어있나요?",
        description:
            "AI가 분석하는 문장완성검사(SCT). 무의식 속 당신의 모습을 발견하세요.",
        url: SITE_URL,
        siteName: SITE_NAME,
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "Blanknote - AI 심리 분석",
            },
        ],
        locale: "ko_KR",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Blanknote - 당신의 빈칸에는 무엇이 숨어있나요?",
        description:
            "AI가 분석하는 문장완성검사(SCT). 무의식 속 당신의 모습을 발견하세요.",
        images: ["/og-image.png"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon-16x16.png",
        apple: "/apple-touch-icon.png",
    },
};

export default seoConfig;
