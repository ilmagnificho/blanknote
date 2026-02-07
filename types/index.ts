// types/index.ts
// Blanknote 프로젝트 TypeScript 타입 정의

/**
 * SCT 문장완성검사 문항
 */
export interface SCTQuestion {
  id: number;
  prompt: string; // 예: "만약 내가 다시 태어난다면"
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
 * GPT-4o가 생성한 심리 분석 결과
 */
export interface AnalysisResult {
  // 무료 결과
  keywords: string[]; // 3개의 해시태그 키워드 (예: "#유리멘탈", "#가면증후군")
  oneLiner: string; // 한 줄 분석 (팩트 폭력)
  
  // 유료 결과 (Blur 처리됨)
  deepAnalysis: {
    selfImage: string; // 자아 분석
    relationships: string; // 대인관계 분석
    trauma: string; // 트라우마/억압된 감정
    summary: string; // 종합 분석
  };
  
  // DALL-E 3 이미지 생성용 프롬프트
  imagePrompt: string;
}

/**
 * Supabase results 테이블 레코드
 */
export interface Result {
  id: string; // uuid
  answers: SCTAnswer[]; // jsonb
  analysis_text: AnalysisResult; // jsonb (분석 결과 전체)
  image_url: string | null; // DALL-E 3 생성 이미지 URL
  is_paid: boolean; // 결제 여부
  created_at: string; // timestamp
}

/**
 * 분석 API 요청 타입
 */
export interface AnalyzeRequest {
  answers: SCTAnswer[];
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
 * SCT 기본 문항 (5개)
 */
export const SCT_QUESTIONS: SCTQuestion[] = [
  { id: 1, prompt: "만약 내가 다시 태어난다면" },
  { id: 2, prompt: "나의 어머니는" },
  { id: 3, prompt: "사람들이 나를 피하는 이유는" },
  { id: 4, prompt: "내가 가장 두려워하는 것은" },
  { id: 5, prompt: "사실 나는" },
];
