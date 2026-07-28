import { createClient } from "@supabase/supabase-js";

/**
 * Supabase 클라이언트를 생성합니다.
 * 환경변수(.env.local)에 URL과 anon key가 설정되어 있어야 합니다.
 */
export function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase 환경변수가 없습니다. .env.local 에 NEXT_PUBLIC_SUPABASE_URL 과 NEXT_PUBLIC_SUPABASE_ANON_KEY 를 설정해주세요."
    );
  }

  return createClient(url, anonKey, {
    auth: { persistSession: false },
    global: {
      // 모든 요청을 no-store 로 강제 → Next.js/Vercel Data Cache 에 저장되지 않음.
      // (이게 없으면 DB 를 바꿔도 재배포 전까지 옛날 데이터가 캐시됨)
      fetch: (input: RequestInfo | URL, init?: RequestInit) =>
        fetch(input, { ...init, cache: "no-store" }),
    },
  });
}

export type GuestEntry = {
  id: string;
  name: string;
  message: string;
  is_secret: boolean;
  created_at: string;
};
