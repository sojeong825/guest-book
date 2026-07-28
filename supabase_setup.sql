-- 이 프로젝트(guest-book, hlmkwpxrupwpxwinnope)에는 이미 적용되어 있습니다.
-- 다른 Supabase 프로젝트에서 처음부터 세팅할 때만 SQL Editor 에 붙여넣고 실행하세요.
-- (Dashboard > 왼쪽 메뉴 SQL Editor > New query > 붙여넣기 > Run)

-- 1) 방명록 테이블 (is_secret = 비밀글 여부)
--    CHECK 제약으로 빈 이름/빈 메시지는 DB 레벨에서도 막습니다.
create table if not exists public.guestbook (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 20),
  message text not null check (char_length(btrim(message)) between 1 and 200),
  is_secret boolean not null default false,
  created_at timestamptz not null default now()
);

-- 2) 최신순 조회 최적화용 인덱스
create index if not exists guestbook_created_at_idx
  on public.guestbook (created_at desc);

-- 3) Row Level Security 활성화
alter table public.guestbook enable row level security;

-- 4) 작성: 로그인 없이 누구나 허용
drop policy if exists "public insert" on public.guestbook;
create policy "public insert"
  on public.guestbook for insert
  to anon, authenticated
  with check (true);

-- 5) 조회: 테이블 직접 조회는 차단한다.
--    anon 키는 브라우저에 노출되므로, 테이블을 그대로 열어두면
--    누구나 REST API 로 비밀글 본문을 읽을 수 있다.
--    → SELECT 정책을 만들지 않고 권한도 회수한 뒤,
--      비밀글 본문을 지워서 돌려주는 함수만 공개한다.
revoke select on public.guestbook from anon, authenticated;

create or replace function public.list_guestbook()
returns table (
  id uuid,
  name text,
  message text,
  is_secret boolean,
  created_at timestamptz
)
language sql
security definer
set search_path = ''
stable
as $$
  select
    g.id,
    g.name,
    case when g.is_secret then '' else g.message end,
    g.is_secret,
    g.created_at
  from public.guestbook g
  order by g.created_at desc
  limit 200;
$$;

grant execute on function public.list_guestbook() to anon, authenticated;
