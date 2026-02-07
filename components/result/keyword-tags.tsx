// components/result/keyword-tags.tsx
// 해시태그 키워드 표시 컴포넌트

"use client";

import { motion } from "framer-motion";

interface KeywordTagsProps {
    keywords: string[];
}

/**
 * 분석 결과 키워드 태그 (3개 해시태그)
 */
export function KeywordTags({ keywords }: KeywordTagsProps) {
    return (
        <div className="flex flex-wrap gap-3 justify-center">
            {keywords.map((keyword, index) => (
                <motion.span
                    key={keyword}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: index * 0.15, duration: 0.4 }}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 
                     border border-purple-500/30 rounded-full
                     text-sm md:text-base text-purple-300 font-medium"
                >
                    {keyword}
                </motion.span>
            ))}
        </div>
    );
}
