// app/opengraph-image.tsx
// 동적 OG 이미지 생성

import { ImageResponse } from "next/og";

// export const runtime = "edge"; // 호환성 문제로 기본 런타임 사용

export const alt = "Blanknote - AI 심리 분석";
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = "image/png";

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#000",
                    backgroundImage:
                        "radial-gradient(circle at 50% 50%, #1a0a2e 0%, #000 70%)",
                }}
            >
                {/* 로고 */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: 40,
                    }}
                >
                    <span
                        style={{
                            fontSize: 72,
                            fontWeight: 300,
                            color: "#666",
                            letterSpacing: "0.2em",
                        }}
                    >
                        Blanknote
                    </span>
                    <span
                        style={{
                            fontSize: 72,
                            fontWeight: 700,
                            color: "#fff",
                        }}
                    >
                        _
                    </span>
                </div>

                {/* 메인 타이틀 */}
                <div
                    style={{
                        display: "flex",
                        fontSize: 48,
                        fontWeight: 700,
                        color: "#fff",
                        textAlign: "center",
                        marginBottom: 24,
                    }}
                >
                    당신의 빈칸에는 무엇이 숨어있나요?
                </div>

                {/* 서브타이틀 */}
                <div
                    style={{
                        display: "flex",
                        fontSize: 28,
                        color: "#888",
                        textAlign: "center",
                    }}
                >
                    AI가 분석하는 문장완성검사 | 무의식 심리 분석
                </div>

                {/* 그라데이션 강조선 */}
                <div
                    style={{
                        display: "flex",
                        width: 200,
                        height: 4,
                        marginTop: 40,
                        background: "linear-gradient(90deg, #a855f7, #ec4899)",
                        borderRadius: 2,
                    }}
                />
            </div>
        ),
        {
            ...size,
        }
    );
}
