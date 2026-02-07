// components/common/error-message.tsx
// 에러 메시지 컴포넌트

"use client";

import { motion } from "framer-motion";

interface ErrorMessageProps {
    message: string;
    onRetry?: () => void;
}

/**
 * 재치 있는 에러 메시지 컴포넌트
 */
export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="min-h-screen flex flex-col items-center justify-center px-6 bg-black"
        >
            {/* 에러 아이콘 */}
            <div className="mb-8 text-6xl">💫</div>

            {/* 에러 메시지 */}
            <h2 className="text-xl md:text-2xl font-medium text-white mb-4 text-center">
                무의식 접속 실패
            </h2>
            <p className="text-zinc-500 text-center max-w-md mb-8">{message}</p>

            {/* 재시도 버튼 */}
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="px-8 py-3 bg-white text-black font-medium rounded-full
                     hover:bg-zinc-200 transition-colors"
                >
                    다시 시도하기
                </button>
            )}
        </motion.div>
    );
}
