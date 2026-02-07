-- Blanknote Supabase 스키마 (2단계 퍼널 지원)
-- Supabase SQL Editor에서 실행하세요

-- results 테이블: SCT 분석 결과 저장
CREATE TABLE IF NOT EXISTS results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- 2단계 퍼널 지원
  phase TEXT DEFAULT 'intro', -- 'intro' | 'deep'
  intro_answers JSONB, -- Intro 5문항 답변
  deep_answers JSONB, -- Deep 7문항 답변
  intro_analysis JSONB, -- Intro 분석 결과 (티저)
  
  -- 기존 호환
  answers JSONB NOT NULL, -- 전체 답변 (기존 호환)
  analysis_text JSONB, -- 전체 분석 결과 (Deep 완료 후)
  
  image_url TEXT, -- DALL-E 3 생성 이미지 URL
  is_paid BOOLEAN DEFAULT FALSE, -- 결제 여부
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 마이그레이션: 기존 테이블에 새 컬럼 추가
-- 이미 테이블이 존재하는 경우 아래 ALTER 명령을 실행하세요:
/*
ALTER TABLE results ADD COLUMN IF NOT EXISTS phase TEXT DEFAULT 'intro';
ALTER TABLE results ADD COLUMN IF NOT EXISTS intro_answers JSONB;
ALTER TABLE results ADD COLUMN IF NOT EXISTS deep_answers JSONB;
ALTER TABLE results ADD COLUMN IF NOT EXISTS intro_analysis JSONB;
ALTER TABLE results ALTER COLUMN analysis_text DROP NOT NULL;
*/

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_results_is_paid ON results(is_paid);
CREATE INDEX IF NOT EXISTS idx_results_created_at ON results(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_results_phase ON results(phase);

-- RLS (Row Level Security) 활성화
ALTER TABLE results ENABLE ROW LEVEL SECURITY;

-- 읽기 정책: 모든 사용자가 ID로 조회 가능
DROP POLICY IF EXISTS "결과 조회 허용" ON results;
CREATE POLICY "결과 조회 허용" ON results
  FOR SELECT
  USING (true);

-- 쓰기 정책: 서버에서만 (Service Role 사용)
DROP POLICY IF EXISTS "서버에서만 삽입 허용" ON results;
CREATE POLICY "서버에서만 삽입 허용" ON results
  FOR INSERT
  WITH CHECK (false);

DROP POLICY IF EXISTS "서버에서만 업데이트 허용" ON results;
CREATE POLICY "서버에서만 업데이트 허용" ON results
  FOR UPDATE
  USING (false);

DROP POLICY IF EXISTS "삭제 불가" ON results;
CREATE POLICY "삭제 불가" ON results
  FOR DELETE
  USING (false);
