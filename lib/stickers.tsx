// 방명록에서 고를 수 있는 캐릭터 스티커 9종.
// 이미지 파일은 public/characters/1.png ~ 9.png 에 있어야 합니다.
// 서버 컴포넌트(목록)와 클라이언트 컴포넌트(작성 폼) 양쪽에서 씁니다.

export type Sticker = {
  id: string;
  src: string;
};

export const STICKERS: Sticker[] = [
  { id: "1", src: "/characters/1.png" },
  { id: "2", src: "/characters/2.png" },
  { id: "3", src: "/characters/3.png" },
  { id: "4", src: "/characters/4.png" },
  { id: "5", src: "/characters/5.png" },
  { id: "6", src: "/characters/6.png" },
  { id: "7", src: "/characters/7.png" },
  { id: "8", src: "/characters/8.png" },
  { id: "9", src: "/characters/9.png" },
];

export const DEFAULT_STICKER = "1";

export function isStickerId(v: unknown): v is string {
  return typeof v === "string" && STICKERS.some((s) => s.id === v);
}

export function stickerSrc(id: string | undefined): string {
  return STICKERS.find((s) => s.id === id)?.src ?? STICKERS[0].src;
}
