// components/test/question-carousel.tsx
// SCT 문항 캐러셀

"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTestStore } from "@/store/test-store";
import { ProgressBar } from "./progress-bar";

interface QuestionCarouselProps {
    onComplete: () => void;
}

/**
 * SCT 문항 입력 캐러셀
 * Enter 키로 다음 문항 이동, 부드러운 전환 효과
 */
export function QuestionCarousel({ onComplete }: QuestionCarouselProps) {
    const {
        currentQuestionIndex,
        setAnswer,
        nextQuestion,
        prevQuestion,
        isLastQuestion,
        canSubmit,
        getCurrentQuestion,
        getCurrentAnswers,
    } = useTestStore();

    const [direction, setDirection] = useState(0);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const currentQuestion = getCurrentQuestion();
    const currentAnswers = getCurrentAnswers();
    const currentAnswer = currentAnswers[currentQuestionIndex]?.answer || "";

    // 문항 변경 시 포커스
    useEffect(() => {
        inputRef.current?.focus();
    }, [currentQuestionIndex]);

    // 키보드 이벤트 핸들러
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleNext();
        }
    };

    // 다음 문항
    const handleNext = () => {
        if (currentAnswer.trim().length < 2) return;

        if (isLastQuestion()) {
            if (canSubmit()) {
                onComplete();
            }
        } else {
            setDirection(1);
            nextQuestion();
        }
    };

    // 이전 문항
    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setDirection(-1);
            prevQuestion();
        }
    };

    // 입력 변경
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setAnswer(currentQuestion.id, e.target.value);
    };

    // 슬라이드 애니메이션 variants
    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 300 : -300,
            opacity: 0,
        }),
    };

    return (
        <div className="min-h-screen flex flex-col items-center px-6 bg-black pt-12 pb-8">
            {/* 로고 */}
            <div className="mb-8 text-center">
                <h1 className="text-xl font-mono tracking-widest text-zinc-600">
                    Blanknote<span className="text-white">_</span>
                </h1>
            </div>

            {/* 프로그레스 바 */}
            <div className="w-full max-w-lg mb-10">
                <ProgressBar />
            </div>

            {/* 문항 카드 */}
            <div className="relative w-full max-w-lg flex-1 min-h-[300px] flex flex-col justify-start">
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={currentQuestionIndex}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="absolute inset-0 flex flex-col"
                    >
                        {/* 문항 프롬프트 */}
                        <div className="mb-6">
                            <span className="text-sm text-zinc-500 mb-2 block">
                                #{currentQuestion.id}
                            </span>
                            <h2 className="text-2xl md:text-3xl font-medium text-white leading-tight">
                                {currentQuestion.prompt}
                                <span className="text-zinc-500 inline-block ml-2">_______</span>
                            </h2>
                        </div>

                        {/* 입력 필드 */}
                        <textarea
                            ref={inputRef}
                            value={currentAnswer}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            placeholder="내용을 입력하세요..."
                            className="w-full h-40 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg
                                     text-white placeholder-zinc-600 resize-none
                                     focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600
                                     transition-colors text-lg"
                            autoFocus
                        />

                        {/* 글자 수 힌트 */}
                        <p className="mt-3 text-sm text-zinc-500 text-right">
                            {currentAnswer.length > 0 && currentAnswer.length < 2
                                ? "2자 이상 입력해주세요"
                                : "Enter를 눌러 다음으로"}
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* 네비게이션 버튼 */}
            <div className="w-full max-w-lg flex gap-4 mt-auto pt-8">
                {currentQuestionIndex > 0 && (
                    <button
                        onClick={handlePrev}
                        className="px-6 py-4 border border-zinc-800 text-zinc-400 rounded-full
                                 hover:bg-zinc-900 hover:text-white transition-colors"
                    >
                        이전
                    </button>
                )}
                <button
                    onClick={handleNext}
                    disabled={currentAnswer.trim().length < 2}
                    className="flex-1 px-6 py-4 bg-white text-black font-medium rounded-full
                             hover:bg-zinc-200 transition-colors
                             disabled:opacity-30 disabled:cursor-not-allowed text-center"
                >
                    {isLastQuestion() ? "분석하기" : "다음"}
                </button>
            </div>
        </div>
    );
}
