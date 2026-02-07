// lib/normalize.ts
// 분석 텍스트 정규화 유틸리티

/**
 * 객체/배열을 문자열로 안전하게 변환
 * DB에 저장된 분석 텍스트가 {1: "...", 2: "..."} 형태 객체일 수 있음
 * 항상 string만 반환 (null/undefined/object 절대 불가)
 */
export function normalizeText(val: unknown): string {
    if (val == null) return "";
    if (typeof val === "string") return val;
    if (typeof val === "number" || typeof val === "boolean") return String(val);
    if (Array.isArray(val)) {
        return val.map(normalizeText).filter(Boolean).join(", ");
    }
    if (typeof val === "object") {
        try {
            return Object.values(val).map(normalizeText).filter(Boolean).join(" ");
        } catch {
            // 안전장치: JSON으로 변환 시도
            try {
                return JSON.stringify(val);
            } catch {
                return "";
            }
        }
    }
    return String(val);
}

/**
 * 객체를 문자열 배열로 안전하게 변환
 * keywords: {1: "a", 2: "b"} -> ["a", "b"]
 * 항상 string[]만 반환 (빈 배열 보장)
 */
export function normalizeArray(val: unknown): string[] {
    if (val == null) return [];
    if (Array.isArray(val)) {
        return val.map(normalizeText).filter(Boolean);
    }
    if (typeof val === "object") {
        try {
            return Object.values(val as Record<string, unknown>).map(normalizeText).filter(Boolean);
        } catch {
            return [];
        }
    }
    // 단일 값이면 배열로 감싸서 반환
    const single = normalizeText(val);
    return single ? [single] : [];
}
