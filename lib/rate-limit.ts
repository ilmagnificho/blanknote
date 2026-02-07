// lib/rate-limit.ts
// IP 기반 Rate Limiting 유틸리티

/**
 * 간단한 인메모리 Rate Limiter
 * 프로덕션에서는 Redis/Upstash를 권장
 */

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

// 인메모리 저장소 (서버 재시작 시 초기화됨)
const rateLimitStore = new Map<string, RateLimitEntry>();

// 설정
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1분
const RATE_LIMIT_MAX_REQUESTS = 5; // 분당 5회

/**
 * Rate Limit 체크
 * @param identifier - IP 주소 또는 고유 식별자
 * @returns 허용 여부 및 남은 요청 수
 */
export function checkRateLimit(identifier: string): {
    allowed: boolean;
    remaining: number;
    resetInSeconds: number;
} {
    const now = Date.now();
    const entry = rateLimitStore.get(identifier);

    // 새 사용자이거나 리셋 시간이 지난 경우
    if (!entry || now > entry.resetTime) {
        rateLimitStore.set(identifier, {
            count: 1,
            resetTime: now + RATE_LIMIT_WINDOW_MS,
        });
        return {
            allowed: true,
            remaining: RATE_LIMIT_MAX_REQUESTS - 1,
            resetInSeconds: Math.ceil(RATE_LIMIT_WINDOW_MS / 1000),
        };
    }

    // 제한 초과
    if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
        const resetInSeconds = Math.ceil((entry.resetTime - now) / 1000);
        return {
            allowed: false,
            remaining: 0,
            resetInSeconds,
        };
    }

    // 요청 카운트 증가
    entry.count++;
    rateLimitStore.set(identifier, entry);

    return {
        allowed: true,
        remaining: RATE_LIMIT_MAX_REQUESTS - entry.count,
        resetInSeconds: Math.ceil((entry.resetTime - now) / 1000),
    };
}

/**
 * 클라이언트 IP 추출 헬퍼
 * Vercel/Cloudflare 등 프록시 환경 고려
 */
export function getClientIP(headers: Headers): string {
    // Vercel
    const forwardedFor = headers.get("x-forwarded-for");
    if (forwardedFor) {
        return forwardedFor.split(",")[0].trim();
    }

    // Cloudflare
    const cfConnectingIP = headers.get("cf-connecting-ip");
    if (cfConnectingIP) {
        return cfConnectingIP;
    }

    // 기본값
    return "unknown";
}

// 오래된 엔트리 정리 (메모리 관리)
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
        if (now > entry.resetTime + RATE_LIMIT_WINDOW_MS) {
            rateLimitStore.delete(key);
        }
    }
}, RATE_LIMIT_WINDOW_MS);
