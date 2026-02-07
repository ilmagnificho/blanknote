// app/teaser/[id]/page.tsx
// 티저 결과 페이지 - Intro 분석 결과 표시

import { notFound, redirect } from "next/navigation";
import { getResult } from "@/app/actions/analyze";
import { TeaserClient } from "./teaser-client";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function TeaserPage({ params }: PageProps) {
    const { id } = await params;
    const result = await getResult(id);

    if (!result) {
        notFound();
    }

    // 이미 Deep 분석을 완료해서 결제 대기 중이라면 결과 페이지로
    if (result.phase === "deep" && result.analysis_text) {
        redirect(`/result/${id}`);
    }

    return <TeaserClient result={result} />;
}
