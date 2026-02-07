// lib/openai/client.ts
// OpenAI API 클라이언트

import OpenAI from "openai";
import type { AnalysisResult, SCTAnswer } from "@/types";

// OpenAI 클라이언트 인스턴스 (lazy 초기화)
let openaiInstance: OpenAI | null = null;

function getOpenAI(): OpenAI {
    if (!openaiInstance) {
        openaiInstance = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }
    return openaiInstance;
}

/**
 * 심리 분석 시스템 프롬프트
 * 프로이트 + 셜록 홈즈 스타일의 냉철한 심리학자
 */
const SYSTEM_PROMPT = `당신은 프로이트의 통찰력과 셜록 홈즈의 관찰력을 가진 냉철한 심리학자입니다.

## 역할 및 톤
- 따뜻한 위로보다는 **정곡을 찌르는(Insightful)** 톤을 유지하세요.
- ingan.ai처럼 약간은 시니컬하고 유머러스한 "팩트 폭력" 스타일을 구사하세요.
- 사용자의 답변에서 논리적 모순이나 반복되는 단어를 찾아내어 근거로 제시하세요.
- 한국어로 응답하세요.

## 분석 방법
1. 문장완성검사(SCT) 답변에서 투사(Projection), 방어기제(Defense Mechanism), 억압(Repression)의 흔적을 찾으세요.
2. 반복되는 주제나 키워드에 주목하세요.
3. 답변의 길이, 구체성, 감정 표현 수준도 분석 요소입니다.
4. 회피하거나 짧게 답한 문항은 특히 중요한 단서입니다.

## 출력 형식 (JSON)
반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트는 포함하지 마세요.

{
  "keywords": ["#키워드1", "#키워드2", "#키워드3"],
  "oneLiner": "뼈를 때리는 한 줄 분석 (팩트 폭력)",
  "deepAnalysis": {
    "selfImage": "자아 이미지 분석 (2-3문장)",
    "relationships": "대인관계 패턴 분석 (2-3문장)",
    "trauma": "숨겨진 상처/트라우마 분석 (2-3문장)",
    "summary": "종합 심리 분석 (3-4문장)"
  },
  "imagePrompt": "DALL-E 3를 위한 무의식 시각화 프롬프트 (영어, 추상적이고 몽환적인 스타일)"
}`;

/**
 * SCT 답변을 분석하여 심리 분석 결과 생성
 * @param answers - 사용자가 입력한 SCT 답변 배열
 * @returns 분석 결과 객체
 */
export async function analyzeSCTAnswers(
    answers: SCTAnswer[]
): Promise<AnalysisResult> {
    // 사용자 입력을 문자열로 변환
    const userInput = answers
        .map((a) => `"${a.prompt}" → "${a.answer}"`)
        .join("\n");

    const response = await getOpenAI().chat.completions.create({
        model: "gpt-4o",
        messages: [
            { role: "system", content: SYSTEM_PROMPT },
            {
                role: "user",
                content: `다음은 사용자의 문장완성검사(SCT) 답변입니다. 분석해주세요.\n\n${userInput}`,
            },
        ],
        response_format: { type: "json_object" },
        temperature: 0.8, // 약간의 창의성 허용
        max_tokens: 2000,
    });

    const content = response.choices[0].message.content;
    if (!content) {
        throw new Error("GPT-4o 응답이 비어있습니다.");
    }

    const result = JSON.parse(content) as AnalysisResult;
    return result;
}

/**
 * DALL-E 3를 사용하여 무의식 시각화 이미지 생성
 * @param imagePrompt - GPT-4o가 생성한 이미지 프롬프트
 * @returns 생성된 이미지 URL
 */
export async function generateUnconsciousImage(
    imagePrompt: string
): Promise<string> {
    // 스타일 가이드 추가
    const fullPrompt = `${imagePrompt}

Style: Surrealist, dreamlike, abstract expressionism. 
Mood: Mysterious, introspective, ethereal.
Colors: Deep jewel tones with ethereal highlights.
Medium: Digital art, oil painting texture.
No text or letters in the image.`;

    const response = await getOpenAI().images.generate({
        model: "dall-e-3",
        prompt: fullPrompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        style: "vivid",
    });

    const imageUrl = response.data?.[0]?.url;
    if (!imageUrl) {
        throw new Error("DALL-E 3 이미지 생성에 실패했습니다.");
    }

    return imageUrl;
}

export { getOpenAI };
