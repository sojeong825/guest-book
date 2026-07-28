import GuestbookForm from "./GuestbookForm";
import { getSupabase, type GuestEntry } from "@/lib/supabase";
import styles from "./page.module.css";

// 방명록은 항상 최신 데이터를 보여줍니다.
export const dynamic = "force-dynamic";

function formatDate(iso: string): string {
  const d = new Date(iso);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${month}월 ${day}일 ${hh}:${mm}`;
}

async function getEntries(): Promise<GuestEntry[]> {
  try {
    const supabase = getSupabase();
    // 비밀글 본문은 DB 함수(list_guestbook)가 빈 문자열로 마스킹하므로
    // 앱/브라우저 어디에도 전달되지 않습니다. 최신순 정렬도 함수 안에서 처리합니다.
    const { data, error } = await supabase.rpc("list_guestbook");

    if (error) {
      console.error("Supabase select error:", error);
      return [];
    }
    return (data ?? []) as GuestEntry[];
  } catch (e) {
    console.error(e);
    return [];
  }
}

export default async function Page() {
  const entries = await getEntries();

  return (
    <main className={styles.page}>
      {/* 하단 배경 장식 이미지 (Figma 1374:23457) */}
      <div className={styles.bgDecor} aria-hidden="true">
        <img src="/birthday-bg.png" alt="" />
      </div>

      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.title}>🎂 생일 방명록</h1>
        <p className={styles.subtitle}>생일을 축하해 주세요~</p>
      </header>

      {/* WriteForm */}
      <GuestbookForm />

      {/* CardList (최신순) */}
      <section className={styles.list}>
        {entries.length === 0 ? (
          <p className={styles.empty}>아직 방명록이 없어요. 첫 번째로 남겨보세요! ✨</p>
        ) : (
          entries.map((entry) => (
            <article key={entry.id} className={styles.card}>
              <div className={styles.cardTop}>
                <p className={styles.cardName}>{entry.name}</p>
                <p className={styles.cardDate}>{formatDate(entry.created_at)}</p>
              </div>
              {entry.is_secret ? (
                <p className={styles.secretMessage}>🔒 비밀글입니다</p>
              ) : (
                <p className={styles.cardMessage}>{entry.message}</p>
              )}
            </article>
          ))
        )}
      </section>
    </main>
  );
}
