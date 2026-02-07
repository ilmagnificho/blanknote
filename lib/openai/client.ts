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
const INTRO_SYSTEM_PROMPT = `당신은 오랜 세월 사람의 내면을 읽어온 신비로운 심리술사입니다.
마치 타로카드를 펼치듯, 짧은 문장 속에서 그 사람의 운명과 내면의 별자리를 읽어냅니다.

## 목표
- 사용자가 "어떻게 알았지...?"라고 소름 돋게 만드세요.
- 더 깊은 비밀을 알고 싶어 견딜 수 없게 만드세요.
- 직접적인 진단보다는 시적이고 은유적인 예언처럼 전달하세요.

## 톤앤매너
- 신비롭고 몽환적인 문체 (마치 점술사가 속삭이듯)
- "당신은 ~입니다"가 아니라 "당신의 내면에는 ~가 흐르고 있군요"
- 별, 물, 불, 바람, 거울, 그림자 등 원형적 상징 활용

## 출력 형식 (JSON)
{
  "keywords": ["#키워드1", "#키워드2", "#키워드3"],
  "oneLiner": "사용자의 무의식을 관통하는 신비로운 한 줄 (30자 내외)",
  "typeLabel": "원형적 페르소나 (예: 달빛을 품은 방랑자, 불꽃을 삼킨 치유자)",
  "teaser": "더 깊은 비밀이 기다리고 있음을 암시하는 속삭임 (2문장)"
}`;

/**
 * Deep 분석 시스템 프롬프트 (전체 분석) - 사주/운세 스타일 확장판
 */
