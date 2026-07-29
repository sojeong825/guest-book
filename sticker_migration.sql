-- 캐릭터 스티커 기능 마이그레이션
-- guestbook 에 sticker 컬럼 추가 + list_guestbook() 이 sticker 도 반환하도록 갱신

alter table public.guestbook
  add column if not exists sticker text not null default '1';

drop function if exists public.list_guestbook();

create function public.list_guestbook()
returns table (id uuid, name text, message text, is_secret boolean, sticker text, created_at timestamptz)
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
    g.sticker,
    g.created_at
  from public.guestbook g
  order by g.created_at desc
  limit 200;
$$;

grant execute on function public.list_guestbook() to anon, authenticated;
