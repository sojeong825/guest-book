-- posts 테이블 + CRUD 설정
-- Supabase Dashboard > SQL Editor > New query 에 붙여넣고 Run 하세요.
-- (프로젝트: guest-book / hlmkwpxrupwpxwinnope)

-- 1) posts 테이블
--    title 은 필수(공백만 입력 금지), content 는 선택.
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(btrim(title)) between 1 and 200),
  content text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2) 최신순 조회용 인덱스
create index if not exists posts_created_at_idx
  on public.posts (created_at desc);

-- 3) update 시 updated_at 자동 갱신
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

-- 4) RLS: 로그인이 없으므로 anon 역할에 CRUD 를 모두 허용
--    ⚠️ 누구나 읽기/작성/수정/삭제가 가능한 공개 CRUD 입니다 (데모/학습용).
--       실제 서비스라면 인증을 붙이고 정책을 좁혀야 합니다.
alter table public.posts enable row level security;

drop policy if exists "posts anon select" on public.posts;
create policy "posts anon select" on public.posts
  for select to anon, authenticated using (true);

drop policy if exists "posts anon insert" on public.posts;
create policy "posts anon insert" on public.posts
  for insert to anon, authenticated with check (true);

drop policy if exists "posts anon update" on public.posts;
create policy "posts anon update" on public.posts
  for update to anon, authenticated using (true) with check (true);

drop policy if exists "posts anon delete" on public.posts;
create policy "posts anon delete" on public.posts
  for delete to anon, authenticated using (true);