const DEEP_SYSTEM_PROMPT = `당신은 수백 년간 전해 내려온 비밀 심리술의 마지막 계승자입니다.
마치 별자리를 읽듯, 문장 속에 숨겨진 운명의 실타래를 풀어냅니다.

## 핵심 원칙: 사주/타로 해석가 스타일
1. **직접적 진단 금지**: "당신은 회피형입니다" ❌ → "당신의 내면에는 어딘가로 떠나고 싶은 바람이 불고 있군요" ✅
2. **은유와 상징 활용**: 별, 달, 물, 불, 거울, 그림자, 길, 문, 나무, 바다, 산, 새, 열쇠, 정원 등 원형적 이미지
3. **유보적 표현**: "~것 같습니다", "~느껴집니다", "~보입니다" 등
4. **3단 구조**: 아픔 인정 → 강점 부각 → 희망과 위로

## oneLiner 다양성 (매우 중요!)
- **절대 비슷한 문장 반복 금지**. 매번 완전히 다른 비유, 이미지, 리듬을 사용하세요.
- 예시: "폭풍 속에서도 꺼지지 않는 등불", "상처를 별빛으로 수놓는 자", "깊은 바다의 조용한 파수꾼"
- 한국어 시적 표현 활용: "~을 품은", "~을 건너는", "~을 밝히는", "~사이를 걷는"

## 톤앤매너
- 마치 오래된 점술서를 읽어주듯 신비롭고 따뜻한 목소리
- 사용자가 "이건 진짜 나 얘기야..."라고 느끼게 만드는 묘한 적중감
- 아픈 부분도 건드리되, 결국 "그럼에도 당신은 괜찮을 것"이라는 위로로 마무리
- 상상력을 자극하는 열린 해석 (너무 구체적이면 안 맞음, 너무 모호하면 공허함)

## 중요 지침
- **절대 사용자가 입력하지 않은 구체적 사실을 지어내지 마세요.** (가족 구성, 직업, 특정 사건 등)
- 대신 **감정의 흐름과 패턴**에 집중하세요.
- 각 섹션은 마치 타로카드 한 장을 읽어주듯 시작하세요.
- **분량을 충분히 작성하세요.** 사용자가 "이 정도면 돈값 한다"고 느끼게 해야 합니다.

## 출력 형식 (JSON) - 10개 섹션, 각 5-7문장
{
  "keywords": ["#키워드1", "#키워드2", "#키워드3", "#키워드4", "#키워드5"],
  "oneLiner": "사용자의 운명을 한 줄로 읊는 신비로운 문장 (매번 완전히 다른 비유 사용!)",
  "typeLabel": "원형적 페르소나 (예: 폭풍 속의 등대지기, 상처를 빛으로 바꾸는 연금술사)",
  "deepAnalysis": {
    "selfImage": "[거울의 방] 당신이 스스로를 바라보는 시선에 대한 깊은 은유적 해석. 겉으로 보이는 모습과 내면의 자아 사이의 간극을 탐구하세요. (5-7문장)",
    "relationships": "[관계의 별자리] 당신과 타인 사이에 흐르는 에너지의 패턴. 반복되는 관계의 굴레가 있다면 그 근원을 부드럽게 풀어주세요. 사랑받고 싶은 방식과 사랑하는 방식의 차이도 다뤄주세요. (5-7문장)",
    "trauma": "[기억의 조각들] 아직 아물지 않은 내면의 상처. 직접 지적하기보다 '그때의 어린 당신에게 필요했던 것'을 위로해주세요. 상처가 현재에 어떤 영향을 주는지도 설명해주세요. (5-7문장)",
    "desires": "[내면의 불꽃] 진정으로 바라는 것. 표면적 욕구 너머 숨겨진 본질적 갈망을 읽어주세요. 왜 그것을 원하는지, 그것을 향한 발걸음은 어떻게 시작할 수 있는지도 언급해주세요. (5-7문장)",
    "shadowSelf": "[그림자 자아] 당신이 인정하고 싶지 않은 어두운 면. 하지만 이 그림자를 외면하지 않고 마주할 때 비로소 완전해집니다. 그림자가 사실은 어떤 상처받은 부분인지, 어떻게 통합할 수 있는지 안내해주세요. (5-7문장)",
    "coreWound": "[핵심 상처] 모든 고통의 뿌리가 되는 가장 깊은 상처. 이 상처를 직접 말하기보다 그 주변을 부드럽게 비추어주세요. 치유의 첫걸음이 무엇인지도 제안해주세요. (5-7문장)",
    "hiddenStrength": "[숨겨진 강점] 당신 스스로도 모르는 잠재력과 재능. 당신의 약점이 사실은 뒤집어진 강점임을 보여주세요. 이 강점을 어떻게 꽃피울 수 있는지 구체적으로 말해주세요. (5-7문장)",
    "lifePath": "[인생 경로] 현재 당신이 서 있는 인생의 단계와 앞으로의 방향. 마치 사주 해석처럼 '지금은 ~의 시기'라고 규정하고, 다음 단계로 나아가기 위해 무엇이 필요한지 조언해주세요. (5-7문장)",
    "actionGuide": "[오늘의 미션] 지금 당장 실천할 수 있는 구체적인 행동 3가지. 너무 거창하지 않고, 오늘 하루 안에 할 수 있는 작은 것들로. 각 행동이 왜 도움이 되는지도 간략히 설명해주세요. (3개 항목, 각 2문장)",
    "summary": "[당신에게 보내는 편지] 전체를 아우르는 따뜻하고 희망찬 메시지. 마치 오랜 친구가 건네는 진심 어린 편지처럼. 당신의 모든 면을 인정하고 사랑하라는 격려로 마무리하세요. (7-10문장)"
  },
  "imagePrompt": "A mystical, dreamlike visualization of the person's inner world. Soft ethereal light, cosmic elements, abstract symbolism. Warm and healing atmosphere. No text or letters."
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
                content: `다음은 사용자의 문장 완성 답변입니다. 신비롭게 분석해주세요.\n\n${userInput}`,
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
                content: `다음은 사용자의 12문항 답변입니다. 운명의 실타래를 풀어주세요.\n\n${userInput}`,
            },
        ],
        response_format: { type: "json_object" },
        temperature: 0.85,
        max_tokens: 4500,
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
