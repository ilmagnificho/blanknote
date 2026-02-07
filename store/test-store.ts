// store/test-store.ts
// Zustand 상태 관리 - SCT 테스트 진행 상태

import { create } from "zustand";
import type { SCTAnswer, SCTQuestion } from "@/types";
import { SCT_QUESTIONS } from "@/types";

interface TestState {
    // 상태
    currentQuestionIndex: number;
    answers: SCTAnswer[];
    isSubmitting: boolean;
    isComplete: boolean;
    resultId: string | null;
    error: string | null;

    // 액션
    setAnswer: (questionId: number, answer: string) => void;
    nextQuestion: () => void;
    prevQuestion: () => void;
    goToQuestion: (index: number) => void;
    setSubmitting: (isSubmitting: boolean) => void;
    setComplete: (resultId: string) => void;
    setError: (error: string | null) => void;
    reset: () => void;

    // Getters
    getCurrentQuestion: () => SCTQuestion;
    getProgress: () => number;
    isLastQuestion: () => boolean;
    canSubmit: () => boolean;
}

const initialState = {
    currentQuestionIndex: 0,
    answers: SCT_QUESTIONS.map((q) => ({
        questionId: q.id,
        prompt: q.prompt,
        answer: "",
    })),
    isSubmitting: false,
    isComplete: false,
    resultId: null,
    error: null,
};

export const useTestStore = create<TestState>((set, get) => ({
    ...initialState,

    setAnswer: (questionId: number, answer: string) => {
        set((state) => ({
            answers: state.answers.map((a) =>
                a.questionId === questionId ? { ...a, answer } : a
            ),
        }));
    },

    nextQuestion: () => {
        set((state) => ({
            currentQuestionIndex: Math.min(
                state.currentQuestionIndex + 1,
                SCT_QUESTIONS.length - 1
            ),
        }));
    },

    prevQuestion: () => {
        set((state) => ({
            currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0),
        }));
    },

    goToQuestion: (index: number) => {
        if (index >= 0 && index < SCT_QUESTIONS.length) {
            set({ currentQuestionIndex: index });
        }
    },

    setSubmitting: (isSubmitting: boolean) => {
        set({ isSubmitting, error: null });
    },

    setComplete: (resultId: string) => {
        set({ isComplete: true, resultId, isSubmitting: false });
    },

    setError: (error: string | null) => {
        set({ error, isSubmitting: false });
    },

    reset: () => {
        set(initialState);
    },

    getCurrentQuestion: () => {
        const { currentQuestionIndex } = get();
        return SCT_QUESTIONS[currentQuestionIndex];
    },

    getProgress: () => {
        const { currentQuestionIndex } = get();
        return ((currentQuestionIndex + 1) / SCT_QUESTIONS.length) * 100;
    },

    isLastQuestion: () => {
        const { currentQuestionIndex } = get();
        return currentQuestionIndex === SCT_QUESTIONS.length - 1;
    },

    canSubmit: () => {
        const { answers, isSubmitting } = get();
        if (isSubmitting) return false;
        return answers.every((a) => a.answer.trim().length >= 2);
    },
}));
