// app/robots.ts
// SEO - robots.txt 생성

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://blanknote.xyz";

    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/api/", "/result/*/paid"], // API 및 유료 결과 페이지 차단
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
