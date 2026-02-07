// app/result/[id]/result-client.tsx
// 결과 페이지 클라이언트 컴포넌트

"use client";

import { motion } from "framer-motion";
import { KeywordTags } from "@/components/result/keyword-tags";
import { AnalysisCard } from "@/components/result/analysis-card";
import { ShareButton } from "@/components/result/share-button";
import type { Result, AnalysisResult } from "@/types";

interface ResultClientProps {
    result: Result;
}

export function ResultClient({ result }: ResultClientProps) {
    const analysis = result.analysis_text as AnalysisResult;

    return (
        <div className="min-h-screen bg-black py-12 px-6">
            {/* 로고 */}
            <div className="text-center mb-8">
                <h1 className="text-xl font-mono tracking-widest text-zinc-600">
                    Blanknote<span className="text-white">_</span>
                </h1>
            </div>

            {/* 헤더 */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
            >
                <h2 className="text-2xl md:text-3xl font-medium text-white mb-2">
                    분석 결과
                </h2>
                <p className="text-zinc-500">당신의 무의식이 말하고 있습니다</p>
            </motion.div>

            {/* 키워드 태그 */}
            <div className="mb-10">
                <KeywordTags keywords={analysis.keywords} />
            </div>

            {/* 분석 카드 */}
            <div className="mb-12">
                <AnalysisCard
                    analysis={analysis}
                    imageUrl={result.image_url}
                    isPaid={result.is_paid}
                />
            </div>

            {/* 유료 결제 CTA (미결제 시) */}
            {!result.is_paid && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                    className="mb-10"
                >
                    <button
                        className="w-full max-w-xs mx-auto block px-8 py-4 
                       bg-gradient-to-r from-purple-500 to-pink-500 
                       text-white font-medium rounded-full
                       hover:opacity-90 transition-opacity"
                    >
                        🔓 잠금 해제하기 (₩2,500)
                    </button>
                    <p className="text-center text-zinc-600 text-sm mt-3">
                        상세 분석 + 무의식 이미지 확인
                    </p>
                </motion.div>
            )}

            {/* 공유 버튼 */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
            >
                <ShareButton keywords={analysis.keywords} oneLiner={analysis.oneLiner} />
            </motion.div>
        </div>
    );
}
