// lib/openai/client.ts
// OpenAI API 클라이언트

import OpenAI from "openai";
import type { AnalysisResult, IntroAnalysisResult, SCTAnswer } from "@/types";

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
 * Intro 분석 시스템 프롬프트 (티저용 - 간단한 분석)
 */
const INTRO_SYSTEM_PROMPT = `당신은 사람의 무의식 깊은 곳을 엿보는 신비로운 심리 탐험가입니다.
5개의 짧은 문장완성검사(SCT) 답변만으로 사용자의 내면을 감각적으로 포착해야 합니다.

## 목표
- 사용자가 "어? 어떻게 알았지?"라고 놀라게 만드세요.
- 더 알고 싶어서 견딜 수 없게 만드세요.
- 딱딱한 진단이 아니라, 한 편의 시(Poetry)처럼 아름답고 미스터리한 문장을 구사하세요.

## 톤앤매너
- 몽환적이고, 은유적이며, 핵심을 관통하는 통찰력.
- "당신은 ~입니다"가 아니라 "당신의 내면에는 ~가 숨 쉬고 있군요"와 같은 서술형.

## 출력 형식 (JSON)
{
  "keywords": ["#키워드1", "#키워드2", "#키워드3"],
  "oneLiner": "사용자의 무의식을 관통하는 시적인 한 줄 (30자 내외)",
  "typeLabel": "심리적 페르소나 (예: 고독한 몽상가, 상처 입은 치유자)",
  "teaser": "더 깊은 분석이 필요한 이유를 속삭이듯 말해주세요 (2문장)"
}`;

/**
 * Deep 분석 시스템 프롬프트 (전체 분석)
 */
const DEEP_SYSTEM_PROMPT = `당신은 지친 마음을 어루만져 주는 따뜻한 심리 치유사입니다.
사용자가 자신의 내면을 마주하는 이 과정이 '두려움'이 아닌 '나를 찾아가는 소중한 여정'으로 느껴지도록 이끌어주세요.

## 목표
- 날카로운 분석보다는, **"당신은 혼자가 아닙니다"**라는 깊은 공감과 위로를 전달하세요.
- 사용자가 스스로를 더 사랑하고 아껴줄 수 있는 계기를 마련해주세요.
- 분석 결과는 마치 오랜 친구가 건네는 따뜻한 편지처럼 느껴져야 합니다.

## 톤앤매너
- 부드럽고 서정적인 문체 사용 (예: "~한 것 같네요", "~마음이 전해집니다").
- 아픈 부분을 지적할 때도 "상처"라고 부르기보다 "아직 아물지 않은 기억"처럼 보듬어주는 표현을 쓰세요.
- 전문 용어는 최소화하고, 감성적인 비유를 적극 활용하세요.

## 출력 형식 (JSON)
{
  "keywords": ["#키워드1", "#키워드2", "#키워드3"],
  "oneLiner": "사용자의 마음을 따뜻하게 감싸주는 한 줄",
  "typeLabel": "감성적인 페르소나 이름 (예: 별을 품은 여행자)",
  "deepAnalysis": {
    "selfImage": "나를 바라보는 시선: 자아상에 대한 따뜻한 해석 (3-4문장)",
    "relationships": "마음의 연결: 관계 속에서의 바람과 어려움 공감 (3-4문장)",
    "trauma": "기억의 조각들: 조심스럽게 마주하는 내면의 그림자 (3-4문장)",
    "desires": "내면의 빛: 진정으로 바라는 행복과 꿈 (2-3문장)",
    "summary": "당신에게 보내는 편지: 전체적인 위로와 희망의 메시지 (4-5문장)"
  },
  "imagePrompt": "A healing and comforting visual representation of the user's inner world. Soft, warm colors, peaceful atmosphere, abstract art style. No text."
}`;

/**
 * Intro 답변 분석 (티저 생성)
 */
export async function analyzeIntroAnswers(
    answers: SCTAnswer[]
): Promise<IntroAnalysisResult> {
    const userInput = answers
        .map((a) => `"${a.prompt}" → "${a.answer}"`)
        .join("\n");

    const response = await getOpenAI().chat.completions.create({
        model: "gpt-4o",
        messages: [
            { role: "system", content: INTRO_SYSTEM_PROMPT },
            {
                role: "user",
                content: `다음은 사용자의 문장완성검사(SCT) 답변입니다. 간단히 분석해주세요.\n\n${userInput}`,
            },
        ],
        response_format: { type: "json_object" },
        temperature: 0.8,
        max_tokens: 500,
    });

    const content = response.choices[0].message.content;
    if (!content) {
        throw new Error("GPT-4o 응답이 비어있습니다.");
    }

    return JSON.parse(content) as IntroAnalysisResult;
}

/**
 * Deep 분석 (Intro + Deep 답변 모두 활용)
 */
export async function analyzeDeepAnswers(
    introAnswers: SCTAnswer[],
    deepAnswers: SCTAnswer[]
): Promise<AnalysisResult> {
    const allAnswers = [...introAnswers, ...deepAnswers];
    const userInput = allAnswers
        .map((a) => `"${a.prompt}" → "${a.answer}"`)
        .join("\n");

    const response = await getOpenAI().chat.completions.create({
        model: "gpt-4o",
        messages: [
            { role: "system", content: DEEP_SYSTEM_PROMPT },
            {
                role: "user",
                content: `다음은 사용자의 문장완성검사(SCT) 12문항 답변입니다. 깊이 있게 분석해주세요.\n\n${userInput}`,
            },
        ],
        response_format: { type: "json_object" },
        temperature: 0.8,
        max_tokens: 2500,
    });

    const content = response.choices[0].message.content;
    if (!content) {
        throw new Error("GPT-4o 응답이 비어있습니다.");
    }

    return JSON.parse(content) as AnalysisResult;
}

/**
 * 기존 호환용 (deprecated)
 */
export async function analyzeSCTAnswers(
    answers: SCTAnswer[]
): Promise<AnalysisResult> {
    return analyzeDeepAnswers(answers.slice(0, 5), answers.slice(5));
}

/**
 * DALL-E 3를 사용하여 무의식 시각화 이미지 생성
 */
export async function generateUnconsciousImage(
    imagePrompt: string
): Promise<string> {
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
