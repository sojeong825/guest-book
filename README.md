# 🎂 생일 방명록 (Guestbook)

생일을 축하하는 방명록 웹앱. **Next.js (App Router) + Supabase**.
디자인은 Figma `Guestbook / Main` 프레임(`1363:23390`)을 그대로 구현했습니다.

## 기능
- 방명록 목록 보기 (최신순)
- 이름 + 메시지 작성
- **비밀글 설정** — 체크하면 목록에서 메시지가 `🔒 비밀글입니다`로 가려집니다.
- 빈 입력(공백만 입력한 경우 포함)이면 에러 메시지 표시

로그인·댓글 기능은 포함하지 않습니다.

## 비밀글은 어떻게 가려지나
`NEXT_PUBLIC_SUPABASE_ANON_KEY` 는 브라우저에 노출되므로, 테이블을 그대로 읽게 열어두면
누구나 REST API 로 비밀글 본문을 가져갈 수 있습니다. 그래서:

- `guestbook` 테이블은 **anon 역할의 SELECT 권한을 회수**해 직접 조회를 막았습니다.
- 대신 비밀글 본문을 빈 문자열로 바꿔서 돌려주는 함수 `list_guestbook()` 만 공개합니다.
  앱은 이 함수를 통해서만 목록을 읽으므로, 비밀글 원문은 앱 서버에도 전달되지 않습니다.
- 원문은 방장이 Supabase 대시보드(SQL Editor / Table Editor)에서 확인합니다.

작성은 anon 역할에 INSERT 정책을 열어 두었고, 빈 이름/빈 메시지는 서버 액션과
테이블 CHECK 제약에서 이중으로 막습니다.

## 실행 방법

### 1. Supabase 테이블 생성
이 저장소에 연결된 프로젝트(`guest-book`)에는 이미 적용되어 있습니다.
다른 Supabase 프로젝트를 쓴다면 Dashboard > **SQL Editor** 에서
[`supabase_setup.sql`](./supabase_setup.sql) 내용을 실행하세요.

### 2. 환경변수 설정
`.env.local` 에 아래 두 값이 필요합니다.
(Supabase Dashboard > Project Settings > API)

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### 3. 설치 & 실행
```bash
npm install
npm run dev
```
→ http://localhost:3000 (3000번이 사용 중이면 Next.js 가 3001 등으로 자동 변경합니다)

## 구조
- `app/page.tsx` — 서버 컴포넌트. `list_guestbook()` 으로 목록을 최신순 조회해 렌더링
- `app/GuestbookForm.tsx` — 작성 폼 (클라이언트 컴포넌트). 비밀글 체크박스 포함
- `app/actions.ts` — 서버 액션. 빈 입력 검증 + Supabase insert
- `lib/supabase.ts` — Supabase 클라이언트
- `app/page.module.css` — Figma 디자인 스펙 그대로 구현한 스타일 (주석에 노드 ID 표기)
- `public/check.svg` — Figma 에서 내보낸 체크 글리프

## 샘플 데이터 지우기
디자인 확인용으로 넣어둔 샘플 방명록이 있습니다. 전부 비우려면 SQL Editor 에서:

```sql
delete from public.guestbook;
```
