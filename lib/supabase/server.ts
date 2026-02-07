// lib/supabase/server.ts
// 서버용 Supabase 클라이언트

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * 서버에서 사용하는 Supabase 클라이언트
 * Server Actions, Route Handlers에서 사용
 */
export async function createClient() {
    const cookieStore = await cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // Server Component에서는 쿠키 설정 불가
                        // Server Actions/Route Handlers에서만 가능
                    }
                },
            },
        }
    );
}

/**
 * 관리자 권한이 필요한 작업을 위한 Service Role 클라이언트
 * RLS를 우회해야 할 때 사용 (주의해서 사용)
 */
export async function createServiceClient() {
    const cookieStore = await cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // Server Component에서는 쿠키 설정 불가
                    }
                },
            },
        }
    );
}
