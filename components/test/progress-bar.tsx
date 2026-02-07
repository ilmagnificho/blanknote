// components/test/progress-bar.tsx
// SCT 테스트 진행률 바

"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
    progress: number; // 0-100
    currentQuestion: number;
    totalQuestions: number;
}

/**
 * 애니메이션이 적용된 진행률 바
 */
export function ProgressBar({
    progress,
    currentQuestion,
    totalQuestions,
}: ProgressBarProps) {
    return (
        <div className="w-full max-w-md mx-auto">
            {/* 진행 표시 텍스트 */}
            <div className="flex justify-between items-center mb-2 text-sm text-zinc-500">
                <span>질문 {currentQuestion}/{totalQuestions}</span>
                <span>{Math.round(progress)}%</span>
            </div>

            {/* 프로그레스 바 */}
            <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
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
