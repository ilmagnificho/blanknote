// middleware.ts
// Next.js Middleware - API Rate Limiting

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * API 라우트 보호 Middleware
 * Rate Limiting은 Server Actions 내에서 처리하므로
 * 여기서는 기본적인 보안 헤더만 추가
 */
export function middleware(request: NextRequest) {
    const response = NextResponse.next();

    // 보안 헤더 추가
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-XSS-Protection", "1; mode=block");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

    return response;
}

// API 라우트에만 적용
export const config = {
    matcher: ["/api/:path*"],
};
