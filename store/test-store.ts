// store/test-store.ts
// Zustand 상태 관리 - SCT 테스트 진행 상태 (2단계 퍼널)

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SCTAnswer, SCTQuestion, TestPhase } from "@/types";
import { INTRO_QUESTIONS, DEEP_QUESTIONS } from "@/types";

interface TestState {
    // 상태
    phase: TestPhase;
    currentQuestionIndex: number;
    introAnswers: SCTAnswer[];
    deepAnswers: SCTAnswer[];
    isSubmitting: boolean;
    introResultId: string | null;
    error: string | null;

    // 액션
    setAnswer: (questionId: number, answer: string) => void;
    nextQuestion: () => void;
    prevQuestion: () => void;
    goToQuestion: (index: number) => void;
    setSubmitting: (isSubmitting: boolean) => void;
    setIntroComplete: (resultId: string) => void;
    startDeepPhase: () => void;
    setError: (error: string | null) => void;
    reset: () => void;

    // Getters
    getCurrentQuestions: () => SCTQuestion[];
    getCurrentQuestion: () => SCTQuestion;
    getCurrentAnswers: () => SCTAnswer[];
    getProgress: () => number;
    isLastQuestion: () => boolean;
    canSubmit: () => boolean;
}

const createInitialAnswers = (questions: SCTQuestion[]): SCTAnswer[] =>
    questions.map((q) => ({
        questionId: q.id,
        prompt: q.prompt,
        answer: "",
    }));

// Fisher-Yates Shuffle
const shuffle = <T>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

const initialState = {
    phase: "intro" as TestPhase,
    currentQuestionIndex: 0,
    introAnswers: createInitialAnswers(INTRO_QUESTIONS),
    deepAnswers: createInitialAnswers(DEEP_QUESTIONS),
    isSubmitting: false,
    introResultId: null,
    error: null,
};

export const useTestStore = create<TestState>()(
    persist(
        (set, get) => ({
            ...initialState,

            setAnswer: (questionId: number, answer: string) => {
                const { phase } = get();
                if (phase === "intro") {
                    set((state) => ({
                        introAnswers: state.introAnswers.map((a) =>
                            a.questionId === questionId ? { ...a, answer } : a
                        ),
                    }));
                } else {
                    set((state) => ({
                        deepAnswers: state.deepAnswers.map((a) =>
                            a.questionId === questionId ? { ...a, answer } : a
                        ),
                    }));
                }
            },

            nextQuestion: () => {
                const questions = get().getCurrentQuestions();
                set((state) => ({
                    currentQuestionIndex: Math.min(
                        state.currentQuestionIndex + 1,
                        questions.length - 1
                    ),
                }));
            },

            prevQuestion: () => {
                set((state) => ({
                    currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0),
                }));
            },

            goToQuestion: (index: number) => {
                const questions = get().getCurrentQuestions();
                if (index >= 0 && index < questions.length) {
                    set({ currentQuestionIndex: index });
                }
            },

            setSubmitting: (isSubmitting: boolean) => {
                set({ isSubmitting, error: null });
            },

            setIntroComplete: (resultId: string) => {
                set({ introResultId: resultId, isSubmitting: false });
            },

            startDeepPhase: () => {
                // 전체 질문 풀에서 7개 랜덤 선택
                const randomQuestions = shuffle(DEEP_QUESTIONS).slice(0, 7);

                set({
                    phase: "deep",
                    currentQuestionIndex: 0,
                    deepAnswers: createInitialAnswers(randomQuestions),
                });
            },

            setError: (error: string | null) => {
                set({ error, isSubmitting: false });
            },

            reset: () => {
                set({
                    ...initialState,
                    introAnswers: createInitialAnswers(INTRO_QUESTIONS),
                    deepAnswers: createInitialAnswers(DEEP_QUESTIONS),
                });
            },

            getCurrentQuestions: () => {
                const { phase, deepAnswers } = get();
                if (phase === "intro") {
                    return INTRO_QUESTIONS;
                }
                // Deep 단계에서는 선택된(저장된) 질문들만 반환
                return deepAnswers.map(a => ({
                    id: a.questionId,
                    prompt: a.prompt,
                    phase: "deep" as TestPhase
                }));
            },

            getCurrentQuestion: () => {
                const { currentQuestionIndex } = get();
                const questions = get().getCurrentQuestions();
                return questions[currentQuestionIndex];
            },

            getCurrentAnswers: () => {
                const { phase, introAnswers, deepAnswers } = get();
                return phase === "intro" ? introAnswers : deepAnswers;
            },

            getProgress: () => {
                const { currentQuestionIndex } = get();
                const questions = get().getCurrentQuestions();
                return ((currentQuestionIndex + 1) / questions.length) * 100;
            },

            isLastQuestion: () => {
                const { currentQuestionIndex } = get();
                const questions = get().getCurrentQuestions();
                return currentQuestionIndex === questions.length - 1;
            },

            canSubmit: () => {
                const { isSubmitting } = get();
                const answers = get().getCurrentAnswers();
                if (isSubmitting) return false;
                return answers.every((a) => a.answer.trim().length >= 2);
            },
        }),
        {
            name: "blanknote-test",
            partialize: (state) => ({
                phase: state.phase,
                introAnswers: state.introAnswers,
                deepAnswers: state.deepAnswers,
                introResultId: state.introResultId,
            }),
        }
    )
);
