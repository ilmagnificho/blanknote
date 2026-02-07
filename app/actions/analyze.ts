// app/actions/analyze.ts
// SCT 분석 Server Actions (2단계 퍼널)
"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { analyzeIntroAnswers, analyzeDeepAnswers, generateUnconsciousImage } from "@/lib/openai/client";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";
import type { SCTAnswer, AnalyzeResponse, Result, IntroAnalysisResult } from "@/types";
import { headers } from "next/headers";

/**
 * Intro 단계: 5문항 분석 및 티저 결과 생성
 */
export async function analyzeIntro(
    answers: SCTAnswer[]
): Promise<AnalyzeResponse> {
    try {
        // Rate Limit 체크
        const headersList = await headers();
        const clientIP = getClientIP(headersList);
        const rateLimit = checkRateLimit(clientIP);

        if (!rateLimit.allowed) {
            return {
                success: false,
                error: `잠시 후 다시 시도해주세요. (${rateLimit.resetInSeconds}초)`,
            };
        }

        // 입력 검증
        if (!answers || answers.length < 5) {
            return {
                success: false,
                error: "모든 문항에 답변해주세요.",
            };
        }

        const hasEmptyAnswer = answers.some(
            (a) => !a.answer || a.answer.trim().length < 2
        );
        if (hasEmptyAnswer) {
            return {
                success: false,
                error: "너무 짧은 답변이 있어요.",
            };
        }

        // GPT-4o Intro 분석
        const introAnalysis = await analyzeIntroAnswers(answers);

        // Supabase에 결과 저장
        const supabase = await createServiceClient();

        const { data, error: dbError } = await supabase
            .from("results")
            .insert({
                phase: "intro",
                intro_answers: answers,
                intro_analysis: introAnalysis,
                answers: answers, // 기존 호환
                analysis_text: null,
                image_url: null,
                is_paid: false,
            })
            .select("id")
            .single();

        if (dbError) {
            console.error("DB 저장 실패:", dbError);
            return {
                success: false,
                error: "저장에 실패했습니다. 다시 시도해주세요.",
            };
        }

        return {
            success: true,
            resultId: data.id,
        };
    } catch (error) {
        console.error("Intro 분석 중 오류:", error);
        return {
            success: false,
            error: "분석에 실패했습니다. 잠시 후 다시 시도해주세요.",
        };
    }
}

/**
 * Deep 단계: 추가 7문항 분석 및 전체 결과 생성 (결제 필요)
 */
export async function analyzeDeep(
    resultId: string,
    deepAnswers: SCTAnswer[]
): Promise<AnalyzeResponse> {
    try {
        const supabase = await createServiceClient();

        // 기존 결과 조회
        const { data: existingResult, error: fetchError } = await supabase
            .from("results")
            .select("*")
            .eq("id", resultId)
            .single();

        if (fetchError || !existingResult) {
            return {
                success: false,
                error: "결과를 찾을 수 없습니다.",
            };
        }

        // 입력 검증
        if (!deepAnswers || deepAnswers.length < 7) {
            return {
                success: false,
                error: "모든 문항에 답변해주세요.",
            };
        }

        // GPT-4o Deep 분석
        const introAnswers = existingResult.intro_answers as SCTAnswer[];
        const fullAnalysis = await analyzeDeepAnswers(introAnswers, deepAnswers);

        // 결과 업데이트 (이미지는 결제 후 생성)
        const { error: updateError } = await supabase
            .from("results")
            .update({
                phase: "deep",
                deep_answers: deepAnswers,
                answers: [...introAnswers, ...deepAnswers],
                analysis_text: fullAnalysis,
            })
            .eq("id", resultId);

        if (updateError) {
            console.error("DB 업데이트 실패:", updateError);
            return {
                success: false,
                error: "저장에 실패했습니다.",
            };
        }

        return {
            success: true,
            resultId: resultId,
        };
    } catch (error) {
        console.error("Deep 분석 중 오류:", error);
        return {
            success: false,
            error: "분석에 실패했습니다. 잠시 후 다시 시도해주세요.",
        };
    }
}

/**
 * 결제 완료 후 이미지 생성
 */
export async function generateImageAfterPayment(
    resultId: string
): Promise<{ success: boolean; imageUrl?: string; error?: string }> {
    try {
        const supabase = await createServiceClient();

        // 결과 조회
        const { data: result } = await supabase
            .from("results")
            .select("analysis_text")
            .eq("id", resultId)
            .single();

        if (!result?.analysis_text?.imagePrompt) {
            return { success: false, error: "이미지 프롬프트를 찾을 수 없습니다." };
        }

        // DALL-E 이미지 생성
        const tempImageUrl = await generateUnconsciousImage(result.analysis_text.imagePrompt);

        // TODO: Supabase Storage에 이미지 저장 및 영구 URL 생성
        // 현재는 임시 URL 저장 (1시간 만료)

        // DB 업데이트
        const { error: updateError } = await supabase
            .from("results")
            .update({
                image_url: tempImageUrl,
                is_paid: true,
            })
            .eq("id", resultId);

        if (updateError) {
            return { success: false, error: "이미지 저장 실패" };
        }

        return { success: true, imageUrl: tempImageUrl };
    } catch (error) {
        console.error("이미지 생성 실패:", error);
        return { success: false, error: "이미지 생성에 실패했습니다." };
    }
}

/**
 * 결과 ID로 분석 결과 조회
 */
export async function getResult(resultId: string): Promise<Result | null> {
    try {
        const supabase = await createServiceClient();

        const { data, error } = await supabase
            .from("results")
            .select("*")
            .eq("id", resultId)
            .single();

        if (error || !data) {
            return null;
        }

        return data as Result;
    } catch {
        return null;
    }
}

/**
 * Intro 분석 결과만 조회
 */
export async function getIntroResult(resultId: string): Promise<{
    id: string;
    intro_analysis: IntroAnalysisResult;
} | null> {
    try {
        const supabase = await createServiceClient();

        const { data, error } = await supabase
            .from("results")
            .select("id, intro_analysis")
            .eq("id", resultId)
            .single();

        if (error || !data) {
            return null;
        }

        return data as { id: string; intro_analysis: IntroAnalysisResult };
    } catch {
        return null;
    }
}

/**
 * 결제 완료 후 is_paid 상태 업데이트
 */
export async function markAsPaid(resultId: string): Promise<boolean> {
    try {
        const supabase = await createServiceClient();

        const { error } = await supabase
            .from("results")
            .update({ is_paid: true })
            .eq("id", resultId);

        return !error;
    } catch {
        return false;
    }
}

// 기존 호환용
export async function analyzeAndSave(answers: SCTAnswer[]) {
    return analyzeIntro(answers);
}
