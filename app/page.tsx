import { unstable_noStore as noStore } from "next/cache";
import GuestbookForm from "./GuestbookForm";
import { getSupabase, type GuestEntry } from "@/lib/supabase";
import { stickerSrc } from "@/lib/stickers";
import styles from "./page.module.css";

// 방명록은 항상 최신 데이터를 보여줍니다.
export const dynamic = "force-dynamic";
export const revalidate = 0;

function formatDate(iso: string): string {
  // 서버(Vercel)는 UTC 라서, 표시는 한국시간(Asia/Seoul)으로 고정합니다.
  const parts = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(iso));
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("month")}월 ${get("day")}일 ${get("hour")}:${get("minute")}`;
}

async function getEntries(): Promise<GuestEntry[]> {
  noStore(); // 이 렌더링을 캐시에서 제외 (항상 실시간 DB 조회)
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
        {/* 배경 별 장식 */}
        <div className={styles.stars} aria-hidden="true">
          {[
            { top: 4, left: "10%", size: 16, o: 0.95 },
            { top: 44, left: "2%", size: 12, o: 0.75 },
            { top: -4, left: "62%", size: 11, o: 0.65 },
            { top: 28, left: "90%", size: 18, o: 0.95 },
            { top: 78, left: "80%", size: 12, o: 0.75 },
            { top: 70, left: "20%", size: 11, o: 0.65 },
          ].map((s, i) => (
            <svg
              key={i}
              className={styles.star}
              style={{ top: s.top, left: s.left, width: s.size, height: s.size, opacity: s.o }}
              viewBox="0 0 24 24"
            >
              <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.786 1.402 8.174L12 18.897l-7.336 3.863 1.402-8.174L.132 9.21l8.2-1.192z" />
            </svg>
          ))}
        </div>
        <h1 className={styles.title}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/characters/1.png" alt="" className={styles.titleBear} />
          생일 방명록
        </h1>
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
                <div className={styles.cardWho}>
                  <span className={styles.cardSticker}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={stickerSrc(entry.sticker)} alt="" />
                  </span>
                  <p className={styles.cardName}>{entry.name}</p>
                </div>
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
