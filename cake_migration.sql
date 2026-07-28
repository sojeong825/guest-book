-- 케이크 아이콘 기능 마이그레이션
-- Supabase Dashboard > SQL Editor > New query 에 붙여넣고 Run 하세요.
-- (프로젝트: guest-book / hlmkwpxrupwpxwinnope)

-- 1) guestbook 에 cake 컬럼 추가 (없으면 추가, 기본값 'choco')
alter table public.guestbook
  add column if not exists cake text not null default 'choco';

-- 2) list_guestbook() 가 cake 도 반환하도록 갱신
--    (반환 컬럼이 바뀌므로 create or replace 로는 안 되고 drop 후 재생성해야 함)
drop function if exists public.list_guestbook();

create function public.list_guestbook()
returns table (
  id uuid,
  name text,
  message text,
  is_secret boolean,
  cake text,
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
    g.cake,
    g.created_at
  from public.guestbook g
  order by g.created_at desc
  limit 200;
$$;

grant execute on function public.list_guestbook() to anon, authenticated;
