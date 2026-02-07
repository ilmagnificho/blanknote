// app/test/deep/page.tsx
// Deep 테스트 페이지 - 추가 7문항

"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTestStore } from "@/store/test-store";
import { analyzeDeep } from "@/app/actions/analyze";
import { ProgressBar } from "@/components/test/progress-bar";
import { QuestionCarousel } from "@/components/test/question-carousel";
import { LoadingScreen } from "@/components/common/loading-screen";
import { ErrorMessage } from "@/components/common/error-message";
import Link from "next/link";

function DeepTestContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const resultId = searchParams.get("resultId");

    const {
        phase,
        deepAnswers,
        currentQuestionIndex,
        isSubmitting,
        error,
        setSubmitting,
        setError,
    } = useTestStore();

    const [showLoading, setShowLoading] = useState(false);

    // resultId 없으면 처음부터 시작하도록
    useEffect(() => {
        if (!resultId) {
            router.replace("/test");
        }
    }, [resultId, router]);

    const handleComplete = async () => {
        if (!resultId) return;

        setShowLoading(true);
        setSubmitting(true);

        try {
            const result = await analyzeDeep(resultId, deepAnswers);

            if (result.success && result.resultId) {
                // 결과 페이지로 이동 (Paywall)
                router.push(`/result/${result.resultId}`);
            } else {
                setError(result.error || "분석에 실패했습니다.");
                setShowLoading(false);
            }
        } catch (err) {
            setError("네트워크 오류가 발생했습니다.");
            setShowLoading(false);
        }
    };

    if (showLoading) {
        return <LoadingScreen />;
    }

    if (error) {
        return (
            <ErrorMessage
                message={error}
                onRetry={() => {
                    setError(null);
                    handleComplete();
                }}
            />
        );
    }

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
            <div className="px-6 mb-8">
                <div className="max-w-lg mx-auto space-y-2">
                    <div className="flex justify-between text-sm text-zinc-500">
                        <span>심층 분석</span>
                        <span>{currentQuestionIndex + 1} / 7</span>
                    </div>
                    <ProgressBar />
                </div>
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
                    솔직하게 답할수록 정확한 분석이 가능합니다
                </p>
            </footer>
        </div>
    );
}

export default function DeepTestPage() {
    return (
        <Suspense fallback={<LoadingScreen />}>
            <DeepTestContent />
        </Suspense>
    );
}
