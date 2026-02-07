// lib/normalize.ts
// 분석 텍스트 정규화 유틸리티

/**
 * 객체/배열을 문자열로 안전하게 변환
 * DB에 저장된 분석 텍스트가 {1: "...", 2: "..."} 형태 객체일 수 있음
 */
export function normalizeText(val: unknown): string {
    if (val === null || val === undefined) return "";
    if (typeof val === "string") return val;
    if (typeof val === "number") return String(val);
    if (Array.isArray(val)) return val.map(v => normalizeText(v)).join(" ");
    if (typeof val === "object") {
        return Object.values(val).map(v => normalizeText(v)).join(" ");
    }
    return String(val);
}

/**
 * 객체를 문자열 배열로 안전하게 변환
 * keywords: {1: "a", 2: "b"} -> ["a", "b"]
 */
export function normalizeArray(val: unknown): string[] {
    if (!val) return [];
    if (Array.isArray(val)) return val.map(v => normalizeText(v));
    if (typeof val === "object") {
        return Object.values(val).map(v => normalizeText(v));
    }
    return [];
}
