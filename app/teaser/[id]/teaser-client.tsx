// app/teaser/[id]/teaser-client.tsx
// 티저 결과 클라이언트 컴포넌트

"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Result, IntroAnalysisResult } from "@/types";
import { useTestStore } from "@/store/test-store";

interface TeaserClientProps {
    result: Result;
}

export function TeaserClient({ result }: TeaserClientProps) {
    const router = useRouter();
    const { startDeepPhase } = useTestStore();
    const analysis = result.intro_analysis as IntroAnalysisResult;

    const handleStartDeep = () => {
        // Deep 테스트 시작
        startDeepPhase();
        router.push(`/test/deep?resultId=${result.id}`);
    };

    return (
        <div className="min-h-screen bg-black py-12 px-6">
            {/* 로고 */}
            <div className="text-center mb-8">
                <Link href="/" className="text-xl font-mono tracking-widest text-zinc-600">
                    Blanknote<span className="text-white">_</span>
                </Link>
            </div>

            {/* 헤더 */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
            >
                <h2 className="text-2xl md:text-3xl font-medium text-white mb-2">
                    당신의 무의식이 말합니다
                </h2>
                <p className="text-zinc-500">5개의 답변으로 발견한 초기 인사이트</p>
            </motion.div>

            {/* 유형 라벨 */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-8"
            >
                <span className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full">
                    <span className="text-xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                        {analysis?.typeLabel || "분석 중..."}
                    </span>
                </span>
            </motion.div>

            {/* 키워드 태그 */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap justify-center gap-3 mb-8"
            >
                {analysis?.keywords.map((keyword, i) => (
                    <span
                        key={i}
                        className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-full text-zinc-300 text-sm"
                    >
                        {keyword}
                    </span>
                ))}
            </motion.div>

            {/* 한 줄 분석 */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="max-w-lg mx-auto mb-8"
            >
                <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl text-center">
                    <p className="text-lg md:text-xl text-white font-medium leading-relaxed">
                        &ldquo;{analysis?.oneLiner}&rdquo;
                    </p>
                </div>
            </motion.div>

            {/* 티저 - 블러 처리된 상세 분석 미리보기 */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="max-w-lg mx-auto mb-10"
            >
                <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden relative">
                    {/* 블러된 가짜 분석 내용 */}
                    <div className="blur-md pointer-events-none select-none space-y-4">
                        <div>
                            <h3 className="text-sm text-zinc-500 mb-2">자아 이미지</h3>
                            <p className="text-zinc-400">
                                당신의 답변에서 발견된 자아상은 완벽주의적 경향과
                                숨겨진 불안감 사이의 긴장을 보여줍니다...
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm text-zinc-500 mb-2">대인관계 패턴</h3>
                            <p className="text-zinc-400">
                                관계에서 보이는 방어적 태도는 과거의 경험에서
                                형성된 보호 메커니즘으로 해석됩니다...
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm text-zinc-500 mb-2">숨겨진 상처</h3>
                            <p className="text-zinc-400">
                                표면 아래에 억압된 감정들이 존재하며, 이는 특정
                                상황에서 예상치 못한 반응으로 나타날 수 있습니다...
                            </p>
                        </div>
                    </div>

                    {/* 잠금 오버레이 */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                        <span className="text-4xl mb-3">🔒</span>
                        <p className="text-white font-medium mb-1">심층 분석 잠금</p>
                        <p className="text-zinc-400 text-sm text-center px-4">
                            {analysis?.teaser || "더 깊은 분석을 위해 추가 질문에 답해주세요"}
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* CTA - 심층 분석 시작 */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="text-center space-y-4"
            >
                <button
                    onClick={handleStartDeep}
                    className="w-full max-w-xs mx-auto block px-8 py-4 
                        bg-gradient-to-r from-purple-500 to-pink-500 
                        text-white font-medium rounded-full
                        hover:opacity-90 transition-opacity"
                >
                    🔓 심층 분석 시작하기
                </button>
                <p className="text-zinc-600 text-sm">
                    7개의 추가 질문 • 약 3분 소요
                </p>
            </motion.div>

            {/* 공유 옵션 */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="text-center mt-12"
            >
                <p className="text-zinc-600 text-sm mb-4">초기 결과 공유하기</p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(
                                `나의 무의식 유형: ${analysis?.typeLabel}\n"${analysis?.oneLiner}"\n\n👉 blanknote.app`
                            );
                            alert("복사되었습니다!");
                        }}
                        className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-full text-zinc-300 text-sm transition-colors"
                    >
                        📋 링크 복사
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
