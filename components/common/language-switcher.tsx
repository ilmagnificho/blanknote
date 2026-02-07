// components/common/language-switcher.tsx
// 언어 전환 버튼

"use client";

import { useLocaleStore } from "@/store/locale-store";
import type { Locale } from "@/lib/i18n/translations";

/**
 * 언어 전환 버튼 (KO/EN)
 */
export function LanguageSwitcher() {
    const { locale, setLocale } = useLocaleStore();

    const toggleLocale = () => {
        const newLocale: Locale = locale === "ko" ? "en" : "ko";
        setLocale(newLocale);
    };

    return (
        <button
            onClick={toggleLocale}
            className="fixed top-4 right-4 z-50 px-3 py-1.5 text-sm
                 bg-zinc-900 border border-zinc-700 rounded-full
                 text-zinc-400 hover:text-white hover:border-zinc-500
                 transition-colors"
            aria-label="Toggle language"
        >
            {locale === "ko" ? "EN" : "한국어"}
        </button>
    );
}
