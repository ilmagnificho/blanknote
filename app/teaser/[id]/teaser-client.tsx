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
                className="text-center mb-12"
            >
                <h2 className="text-2xl md:text-3xl font-medium text-white mb-3">
                    무의식의 첫 번째 신호
                </h2>
                <p className="text-zinc-500 font-light">
                    내면 깊은 곳에서 희미한 신호가 잡혔습니다.
                </p>
            </motion.div>

            {/* 유형 라벨 */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-10"
            >
                <div className="inline-block relative">
                    <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full"></div>
                    <span className="relative inline-block px-8 py-4 bg-zinc-900/80 border border-purple-500/30 rounded-full backdrop-blur-sm">
                        <span className="text-2xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 animate-pulse">
                            {analysis?.typeLabel || "신호 분석 중..."}
                        </span>
                    </span>
                </div>
            </motion.div>

            {/* 키워드 태그 */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap justify-center gap-3 mb-12"
            >
                {analysis?.keywords.map((keyword, i) => (
                    <span
                        key={i}
                        className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-full text-zinc-400 text-sm font-light tracking-wide"
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
                className="max-w-lg mx-auto mb-16"
            >
                <div className="p-8 bg-zinc-900/30 border border-zinc-800 rounded-2xl text-center relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-purple-500/50 to-transparent opacity-50"></div>
                    <p className="text-xl md:text-2xl text-zinc-200 font-serif leading-relaxed italic">
                        &ldquo;{analysis?.oneLiner}&rdquo;
                    </p>
                </div>
            </motion.div>

            {/* 티저 - 블러 처리된 상세 분석 미리보기 */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="max-w-lg mx-auto mb-12"
            >
                <div className="relative p-1 rounded-2xl bg-gradient-to-b from-zinc-800 to-transparent">
                    <div className="p-6 bg-black rounded-xl overflow-hidden relative">
                        {/* 블러된 가짜 분석 내용 */}
                        <div className="blur-sm opacity-50 pointer-events-none select-none space-y-6">
                            <div>
                                <h3 className="text-sm text-purple-400/50 mb-2">자아 이미지</h3>
                                <p className="text-zinc-600 leading-relaxed">
                                    당신이 인지하지 못했던 내면의 거울에는...
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm text-purple-400/50 mb-2">숨겨진 상처</h3>
                                <p className="text-zinc-600 leading-relaxed">
                                    오랜 시간 덮어두었던 기억의 조각들이...
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm text-purple-400/50 mb-2">진정한 욕구</h3>
                                <p className="text-zinc-600 leading-relaxed">
                                    당신이 진정으로 갈망하고 있는 것은 사실...
                                </p>
                            </div>
                        </div>

                        {/* 잠금 오버레이 */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[2px]">
                            <span className="text-4xl mb-4 drop-shadow-lg">🔒</span>
                            <p className="text-white font-medium mb-2 text-lg">심연의 문이 닫혀있습니다</p>
                            <p className="text-zinc-400 text-sm text-center px-6 leading-relaxed">
                                {analysis?.teaser || "이곳에는 당신조차 몰랐던 진실이 숨겨져 있습니다."}
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* CTA - 심층 분석 시작 */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="text-center space-y-6"
            >
                <div className="relative group cursor-pointer" onClick={handleStartDeep}>
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
                    <button
                        className="relative w-full max-w-xs mx-auto block px-8 py-5 
                            bg-zinc-900 ring-1 ring-white/10
                            text-white font-medium rounded-full
                            group-hover:bg-zinc-800 transition-all text-lg tracking-wide"
                    >
                        🗝️ 더 깊은 진실 마주하기
                    </button>
                </div>
                <p className="text-zinc-500 text-xs tracking-widest uppercase">
                    7 Questions • Deep Analysis
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
