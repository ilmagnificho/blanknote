// components/landing/hero.tsx
// 랜딩 페이지 히어로 섹션 - 타이핑 애니메이션

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

/**
 * 타이핑 애니메이션 효과가 있는 히어로 섹션
 */
export function Hero() {
    const router = useRouter();
    const [displayText, setDisplayText] = useState("");
    const [showCursor, setShowCursor] = useState(true);
    const [isTypingComplete, setIsTypingComplete] = useState(false);

    const fullText = "당신의 빈칸에는 무엇이 숨어있나요?";

    // 타이핑 애니메이션
    useEffect(() => {
        if (displayText.length < fullText.length) {
            const timeout = setTimeout(() => {
                setDisplayText(fullText.slice(0, displayText.length + 1));
            }, 80);
            return () => clearTimeout(timeout);
        } else {
            setIsTypingComplete(true);
        }
    }, [displayText]);

    // 커서 깜빡임
    useEffect(() => {
        const interval = setInterval(() => {
            setShowCursor((prev) => !prev);
        }, 530);
        return () => clearInterval(interval);
    }, []);

    // 검사 시작 핸들러
    const handleStart = () => {
        router.push("/test");
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-black">
            {/* 로고 */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-12"
            >
                <h1 className="text-2xl font-mono tracking-widest text-zinc-500">
                    Blanknote<span className="text-white">_</span>
                </h1>
            </motion.div>

            {/* 메인 타이핑 텍스트 */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-center mb-16"
            >
                <h2 className="text-2xl md:text-4xl font-medium text-white leading-relaxed">
                    {displayText}
                    <span
                        className={`inline-block w-[3px] h-[1.2em] bg-white ml-1 align-middle transition-opacity ${showCursor ? "opacity-100" : "opacity-0"
                            }`}
                    />
                </h2>
            </motion.div>

            {/* CTA 버튼 */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isTypingComplete ? 1 : 0, y: isTypingComplete ? 0 : 20 }}
                transition={{ duration: 0.5 }}
            >
                <button
                    onClick={handleStart}
                    disabled={!isTypingComplete}
                    className="group relative px-8 py-4 bg-white text-black font-medium rounded-full 
                     hover:bg-zinc-200 transition-all duration-300 
                     disabled:opacity-0 disabled:cursor-not-allowed
                     hover:scale-105 active:scale-95"
                >
                    <span className="relative z-10">검사 시작하기</span>

                    {/* 호버 이펙트 */}
                    <motion.div
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 
                       group-hover:opacity-20 transition-opacity duration-300"
                    />
                </button>
            </motion.div>

            {/* 하단 힌트 텍스트 */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: isTypingComplete ? 1 : 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mt-8 text-sm text-zinc-600"
            >
                약 2분 소요 · 로그인 불필요
            </motion.p>
        </div>
    );
}
