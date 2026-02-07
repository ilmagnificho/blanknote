// app/result/[id]/result-client.tsx
// 결과 페이지 클라이언트 컴포넌트 (2단계 퍼널 - Paywall)

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { KeywordTags } from "@/components/result/keyword-tags";
import { ShareButton } from "@/components/result/share-button";
import type { Result, AnalysisResult } from "@/types";
import { PRICING } from "@/types";

interface ResultClientProps {
    result: Result;
}

export function ResultClient({ result }: ResultClientProps) {
    const analysis = result.analysis_text as AnalysisResult;
    const isPaid = result.is_paid;

    // 결제 핸들러 (TODO: Lemon Squeezy 연동)
    const handlePayment = () => {
        alert("결제 기능 준비 중입니다. (₩4,900)");
        // TODO: Lemon Squeezy checkout 호출
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
                    {isPaid ? "완전한 분석 결과" : "분석 완료"}
                </h2>
                <p className="text-zinc-500">
                    {isPaid ? "당신의 무의식이 말하고 있습니다" : "12문항 심층 분석이 준비되었습니다"}
                </p>
            </motion.div>

            {/* 유형 라벨 */}
            {analysis?.typeLabel && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-center mb-8"
                >
                    <span className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full">
                        <span className="text-xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                            {analysis.typeLabel}
                        </span>
                    </span>
                </motion.div>
            )}

            {/* 키워드 태그 */}
            <div className="mb-10">
                <KeywordTags keywords={analysis?.keywords || []} />
            </div>

            {/* 한 줄 분석 */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="max-w-lg mx-auto mb-8"
            >
                <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl text-center">
                    <p className="text-lg md:text-xl text-white font-medium leading-relaxed">
                        &ldquo;{analysis?.oneLiner}&rdquo;
                    </p>
                </div>
            </motion.div>

            {/* 무의식 이미지 (유료) */}
            {isPaid && result.image_url && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="max-w-lg mx-auto mb-8"
                >
                    <div className="rounded-2xl overflow-hidden">
                        <img
                            src={result.image_url}
                            alt="무의식의 풍경"
                            className="w-full h-auto"
                        />
                    </div>
                    <p className="text-center text-zinc-500 text-sm mt-3">
                        당신의 무의식이 그린 풍경
                    </p>
                </motion.div>
            )}

            {/* 상세 분석 카드 */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="max-w-lg mx-auto mb-10"
            >
                {isPaid ? (
                    // 유료 - 전체 공개
                    <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-6">
                        <div>
                            <h3 className="text-sm text-purple-400 mb-2">자아 이미지</h3>
                            <p className="text-zinc-300">{analysis?.deepAnalysis?.selfImage}</p>
                        </div>
                        <div>
                            <h3 className="text-sm text-purple-400 mb-2">대인관계 패턴</h3>
                            <p className="text-zinc-300">{analysis?.deepAnalysis?.relationships}</p>
                        </div>
                        <div>
                            <h3 className="text-sm text-purple-400 mb-2">숨겨진 상처</h3>
                            <p className="text-zinc-300">{analysis?.deepAnalysis?.trauma}</p>
                        </div>
                        {analysis?.deepAnalysis?.desires && (
                            <div>
                                <h3 className="text-sm text-purple-400 mb-2">숨겨진 욕구</h3>
                                <p className="text-zinc-300">{analysis?.deepAnalysis?.desires}</p>
                            </div>
                        )}
                        <div className="pt-4 border-t border-zinc-800">
                            <h3 className="text-sm text-purple-400 mb-2">종합 분석</h3>
                            <p className="text-white">{analysis?.deepAnalysis?.summary}</p>
                        </div>
                    </div>
                ) : (
                    // 무료 - 블러 처리
                    <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden relative">
                        <div className="blur-md pointer-events-none select-none space-y-4">
                            <div>
                                <h3 className="text-sm text-zinc-500 mb-2">자아 이미지</h3>
                                <p className="text-zinc-400">
                                    {analysis?.deepAnalysis?.selfImage?.slice(0, 50)}...
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm text-zinc-500 mb-2">대인관계 패턴</h3>
                                <p className="text-zinc-400">
                                    {analysis?.deepAnalysis?.relationships?.slice(0, 50)}...
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm text-zinc-500 mb-2">숨겨진 상처</h3>
                                <p className="text-zinc-400">
                                    {analysis?.deepAnalysis?.trauma?.slice(0, 50)}...
                                </p>
                            </div>
                        </div>
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                            <span className="text-4xl mb-3">🔒</span>
                            <p className="text-white font-medium mb-1">심층 분석 잠금</p>
                            <p className="text-zinc-400 text-sm">결제 후 전체 분석 + 이미지 확인</p>
                        </div>
                    </div>
                )}
            </motion.div>

            {/* 결제 CTA (미결제 시) */}
            {!isPaid && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="text-center mb-10"
                >
                    <button
                        onClick={handlePayment}
                        className="w-full max-w-xs mx-auto block px-8 py-4 
                            bg-gradient-to-r from-purple-500 to-pink-500 
                            text-white font-medium rounded-full
                            hover:opacity-90 transition-opacity"
                    >
                        🔓 전체 분석 + 이미지 (₩{PRICING.KRW.toLocaleString()})
                    </button>
                    <p className="text-zinc-600 text-sm mt-3">
                        12문항 심층 분석 결과 잠금 해제
                    </p>
                </motion.div>
            )}

            {/* 공유 버튼 */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: isPaid ? 0.8 : 1.0 }}
            >
                <ShareButton
                    keywords={analysis?.keywords || []}
                    oneLiner={analysis?.oneLiner || ""}
                />
            </motion.div>

            {/* 처음부터 다시 */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="text-center mt-8"
            >
                <Link
                    href="/test"
                    className="text-zinc-500 text-sm hover:text-zinc-400 transition-colors"
                >
                    처음부터 다시하기
                </Link>
            </motion.div>
        </div>
    );
}
