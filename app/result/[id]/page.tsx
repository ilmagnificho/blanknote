// app/result/[id]/page.tsx
// 결과 페이지

import { notFound } from "next/navigation";
import { getResult } from "@/app/actions/analyze";
import { ResultClient } from "./result-client";

interface PageProps {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ResultPage({ params, searchParams }: PageProps) {
    const { id } = await params;
    const search = await searchParams;

    // 결과 조회
    const result = await getResult(id);

    if (!result) {
        notFound();
    }

    // 개발자 모드: ?dev=true면 유료 결과로 표시
    const isDevMode = search.dev === "true";
    const displayResult = isDevMode
        ? { ...result, is_paid: true }
        : result;

    return <ResultClient result={displayResult} />;
}
