// app/actions/analyze.ts
// SCT 분석 Server Actions
"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { analyzeSCTAnswers, generateUnconsciousImage } from "@/lib/openai/client";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";
import type { SCTAnswer, AnalyzeResponse, Result } from "@/types";
import { headers } from "next/headers";

/**
 * SCT 답변을 분석하고 결과를 저장하는 Server Action
 * @param answers - 사용자가 입력한 SCT 답변 배열
 * @returns 분석 결과 ID 또는 에러
 */
export async function analyzeAndSave(
    answers: SCTAnswer[]
): Promise<AnalyzeResponse> {
    try {
        // 1. Rate Limit 체크
        const headersList = await headers();
        const clientIP = getClientIP(headersList);
        const rateLimit = checkRateLimit(clientIP);

        if (!rateLimit.allowed) {
            return {
                success: false,
                error: `무의식 접속 과부하! ${rateLimit.resetInSeconds}초 후 다시 시도해주세요.`,
            };
        }

        // 2. 입력 검증
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
                error: "너무 짧은 답변이 있어요. 조금 더 구체적으로 작성해주세요.",
            };
        }

        // 3. GPT-4o 분석
        const analysisResult = await analyzeSCTAnswers(answers);

        // 4. DALL-E 3 이미지 생성
        let imageUrl: string | null = null;
        try {
            imageUrl = await generateUnconsciousImage(analysisResult.imagePrompt);
        } catch (imageError) {
            console.error("이미지 생성 실패:", imageError);
            // 이미지 생성 실패해도 분석 결과는 저장
        }

        // 5. Supabase에 결과 저장
        const supabase = await createServiceClient();

        const { data, error: dbError } = await supabase
            .from("results")
            .insert({
                answers: answers,
                analysis_text: analysisResult,
                image_url: imageUrl,
                is_paid: false,
            })
            .select("id")
            .single();

        if (dbError) {
            console.error("DB 저장 실패:", dbError);
            return {
                success: false,
                error: "무의식 저장에 실패했습니다. 다시 시도해주세요.",
            };
        }

        return {
            success: true,
            resultId: data.id,
        };
    } catch (error) {
        console.error("분석 중 오류:", error);

        // 사용자 친화적인 에러 메시지
        if (error instanceof Error) {
            if (error.message.includes("rate_limit")) {
                return {
                    success: false,
                    error: "AI가 바빠요. 잠시 후 다시 시도해주세요.",
                };
            }
            if (error.message.includes("insufficient_quota")) {
                return {
                    success: false,
                    error: "무의식 탐색 에너지가 부족합니다. 관리자에게 문의해주세요.",
                };
            }
        }

        return {
            success: false,
            error: "무의식 접속에 실패했습니다. 다시 시도해주세요.",
        };
    }
}

/**
 * 결과 ID로 분석 결과 조회
 * @param resultId - 결과 UUID
 * @returns 결과 데이터 또는 null
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
 * 결제 완료 후 is_paid 상태 업데이트
 * @param resultId - 결과 UUID
 * @returns 성공 여부
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
