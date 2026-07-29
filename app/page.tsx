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
          <span style={{ top: "6px", left: "10%", fontSize: "14px", opacity: 0.9 }}>✦</span>
          <span style={{ top: "44px", left: "2%", fontSize: "11px", opacity: 0.7 }}>✦</span>
          <span style={{ top: "-6px", left: "62%", fontSize: "10px", opacity: 0.6 }}>✦</span>
          <span style={{ top: "30px", left: "90%", fontSize: "15px", opacity: 0.9 }}>✦</span>
          <span style={{ top: "78px", left: "80%", fontSize: "11px", opacity: 0.7 }}>✦</span>
          <span style={{ top: "70px", left: "20%", fontSize: "10px", opacity: 0.6 }}>✦</span>
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
