// components/test/progress-bar.tsx
// SCT 테스트 진행률 바

"use client";

import { motion } from "framer-motion";
import { useTestStore } from "@/store/test-store";

/**
 * 애니메이션이 적용된 진행률 바
 * store에서 상태를 직접 가져옵니다.
 */
export function ProgressBar() {
    const { getProgress, currentQuestionIndex, getCurrentQuestions } = useTestStore();

    const progress = getProgress();
    const questions = getCurrentQuestions();
    const current = currentQuestionIndex + 1;
    const total = questions.length;

    return (
        <div className="w-full max-w-md mx-auto">
            {/* 진행율 바 */}
            <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden mb-2">
                <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                />
            </div>
        </div>
    );
}
