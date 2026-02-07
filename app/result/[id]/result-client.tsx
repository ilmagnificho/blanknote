"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

    const [isGenerating, setIsGenerating] = useState(false);
    const router = useRouter();

    // 이미지 다운로드 핸들러
    const handleDownload = async () => {
        if (!result.image_url) return;
        try {
            const response = await fetch(result.image_url);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `blanknote-${result.id.slice(0, 8)}.png`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (e) {
            console.error(e);
            alert("이미지 다운로드에 실패했습니다.");
        }
    };

    // 결제 핸들러 (현재: 개발용 우회 - 즉시 이미지 생성)
    const handlePayment = async () => {
        if (!confirm("결제를 진행하시겠습니까? (현재 개발 모드로 무료 진행됩니다)")) return;

        setIsGenerating(true);
        try {
            // 결제 완료 처리 및 이미지 생성 액션 호출
            const { generateImageAfterPayment } = await import("@/app/actions/analyze");
            const resultResponse = await generateImageAfterPayment(result.id);

            if (resultResponse.success) {
                alert("결제 및 분석이 완료되었습니다!");
                router.refresh();
            } else {
                alert(`오류가 발생했습니다: ${resultResponse.error}`);
            }
        } catch (e) {
            console.error(e);
            alert("처리 중 오류가 발생했습니다.");
        } finally {
            setIsGenerating(false);
        }
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
                    {isPaid ? "무의식의 목소리" : "분석의 끝, 그리고 시작"}
                </h2>
                <p className="text-zinc-500 font-light">
                    {isPaid
                        ? "오랜 침묵을 깨고, 당신의 내면이 이야기를 시작합니다."
                        : "당신의 깊은 내면을 마주할 준비가 되셨나요?"}
                </p>
            </motion.div>

            {/* 유형 라벨 */}
            {analysis?.typeLabel && (
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
                                {analysis.typeLabel}
                            </span>
                        </span>
                    </div>
                </motion.div>
            )}

            {/* 키워드 태그 */}
            <div className="mb-12">
                <KeywordTags keywords={analysis?.keywords || []} />
            </div>

            {/* 한 줄 분석 */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="max-w-lg mx-auto mb-12"
            >
                <div className="p-8 bg-zinc-900/30 border border-zinc-800 rounded-2xl text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-purple-500/50 to-transparent opacity-50"></div>
                    <p className="text-xl md:text-2xl text-zinc-200 font-serif leading-relaxed italic">
                        &ldquo;{analysis?.oneLiner}&rdquo;
                    </p>
                </div>
            </motion.div>

            {/* 무의식 이미지 (유료) */}
            {isPaid && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="max-w-lg mx-auto mb-12"
                >
                    <div className="rounded-2xl overflow-hidden relative aspect-square bg-zinc-900 border border-zinc-800 flex items-center justify-center group mb-4 shadow-2xl shadow-purple-900/20">
                        {result.image_url ? (
                            <>
                                <img
                                    src={result.image_url}
                                    alt="무의식의 풍경"
                                    className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition duration-500 flex items-end justify-center p-6">
                                    <p className="text-white/90 font-light">당신의 무의식이 그려낸 풍경</p>
                                </div>
                            </>
                        ) : (
                            <div className="text-center p-6">
                                <div className="w-16 h-16 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-zinc-400 mb-2">무의식의 풍경을 그리고 있습니다...</p>
                                <p className="text-zinc-600 text-sm">(잠시만 기다려주세요)</p>
                            </div>
                        )}
                    </div>

                    {/* 다운로드 버튼 */}
                    {result.image_url && (
                        <div className="text-center">
                            <button
                                onClick={handleDownload}
                                className="inline-flex items-center gap-2 px-6 py-2.5 bg-zinc-900 border border-zinc-700 rounded-full text-zinc-300 text-sm hover:bg-zinc-800 hover:text-white transition-all hover:border-zinc-500"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="7 10 12 15 17 10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                </svg>
                                이미지 소장하기
                            </button>
                        </div>
                    )}
                </motion.div>
            )}

            {/* 상세 분석 카드 */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="max-w-lg mx-auto mb-16"
            >
                {isPaid ? (
                    // 유료 - 전체 공개
                    <div className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-2xl space-y-8 backdrop-blur-sm">
                        <div>
                            <h3 className="text-sm font-medium text-purple-400 mb-3 tracking-wider uppercase">자아 이미지</h3>
                            <p className="text-zinc-300 leading-relaxed text-lg font-light">{analysis?.deepAnalysis?.selfImage}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-purple-400 mb-3 tracking-wider uppercase">대인관계 패턴</h3>
                            <p className="text-zinc-300 leading-relaxed text-lg font-light">{analysis?.deepAnalysis?.relationships}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-purple-400 mb-3 tracking-wider uppercase">숨겨진 상처</h3>
                            <p className="text-zinc-300 leading-relaxed text-lg font-light">{analysis?.deepAnalysis?.trauma}</p>
                        </div>
                        {analysis?.deepAnalysis?.desires && (
                            <div>
                                <h3 className="text-sm font-medium text-purple-400 mb-3 tracking-wider uppercase">심연의 욕구</h3>
                                <p className="text-zinc-300 leading-relaxed text-lg font-light">{analysis?.deepAnalysis?.desires}</p>
                            </div>
                        )}
                        <div className="pt-8 border-t border-zinc-800">
                            <h3 className="text-sm font-medium text-purple-400 mb-4 tracking-wider uppercase">나를 위한 조언</h3>
                            <p className="text-white leading-relaxed text-lg italic bg-purple-500/5 p-6 rounded-xl border border-purple-500/10">
                                {analysis?.deepAnalysis?.summary}
                            </p>
                        </div>
                    </div>
                ) : (
                    // 무료 - 블러 처리 (Paywall 강화)
                    <div className="relative p-1 rounded-2xl bg-gradient-to-b from-purple-900/30 to-zinc-900/30">
                        <div className="p-8 bg-black rounded-xl overflow-hidden relative border border-zinc-800">
                            {/* 헤드라인 */}
                            <div className="mb-8 text-center relative z-10">
                                <span className="text-purple-400 text-xs font-mono tracking-widest uppercase mb-2 block">Premium Analysis</span>
                                <h3 className="text-xl md:text-2xl text-white font-serif italic">
                                    &ldquo;무의식이 당신에게 보내는<br />3가지 핵심 시그널&rdquo;
                                </h3>
                            </div>

                            {/* 블러된 리스트 */}
                            <div className="space-y-6 blur-[6px] opacity-40 select-none pointer-events-none grayscale-[50%]">
                                <div className="border-l-2 border-purple-500/30 pl-4">
                                    <h4 className="text-sm text-purple-300 mb-1">Mirror Image</h4>
                                    <p className="text-zinc-400 text-sm leading-relaxed">
                                        당신이 스스로를 정의하는 방식에는 큰 모순이 있습니다. 겉으로는 강해보이지만 내면에는...
                                    </p>
                                </div>
                                <div className="border-l-2 border-purple-500/30 pl-4">
                                    <h4 className="text-sm text-purple-300 mb-1">Emotional Echo</h4>
                                    <p className="text-zinc-400 text-sm leading-relaxed">
                                        반복되는 대인관계의 패턴은 어린 시절의 특정 기억과 깊게 연관되어 있으며, 이것이 해결되지 않으면...
                                    </p>
                                </div>
                                <div className="border-l-2 border-purple-500/30 pl-4">
                                    <h4 className="text-sm text-purple-300 mb-1">Hidden Shadow</h4>
                                    <p className="text-zinc-400 text-sm leading-relaxed">
                                        가장 감추고 싶어하는 당신의 그림자는 사실 당신의 가장 큰 잠재력을 품고 있는...
                                    </p>
                                </div>
                            </div>

                            {/* 잠금 오버레이 */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-black via-black/80 to-transparent z-20">
                                <div className="bg-zinc-900/90 p-4 rounded-full border border-purple-500/30 mb-4 shadow-[0_0_30px_rgba(168,85,247,0.15)] animate-pulse">
                                    <span className="text-3xl">🔒</span>
                                </div>
                                <p className="text-white font-medium mb-2 text-lg">분석 결과가 도착했습니다</p>
                                <p className="text-zinc-400 text-sm text-center px-6 leading-relaxed max-w-xs mb-6">
                                    지금, 당신의 내면 깊은 곳에 숨겨진<br />
                                    <span className="text-purple-400">진실된 이야기</span>를 마주하세요.
                                </p>
                            </div>
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
                    className="text-center mb-12"
                >
                    <div className="relative group cursor-pointer" onClick={isGenerating ? undefined : handlePayment}>
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
                        <button
                            disabled={isGenerating}
                            className="relative w-full max-w-xs mx-auto block px-8 py-5 
                                bg-zinc-900 ring-1 ring-white/10
                                text-white font-medium rounded-full
                                group-hover:bg-zinc-800 transition-all text-lg tracking-wide disabled:opacity-50"
                        >
                            {isGenerating ? "⏳ 무의식 분석 및 이미지 생성 중..." : `🔓 전체 분석 + 이미지 (₩${PRICING.KRW.toLocaleString()})`}
                        </button>
                    </div>
                    <p className="text-zinc-500 text-xs tracking-widest uppercase mt-4">
                        Full Analysis • Unconscious Image
                    </p>
                </motion.div>
            )}

            {/* 신뢰도 배지 (Trust Badge) */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0 }}
                className="max-w-lg mx-auto mb-16 p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800 text-center"
            >
                <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2 mb-2 px-3 py-1 bg-zinc-800 rounded-full border border-zinc-700">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-[10px] font-mono text-zinc-400 tracking-widest uppercase">Blanknote Lab. Verified</span>
                    </div>
                    <h3 className="text-zinc-300 font-medium">100% 익명성 보장 & 데이터 암호화</h3>
                    <p className="text-zinc-500 text-xs leading-relaxed max-w-sm">
                        귀하의 모든 응답 데이터는 분석 즉시 암호화되어 저장되며,<br />
                        개인을 식별할 수 있는 정보는 수집되지 않습니다.
                    </p>
                    <div className="flex gap-4 justify-center mt-2 text-[10px] text-zinc-600 uppercase tracking-wider">
                        <span className="flex items-center gap-1">🔒 SSL Security</span>
                        <span className="flex items-center gap-1">🛡️ AES-256 Encryption</span>
                        <span className="flex items-center gap-1">👁️ Anonymous</span>
                    </div>
                </div>
            </motion.div>

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
        </div>
    );
}
