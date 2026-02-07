// components/common/analytics.tsx
// Google Analytics 4 컴포넌트

"use client";

import Script from "next/script";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

/**
 * Google Analytics 4 스크립트 컴포넌트
 */
export function Analytics() {
    if (!GA_MEASUREMENT_ID) return null;

    return (
        <>
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
                strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
            </Script>
        </>
    );
}

/**
 * 이벤트 트래킹 헬퍼 함수
 */
export function trackEvent(
    action: string,
    category: string,
    label?: string,
    value?: number
) {
    if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", action, {
            event_category: category,
            event_label: label,
            value: value,
        });
    }
}

// 주요 이벤트 트래킹 함수들
export const analytics = {
    // 테스트 시작
    testStart: () => trackEvent("test_start", "engagement"),

    // 테스트 완료
    testComplete: () => trackEvent("test_complete", "engagement"),

    // 결과 조회
    resultView: () => trackEvent("result_view", "engagement"),

    // 공유 버튼 클릭
    share: (platform: string) => trackEvent("share", "social", platform),

    // 결제 버튼 클릭
    paymentClick: () => trackEvent("payment_click", "monetization"),

    // 결제 완료
    paymentComplete: () => trackEvent("payment_complete", "monetization", undefined, 2500),
};
