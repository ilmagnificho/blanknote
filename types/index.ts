// types/index.ts
// Blanknote 프로젝트 TypeScript 타입 정의

/**
 * 테스트 단계
 */
export type TestPhase = "intro" | "deep";

/**
 * SCT 문장완성검사 문항
 */
export interface SCTQuestion {
  id: number;
  prompt: string; // 예: "만약 내가 다시 태어난다면"
  phase: TestPhase; // intro 또는 deep
}

/**
 * 사용자가 입력한 SCT 답변
 */
export interface SCTAnswer {
  questionId: number;
  prompt: string;
  answer: string;
}

/**
 * Intro 분석 결과 (무료 티저)
 */
export interface IntroAnalysisResult {
  keywords: string[]; // 3개의 해시태그 키워드
  oneLiner: string; // 한 줄 분석 (팩트 폭력)
  typeLabel: string; // 유형 라벨 (예: "회피형 완벽주의자")
  teaser: string; // 티저 설명 (2-3문장)
}

/**
 * 전체 분석 결과 (유료)
 */
export interface FullAnalysisResult {
  // Intro 결과 포함
  keywords: string[];
  oneLiner: string;
  typeLabel: string;

  // Deep 분석 결과
  deepAnalysis: {
    selfImage: string; // 자아 분석
    relationships: string; // 대인관계 분석
    trauma: string; // 트라우마/억압된 감정
    desires: string; // 숨겨진 욕구
    summary: string; // 종합 분석
  };

  // DALL-E 3 이미지 생성용 프롬프트
  imagePrompt: string;
}

/**
 * GPT-4o가 생성한 심리 분석 결과 (기존 호환)
 */
export interface AnalysisResult {
  keywords: string[];
  oneLiner: string;
  typeLabel?: string;
  teaser?: string;

  deepAnalysis: {
    selfImage: string;
    relationships: string;
    trauma: string;
    desires?: string;
    summary: string;
  };

  imagePrompt: string;
}

/**
 * Supabase results 테이블 레코드
 */
export interface Result {
  id: string; // uuid
  phase: TestPhase; // 현재 단계
  intro_answers: SCTAnswer[] | null; // Intro 답변
  deep_answers: SCTAnswer[] | null; // Deep 답변
  answers: SCTAnswer[]; // jsonb (기존 호환)
  intro_analysis: IntroAnalysisResult | null; // Intro 분석 결과
  analysis_text: AnalysisResult | null; // 전체 분석 결과
  image_url: string | null; // DALL-E 3 생성 이미지 URL
  is_paid: boolean; // 결제 여부
  created_at: string; // timestamp
}

/**
 * 분석 API 요청 타입
 */
export interface AnalyzeRequest {
  answers: SCTAnswer[];
  phase: TestPhase;
}

/**
 * 분석 API 응답 타입
 */
export interface AnalyzeResponse {
  success: boolean;
  resultId?: string;
  error?: string;
}

/**
 * 로딩 상태 메시지
 */
export const LOADING_MESSAGES = [
  "단어 선택의 뉘앙스 분석 중...",
  "문장 구조에서 숨겨진 패턴 탐색 중...",
  "억압된 방어기제 스캔 중...",
  "무의식 속 키워드 추출 중...",
  "당신의 그림자(Shadow) 형상화 중...",
  "심리적 투사(Projection) 분석 중...",
  "무의식 형상화(Rendering) 시작...",
  "최종 리포트 생성 중...",
] as const;

/**
 * Intro 문항 (5개) - 무료
 */
export const INTRO_QUESTIONS: SCTQuestion[] = [
  { id: 1, prompt: "만약 내가 다시 태어난다면", phase: "intro" },
  { id: 2, prompt: "나의 어머니는", phase: "intro" },
  { id: 3, prompt: "사람들이 나를 피하는 이유는", phase: "intro" },
  { id: 4, prompt: "내가 가장 두려워하는 것은", phase: "intro" },
  { id: 5, prompt: "사실 나는", phase: "intro" },
];

/**
 * Deep 문항 (7개) - 유료 잠금 해제 후
 */
export const DEEP_QUESTIONS: SCTQuestion[] = [
  { id: 6, prompt: "나를 가장 화나게 하는 것은", phase: "deep" },
  { id: 7, prompt: "아무도 모르지만 나는", phase: "deep" },
  { id: 8, prompt: "내가 가장 후회하는 것은", phase: "deep" },
  { id: 9, prompt: "나의 아버지는", phase: "deep" },
  { id: 10, prompt: "다른 사람들은 모르지만 나는", phase: "deep" },
  { id: 11, prompt: "10년 후의 나는", phase: "deep" },
  { id: 12, prompt: "내 인생에서 가장 중요한 것은", phase: "deep" },
];

/**
 * 기존 호환용 (deprecated)
 */
export const SCT_QUESTIONS = INTRO_QUESTIONS;

/**
 * 가격 정보
 */
export const PRICING = {
  KRW: 4900,
  USD: 3.9,
} as const;
