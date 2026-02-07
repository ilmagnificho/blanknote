// components/common/loading-screen.tsx
// 분석 로딩 화면 - 긴장감 조성 메시지

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LOADING_MESSAGES } from "@/types";

/**
 * 분석 중 로딩 화면
 * 메시지가 순환하며 긴장감 조성
 */
export function LoadingScreen() {
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentMessageIndex((prev) =>
                prev < LOADING_MESSAGES.length - 1 ? prev + 1 : prev
            );
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-black">
            {/* 로고 */}
            <div className="mb-16">
                <h1 className="text-xl font-mono tracking-widest text-zinc-600">
                    Blanknote<span className="text-white">_</span>
                </h1>
            </div>

            {/* 로딩 애니메이션 */}
            <div className="relative mb-12">
                {/* 회전하는 원 */}
                <motion.div
                    className="w-24 h-24 border-2 border-zinc-800 rounded-full"
                    style={{ borderTopColor: "#a855f7" }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />

                {/* 중앙 점 */}
                <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <div className="w-3 h-3 bg-purple-500 rounded-full" />
                </motion.div>
            </div>

            {/* 상태 메시지 */}
            <div className="h-8 flex items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.p
                        key={currentMessageIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="text-lg text-zinc-400 text-center"
                    >
                        {LOADING_MESSAGES[currentMessageIndex]}
                    </motion.p>
                </AnimatePresence>
            </div>

            {/* 진행률 표시 */}
            <div className="mt-8 w-64">
                <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                        initial={{ width: "0%" }}
                        animate={{
                            width: `${((currentMessageIndex + 1) / LOADING_MESSAGES.length) * 100}%`,
                        }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
            </div>
        </div>
    );
}
