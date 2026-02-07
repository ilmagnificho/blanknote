// app/test/page.tsx
// SCT Intro 테스트 페이지 (5문항 → Teaser 결과)

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { QuestionCarousel } from "@/components/test/question-carousel";
import { ProgressBar } from "@/components/test/progress-bar";
import { LoadingScreen } from "@/components/common/loading-screen";
import { ErrorMessage } from "@/components/common/error-message";
import { useTestStore } from "@/store/test-store";
import { analyzeIntro } from "@/app/actions/analyze";

export default function TestPage() {
    const router = useRouter();
    const {
        phase,
        introAnswers,
        currentQuestionIndex,
        setSubmitting,
        setIntroComplete,
        setError,
        isSubmitting,
        error,
        reset,
    } = useTestStore();

    const [showLoading, setShowLoading] = useState(false);

    // 컴포넌트 마운트 시 초기화 (Intro 단계)
    useEffect(() => {
        if (phase !== "deep") {
            reset();
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Intro 분석 완료 핸들러
    const handleComplete = async () => {
        setSubmitting(true);
        setShowLoading(true);

        try {
            const result = await analyzeIntro(introAnswers);

            if (result.success && result.resultId) {
                setIntroComplete(result.resultId);
                // Teaser 페이지로 이동
                router.push(`/teaser/${result.resultId}`);
            } else {
                setError(result.error || "분석에 실패했습니다.");
                setShowLoading(false);
            }
        } catch (err) {
            setError("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
            setShowLoading(false);
        }
    };

    // 재시도 핸들러
    const handleRetry = () => {
        setError(null);
        setShowLoading(false);
    };

    // 에러 화면
    if (error) {
        return <ErrorMessage message={error} onRetry={handleRetry} />;
    }

    // 로딩 화면
    if (showLoading || isSubmitting) {
        return <LoadingScreen />;
    }

    // 테스트 화면
    return (
        <div className="min-h-screen bg-black flex flex-col">
            {/* 헤더 */}
            <header className="py-6 px-6">
                <div className="text-center">
                    <Link href="/" className="text-xl font-mono tracking-widest text-zinc-600">
                        Blanknote<span className="text-white">_</span>
                    </Link>
                </div>
            </header>

            {/* 진행 표시줄 */}
            <div className="px-6 mb-8 text-center text-sm text-zinc-500">
                <span>기본 분석 (5문항)</span>
            </div>

            {/* 질문 캐러셀 */}
            <main className="flex-1 px-6 pb-12">
                <div className="max-w-lg mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentQuestionIndex}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                        >
                            <QuestionCarousel onComplete={handleComplete} />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

            {/* 하단 안내 */}
            <footer className="py-4 px-6 text-center">
                <p className="text-zinc-600 text-xs">
                    떠오르는 대로 자유롭게 답해주세요
                </p>
            </footer>
        </div>
    );
}
