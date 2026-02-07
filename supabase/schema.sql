-- Blanknote Supabase 스키마
-- Supabase SQL Editor에서 실행하세요

-- results 테이블: SCT 분석 결과 저장
CREATE TABLE IF NOT EXISTS results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  answers JSONB NOT NULL, -- 사용자가 입력한 5~7개 문장 답변
  analysis_text JSONB NOT NULL, -- GPT-4o 분석 결과 (키워드, 한줄평, 상세분석)
  image_url TEXT, -- DALL-E 3 생성 이미지 URL
  is_paid BOOLEAN DEFAULT FALSE, -- 결제 여부
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스: is_paid 컬럼 (결제 여부로 필터링 시 성능 향상)
CREATE INDEX IF NOT EXISTS idx_results_is_paid ON results(is_paid);

-- 인덱스: created_at 컬럼 (최신순 정렬 시 성능 향상)
CREATE INDEX IF NOT EXISTS idx_results_created_at ON results(created_at DESC);

-- RLS (Row Level Security) 활성화
-- 참고: 이 서비스는 로그인 없이 사용하므로, 
-- 결과 조회는 ID를 알아야만 가능하도록 설계
ALTER TABLE results ENABLE ROW LEVEL SECURITY;

-- 읽기 정책: 모든 사용자가 ID로 조회 가능
CREATE POLICY "결과 조회 허용" ON results
  FOR SELECT
  USING (true);

-- 쓰기 정책: 서버에서만 삽입 가능 (Service Role 사용)
-- 클라이언트에서의 직접 삽입 차단
CREATE POLICY "서버에서만 삽입 허용" ON results
  FOR INSERT
  WITH CHECK (false);

-- 업데이트 정책: 서버에서만 업데이트 가능 (결제 완료 시 is_paid 변경)
CREATE POLICY "서버에서만 업데이트 허용" ON results
  FOR UPDATE
  USING (false);

-- 삭제 정책: 삭제 불가
CREATE POLICY "삭제 불가" ON results
  FOR DELETE
  USING (false);
