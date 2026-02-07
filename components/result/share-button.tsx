// components/result/share-button.tsx
// 공유 버튼 컴포넌트

"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface ShareButtonProps {
    keywords: string[] | Record<string, string> | unknown;
    oneLiner: string;
}

/**
 * 객체를 배열로 안전하게 변환
 */
function toStringArray(val: unknown): string[] {
    if (!val) return [];
    if (Array.isArray(val)) return val.map(v => String(v));
    if (typeof val === 'object') return Object.values(val).map(v => String(v));
    return [];
}

/**
 * SNS 공유 버튼
 */
export function ShareButton({ keywords, oneLiner }: ShareButtonProps) {
    const [copied, setCopied] = useState(false);
    const safeKeywords = toStringArray(keywords);

    const shareText = `나의 무의식 분석 결과\n\n${safeKeywords.join(" ")}\n\n"${oneLiner}"\n\n🔮 Blanknote에서 나도 분석받기`;
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";

    // 클립보드 복사
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("복사 실패:", err);
        }
    };

    // 트위터 공유
    const handleTwitterShare = () => {
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        window.open(url, "_blank");
    };

    // 카카오톡 공유 (Web Share API 폴백)
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Blanknote 무의식 분석",
                    text: shareText,
                    url: shareUrl,
                });
            } catch (err) {
                if ((err as Error).name !== "AbortError") {
                    handleCopy();
                }
            }
        } else {
            handleCopy();
        }
    };

    return (
        <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
            {/* 공유하기 버튼 */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleShare}
                className="w-full px-6 py-4 bg-white text-black font-medium rounded-full
                   hover:bg-zinc-200 transition-colors"
            >
                {copied ? "✓ 복사됨!" : "공유하기"}
            </motion.button>

            {/* 트위터 공유 */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleTwitterShare}
                className="w-full px-6 py-3 border border-zinc-700 text-zinc-300 rounded-full
                   hover:border-zinc-500 hover:text-white transition-colors"
            >
                𝕏 트위터에 공유
            </motion.button>

            {/* 다시하기 */}
            <motion.a
                href="/"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-6 py-3 text-center text-zinc-500 hover:text-zinc-300 transition-colors"
            >
                처음부터 다시하기
            </motion.a>
        </div>
    );
}
