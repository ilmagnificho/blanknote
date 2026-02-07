// store/locale-store.ts
// 다국어 상태 관리

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Locale } from "@/lib/i18n/translations";

interface LocaleState {
    locale: Locale;
    setLocale: (locale: Locale) => void;
}

export const useLocaleStore = create<LocaleState>()(
    persist(
        (set) => ({
            locale: "ko",
            setLocale: (locale) => set({ locale }),
        }),
        {
            name: "blanknote-locale",
        }
    )
);
