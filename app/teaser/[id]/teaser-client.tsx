"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

    // keywords가 객체({1: 'a', 2: 'b'})로 저장된 경우 배열로 변환
    const toStringArray = (val: unknown): string[] => {
        if (!val) return [];
        if (Array.isArray(val)) return val.map(v => String(v));
        if (typeof val === 'object') return Object.values(val).map(v => String(v));
        return [];
    };
    const keywords = toStringArray(analysis?.keywords);

    // 인트로 애니메이션 상태 (true: 인트로 실행 중, false: 결과 표시)
    const [showResult, setShowResult] = useState(false);

    // 인트로 시퀀스 완료 핸들러
    const handleIntroComplete = () => {
        setShowResult(true);
    };

    const handleStartDeep = () => {
        // Deep 테스트 시작 및 이동
        startDeepPhase();
        router.push(`/test/deep?resultId=${result.id}`);
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
            <AnimatePresence mode="wait">
                {!showResult ? (
                    <IntroSequence key="intro" onComplete={handleIntroComplete} />
                ) : (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                        className="w-full"
                    >
                        <TeaserContent
                            analysis={analysis}
                            onStartDeep={handleStartDeep}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ----------------------------------------------------------------------
// 1. Cinematic Intro Sequence
// ----------------------------------------------------------------------

function IntroSequence({ onComplete }: { onComplete: () => void }) {
    const [step, setStep] = useState(0);

    useEffect(() => {
        // 시퀀스 타이밍 조절
        const times = [0, 2500, 5500, 8500]; // 각 단계별 시작 시간 (ms)

        const t1 = setTimeout(() => setStep(1), times[1]);
        const t2 = setTimeout(() => setStep(2), times[2]);
        const t3 = setTimeout(() => {
            setStep(3);
            setTimeout(onComplete, 1000); // 마지막 텍스트 후 결과 전환
        }, times[3]);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        };
    }, [onComplete]);

    return (
        <div className="flex items-center justify-center min-h-screen px-6 text-center">
            <AnimatePresence mode="wait">
                {step === 0 && (
                    <motion.div
                        key="step0"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-purple-500 font-mono text-sm tracking-widest mb-2 block">
                            SYSTEM ACTIVE
                        </span>
                        <h2 className="text-2xl md:text-3xl font-light text-white">
                            투사 심리 분석 모델 가동
                        </h2>
                    </motion.div>
                )}
                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                        transition={{ duration: 0.8 }}
                        className="max-w-md mx-auto"
                    >
                        <p className="text-zinc-400 text-lg leading-relaxed">
                            100여 년간 <strong className="text-zinc-200">임상 현장</strong>에서 검증된<br />
                            투사적 심리 분석을 시작합니다.
                        </p>
                    </motion.div>
                )}
                {step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full animate-pulse"></div>
                            <h2 className="relative text-3xl md:text-4xl font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-white to-purple-200">
                                무의식의 패턴 발견
                            </h2>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ----------------------------------------------------------------------
// 2. Main Teaser Content
// ----------------------------------------------------------------------

function TeaserContent({
    analysis,
    onStartDeep
}: {
    analysis: IntroAnalysisResult,
    onStartDeep: () => void
}) {
    // keywords가 객체({1: 'a', 2: 'b'})로 저장된 경우 배열로 변환
    const toStringArray = (val: unknown): string[] => {
        if (!val) return [];
        if (Array.isArray(val)) return val.map(v => String(v));
        if (typeof val === 'object') return Object.values(val).map(v => String(v));
        return [];
    };
    const keywords = toStringArray(analysis?.keywords);

    return (
        <div className="pb-20">
            {/* Header */}
            <header className="py-6 px-6 text-center border-b border-white/5">
                <Link href="/" className="text-xl font-mono tracking-widest text-zinc-600 hover:text-zinc-400 transition-colors">
                    Blanknote<span className="text-purple-500">_</span>
                </Link>
            </header>

            <main className="px-6 pt-12">
                {/* 1. Result Teaser */}
                <section className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <span className="inline-block px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-xs font-medium tracking-wide mb-6">
                            DEEP MIND ANALYSIS
                        </span>

                        <h1 className="text-3xl md:text-4xl font-light text-white mb-4 leading-tight">
                            당신의 무의식 유형은<br />
                            <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
                                {analysis?.typeLabel}
                            </span>
                        </h1>

                        <div className="flex flex-wrap justify-center gap-2 mb-10">
                            {keywords.map((k, i) => (
                                <span key={i} className="text-zinc-500 text-sm">#{k}</span>
                            ))}
                        </div>

                        {/* One Liner Card */}
                        <div className="max-w-xl mx-auto p-1 rounded-2xl bg-gradient-to-b from-white/10 to-transparent">
                            <div className="bg-zinc-900/90 backdrop-blur-sm p-8 rounded-xl border border-white/5 shadow-2xl">
                                <p className="text-xl text-zinc-300 font-serif leading-relaxed">
                                    &ldquo;{analysis?.oneLiner}&rdquo;
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* 2. Authority & Trust (SCT 설명) */}
                <section className="max-w-2xl mx-auto mb-20">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8">
                        <div className="flex items-start gap-4 mb-4">
                            <span className="text-2xl">🔮</span>
                            <div>
                                <h3 className="text-lg text-white font-medium mb-1">
                                    단순한 심리테스트가 아닙니다
                                </h3>
                                <p className="text-zinc-400 text-sm leading-relaxed">
                                    100여 년간 <strong>임상 심리학 현장</strong>에서 검증된 <strong>투사 기법(Projective Technique)</strong>을 AI가 현대적으로 재해석했습니다.
                                </p>
                            </div>
                        </div>
                        <div className="pl-10 border-l-2 border-zinc-800 space-y-3">
                            <p className="text-zinc-500 text-sm">
                                의식적인 방어가 허술해진 틈을 타, 당신의 <strong>진짜 속마음, 억압된 욕구, 숨겨진 상처</strong>를 드러냅니다.
                            </p>
                        </div>
                    </div>
                </section>

                {/* 3. Deep Analysis Preview (Paywall) */}
                <section className="max-w-2xl mx-auto mb-12">
                    <div className="text-center mb-8">
                        <p className="text-zinc-400 text-sm mb-2">당신의 무의식 심층 보고서</p>
                        <h2 className="text-2xl text-white font-light">지금, 당신의 깊은 곳을 확인하세요</h2>
                    </div>

                    <div className="relative group">
                        {/* 블러 처리된 리스트 */}
                        <div className="space-y-3 filter blur-sm opacity-60 select-none pointer-events-none">
                            <PreviewItem title="🕵️ Dark MBTI" desc="당신도 모르는 당신의 그림자 성격 유형" />
                            <PreviewItem title="💔 관계의 패턴" desc="왜 늘 비슷한 문제로 상처받는가?" />
                            <PreviewItem title="🛡️ 심리적 방어기제" desc="나는 어떤 방식으로 세상과 싸우고 있는가" />
                            <PreviewItem title="💎 내면의 잠재력" desc="가장 나다운 모습으로 성공하는 방법" />
                        </div>

                        {/* 잠금 오버레이 */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                            <div className="bg-zinc-900/90 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-purple-500/30 shadow-2xl text-center max-w-sm w-full mx-4 transform transition-transform hover:scale-105 duration-300">
                                <span className="text-4xl mb-4 block">🔓</span>
                                <h3 className="text-xl text-white font-medium mb-2">
                                    분석 결과가 도착했습니다
                                </h3>
                                <p className="text-zinc-400 text-sm mb-6">
                                    {analysis?.teaser || "이곳에는 당신조차 몰랐던 진실이 숨겨져 있습니다."}
                                </p>

                                <button
                                    onClick={onStartDeep}
                                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium rounded-xl shadow-lg shadow-purple-900/40 transition-all flex items-center justify-center gap-2 group-hover:gap-3"
                                >
                                    <span>내 무의식 해제하기</span>
                                    <span className="text-white/70">→</span>
                                </button>

                                <p className="mt-4 text-xs text-zinc-500">
                                    Start Deep Analysis • 7 Questions
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. Social Proof & Guarantee */}
                <section className="text-center max-w-sm mx-auto space-y-2">
                    <div className="flex items-center justify-center gap-1 text-yellow-500 text-sm">
                        <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                    </div>
                    <p className="text-zinc-500 text-xs">
                        "살면서 한 번도 본 적 없던 나의 진짜 모습을 마주했습니다."<br />
                        <span className="text-zinc-600 text-[10px] mt-1 block">- Beta Tester 후기 중</span>
                    </p>
                </section>
            </main>
        </div>
    );
}

function PreviewItem({ title, desc }: { title: string, desc: string }) {
    return (
        <div className="flex items-center gap-4 p-4 bg-zinc-800/50 rounded-xl border border-white/5">
            <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-lg">
                🔒
            </div>
            <div>
                <h4 className="text-zinc-300 text-sm font-medium">{title}</h4>
                <p className="text-zinc-400 text-xs">{desc}</p>
            </div>
        </div>
    );
}
