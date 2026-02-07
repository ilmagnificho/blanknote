// components/common/loading-screen.tsx
// 분석 로딩 화면 - 동적 애니메이션

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LOADING_MESSAGES } from "@/types";

/**
 * 분석 중 로딩 화면
 * 진행 중임을 명확하게 보여주는 동적 애니메이션
 */
export function LoadingScreen() {
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const [dots, setDots] = useState("");

    useEffect(() => {
        // 메시지 순환
        const messageInterval = setInterval(() => {
            setCurrentMessageIndex((prev) =>
                prev < LOADING_MESSAGES.length - 1 ? prev + 1 : prev
            );
        }, 2500);

        // 점 애니메이션 (로딩 중... 효과)
        const dotInterval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? "" : prev + ".");
        }, 400);

        return () => {
            clearInterval(messageInterval);
            clearInterval(dotInterval);
        };
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-black">
            {/* 로고 */}
            <motion.div
                className="mb-16"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <h1 className="text-xl font-mono tracking-widest text-zinc-600">
                    Blanknote<span className="text-white">_</span>
                </h1>
            </motion.div>

            {/* 메인 로딩 애니메이션 */}
            <div className="relative mb-12">
                {/* 외곽 회전 링 */}
                <motion.div
                    className="w-28 h-28 border-2 border-zinc-800 rounded-full"
                    style={{ borderTopColor: "#a855f7", borderRightColor: "#ec4899" }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />

                {/* 내부 역회전 링 */}
                <motion.div
                    className="absolute inset-3 border border-zinc-700 rounded-full"
                    style={{ borderBottomColor: "#a855f7" }}
                    animate={{ rotate: -360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />

                {/* 중앙 펄스 */}
                <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <motion.div
                        className="w-4 h-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full"
                        animate={{
                            scale: [1, 1.3, 1],
                            boxShadow: [
                                "0 0 10px rgba(168, 85, 247, 0.5)",
                                "0 0 30px rgba(168, 85, 247, 0.8)",
                                "0 0 10px rgba(168, 85, 247, 0.5)"
                            ]
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    />
                </motion.div>
            </div>

            {/* 상태 메시지 */}
            <div className="h-16 flex flex-col items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.p
                        key={currentMessageIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="text-lg text-zinc-300 text-center font-light"
                    >
                        {LOADING_MESSAGES[currentMessageIndex]}
                    </motion.p>
                </AnimatePresence>

                {/* 로딩 점 애니메이션 */}
                <motion.p
                    className="text-xl text-purple-400 font-mono mt-2 w-12 text-left"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity }}
                >
                    {dots || "\u00A0"}
                </motion.p>
            </div>

            {/* 진행률 표시 */}
            <div className="mt-8 w-72">
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 bg-[length:200%_100%]"
                        initial={{ width: "0%" }}
                        animate={{
                            width: `${Math.min(((currentMessageIndex + 1) / LOADING_MESSAGES.length) * 100, 95)}%`,
                            backgroundPosition: ["0% 0%", "100% 0%"],
                        }}
                        transition={{
                            width: { duration: 0.8 },
                            backgroundPosition: { duration: 2, repeat: Infinity, ease: "linear" }
                        }}
                    />
                </div>
                <p className="text-xs text-zinc-600 text-center mt-3">
                    무의식 분석 및 이미지 생성 중{dots}
                </p>
            </div>

            {/* 안내 문구 */}
            <motion.p
                className="mt-12 text-xs text-zinc-700 text-center max-w-xs"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
            >
                AI가 당신의 답변을 분석하고 있습니다<br />
                약 30초~1분 정도 소요될 수 있습니다
            </motion.p>
        </div>
    );
}
