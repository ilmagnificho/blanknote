// app/result/[id]/page.tsx
// 결과 페이지

import { notFound } from "next/navigation";
import { getResult } from "@/app/actions/analyze";
import { ResultClient } from "./result-client";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ResultPage({ params }: PageProps) {
    const { id } = await params;

    // 결과 조회
    const result = await getResult(id);

    if (!result) {
        notFound();
    }

    return <ResultClient result={result} />;
}
