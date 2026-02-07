// lib/i18n/translations.ts
// 다국어 지원 - 한국어/영어

export type Locale = "ko" | "en";

export const translations = {
    ko: {
        // 랜딩 페이지
        landing: {
            title: "당신의 빈칸에는 무엇이 숨어있나요?",
            cta: "검사 시작하기",
        },
        // 테스트 페이지
        test: {
            question: "질문",
            placeholder: "여기에 입력하세요...",
            minChars: "2자 이상 입력해주세요",
            nextHint: "Enter를 눌러 다음으로",
            prev: "이전",
            next: "다음",
            analyze: "분석하기",
        },
        // 로딩
        loading: {
            messages: [
                "무의식의 문을 두드리는 중...",
                "숨겨진 자아를 깨우는 중...",
                "심층 심리를 분석하는 중...",
                "무의식의 풍경을 그리는 중...",
                "거의 다 왔습니다...",
            ],
        },
        // 결과 페이지
        result: {
            title: "분석 결과",
            subtitle: "당신의 무의식이 말하고 있습니다",
            locked: "당신의 무의식 풍경",
            unlockHint: "잠금 해제하여 확인하세요",
            paidContent: "상세 분석은 유료 콘텐츠입니다",
            unlockButton: "🔓 잠금 해제하기",
            unlockDesc: "상세 분석 + 무의식 이미지 확인",
            share: "공유하기",
            shareTwitter: "𝕏 트위터에 공유",
            restart: "처음부터 다시하기",
            copied: "✓ 복사됨!",
            selfImage: "자아 이미지",
            relationships: "대인관계 패턴",
            trauma: "숨겨진 상처",
            summary: "종합 분석",
        },
        // 에러
        error: {
            title: "무의식 접속 실패",
            retry: "다시 시도하기",
            quota: "무의식 탐색 에너지가 부족합니다. 관리자에게 문의해주세요.",
            rateLimit: "AI가 바빠요. 잠시 후 다시 시도해주세요.",
            generic: "무의식 접속에 실패했습니다. 잠시 후 다시 시도해주세요.",
        },
        // SCT 문항
        questions: [
            { id: 1, prompt: "나는 가끔..." },
            { id: 2, prompt: "내가 가장 두려운 것은..." },
            { id: 3, prompt: "다른 사람들이 나를 보면..." },
            { id: 4, prompt: "내가 진정으로 원하는 것은..." },
            { id: 5, prompt: "나의 가장 큰 약점은..." },
        ],
    },
    en: {
        // Landing page
        landing: {
            title: "What's hidden in your blanks?",
            cta: "Start Test",
        },
        // Test page
        test: {
            question: "Question",
            placeholder: "Type here...",
            minChars: "Please enter at least 2 characters",
            nextHint: "Press Enter to continue",
            prev: "Back",
            next: "Next",
            analyze: "Analyze",
        },
        // Loading
        loading: {
            messages: [
                "Knocking on the door of your unconscious...",
                "Awakening the hidden self...",
                "Analyzing deep psychology...",
                "Drawing the landscape of your unconscious...",
                "Almost there...",
            ],
        },
        // Result page
        result: {
            title: "Analysis Result",
            subtitle: "Your unconscious is speaking",
            locked: "Your Unconscious Landscape",
            unlockHint: "Unlock to view",
            paidContent: "Detailed analysis is premium content",
            unlockButton: "🔓 Unlock Now",
            unlockDesc: "Full analysis + Unconscious image",
            share: "Share",
            shareTwitter: "Share on 𝕏",
            restart: "Start over",
            copied: "✓ Copied!",
            selfImage: "Self Image",
            relationships: "Relationship Patterns",
            trauma: "Hidden Wounds",
            summary: "Summary Analysis",
        },
        // Errors
        error: {
            title: "Connection Failed",
            retry: "Try Again",
            quota: "Analysis energy depleted. Please contact support.",
            rateLimit: "AI is busy. Please try again later.",
            generic: "Connection failed. Please try again.",
        },
        // SCT Questions
        questions: [
            { id: 1, prompt: "Sometimes I..." },
            { id: 2, prompt: "What I fear most is..." },
            { id: 3, prompt: "When others see me, they..." },
            { id: 4, prompt: "What I truly want is..." },
            { id: 5, prompt: "My biggest weakness is..." },
        ],
    },
} as const;

// 현재 로케일 감지
export function detectLocale(): Locale {
    if (typeof window === "undefined") return "ko";

    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith("ko")) return "ko";
    return "en";
}

// 번역 가져오기
export function getTranslation(locale: Locale) {
    return translations[locale];
}
