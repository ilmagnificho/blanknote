// app/test/page.tsx
// SCT 테스트 페이지

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { QuestionCarousel } from "@/components/test/question-carousel";
import { LoadingScreen } from "@/components/common/loading-screen";
import { ErrorMessage } from "@/components/common/error-message";
import { useTestStore } from "@/store/test-store";
import { analyzeAndSave } from "@/app/actions/analyze";

export default function TestPage() {
    const router = useRouter();
    const { answers, setSubmitting, setComplete, setError, isSubmitting, error, reset } =
        useTestStore();
    const [showLoading, setShowLoading] = useState(false);

    // 분석 완료 핸들러
    const handleComplete = async () => {
        setSubmitting(true);
        setShowLoading(true);

        try {
            const result = await analyzeAndSave(answers);

            if (result.success && result.resultId) {
                setComplete(result.resultId);
                router.push(`/result/${result.resultId}`);
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

    // 처음부터 다시
    const handleReset = () => {
        reset();
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
    return <QuestionCarousel onComplete={handleComplete} />;
}
