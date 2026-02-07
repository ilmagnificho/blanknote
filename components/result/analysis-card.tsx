// components/result/analysis-card.tsx
// 분석 결과 카드 컴포넌트

"use client";

import { motion } from "framer-motion";
import type { AnalysisResult } from "@/types";
import { normalizeText } from "@/lib/normalize";

interface AnalysisCardProps {
    analysis: AnalysisResult;
    imageUrl: string | null;
    isPaid: boolean;
}

/**
 * 분석 결과 카드
 * 무료: 한 줄 분석만 표시
 * 유료: 상세 분석 + 이미지 표시
 */
export function AnalysisCard({ analysis, imageUrl, isPaid }: AnalysisCardProps) {
    // 분석 데이터 정규화 (객체 형태 방지)
    const oneLiner = normalizeText(analysis?.oneLiner);
    const selfImage = normalizeText(analysis?.deepAnalysis?.selfImage);
    const relationships = normalizeText(analysis?.deepAnalysis?.relationships);
    const trauma = normalizeText(analysis?.deepAnalysis?.trauma);
    const summary = normalizeText(analysis?.deepAnalysis?.summary);

    return (
        <div className="w-full max-w-lg mx-auto space-y-6">
            {/* 한 줄 분석 (팩트 폭력) - 무료 */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl"
            >
                <p className="text-lg md:text-xl text-white font-medium leading-relaxed text-center">
                    &ldquo;{oneLiner}&rdquo;
                </p>
            </motion.div>

            {/* 무의식 이미지 */}
            {imageUrl && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="relative rounded-2xl overflow-hidden"
                >
                    <img
                        src={imageUrl}
                        alt="무의식의 풍경"
                        className={`w-full h-auto ${!isPaid ? "blur-xl" : ""}`}
                    />

                    {/* 유료 잠금 오버레이 */}
                    {!isPaid && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
                            <span className="text-4xl mb-4">🔒</span>
                            <p className="text-white font-medium mb-2">당신의 무의식 풍경</p>
                            <p className="text-zinc-400 text-sm">잠금 해제하여 확인하세요</p>
                        </div>
                    )}
                </motion.div>
            )}

            {/* 상세 분석 - 유료 */}
            {isPaid ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-6"
                >
                    <div>
                        <h3 className="text-sm text-zinc-500 mb-2">자아 이미지</h3>
                        <p className="text-zinc-300">{selfImage}</p>
                    </div>
                    <div>
                        <h3 className="text-sm text-zinc-500 mb-2">대인관계 패턴</h3>
                        <p className="text-zinc-300">{relationships}</p>
                    </div>
                    <div>
                        <h3 className="text-sm text-zinc-500 mb-2">숨겨진 상처</h3>
                        <p className="text-zinc-300">{trauma}</p>
                    </div>
                    <div className="pt-4 border-t border-zinc-800">
                        <h3 className="text-sm text-zinc-500 mb-2">종합 분석</h3>
                        <p className="text-white">{summary}</p>
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl"
                >
                    <div className="blur-sm pointer-events-none select-none">
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm text-zinc-500 mb-2">자아 이미지</h3>
                                <p className="text-zinc-500">당신의 깊은 내면에는 숨겨진 자아가 있습니다...</p>
                            </div>
                            <div>
                                <h3 className="text-sm text-zinc-500 mb-2">대인관계 패턴</h3>
                                <p className="text-zinc-500">관계에서 보이는 패턴은 무의식에서 비롯됩니다...</p>
                            </div>
                        </div>
                    </div>
                    <div className="text-center mt-4">
                        <span className="text-zinc-500 text-sm">상세 분석은 유료 콘텐츠입니다</span>
                    </div>
                </motion.div>
            )}
        </div>
    );
}

