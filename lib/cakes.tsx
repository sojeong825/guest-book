// 방명록에서 고를 수 있는 케이크 6종.
// 서버 컴포넌트(목록)와 클라이언트 컴포넌트(작성 폼) 양쪽에서 씁니다.

export type CakeType =
  | "choco"
  | "strawberry"
  | "cheese"
  | "cream"
  | "matcha"
  | "carrot";

export type Cake = {
  id: CakeType;
  label: string;
  sponge: string; // 빵(시트) 색
  frosting: string; // 크림/아이싱 색
  topping: string; // 위 장식(베리 등) 색
};

export const CAKES: Cake[] = [
  { id: "choco", label: "초코", sponge: "#7b4b2a", frosting: "#4a2c17", topping: "#e23b3b" },
  { id: "strawberry", label: "딸기", sponge: "#ffd3dd", frosting: "#ff8fab", topping: "#e2315a" },
  { id: "cheese", label: "치즈", sponge: "#ffe39a", frosting: "#f4c73f", topping: "#7a4fd0" },
  { id: "cream", label: "생크림", sponge: "#f6e6c8", frosting: "#eaeef4", topping: "#e23b3b" },
  { id: "matcha", label: "말차", sponge: "#cfe8ac", frosting: "#8fc65b", topping: "#7a3b1f" },
  { id: "carrot", label: "당근", sponge: "#f2c98a", frosting: "#fff2e0", topping: "#ef8b3b" },
];

export const DEFAULT_CAKE: CakeType = "choco";

export function isCakeType(v: unknown): v is CakeType {
  return typeof v === "string" && CAKES.some((c) => c.id === v);
}

export function CakeIcon({
  type,
  size = 30,
}: {
  type: string;
  size?: number;
}) {
  const cake = CAKES.find((c) => c.id === type) ?? CAKES[0];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* 접시 */}
      <ellipse cx="20" cy="34" rx="14" ry="2.2" fill="#e7e4ef" />
      {/* 시트(빵) */}
      <rect x="8" y="20" width="24" height="13" rx="3" fill={cake.sponge} />
      {/* 가운데 크림 필링 */}
      <rect x="8" y="24.5" width="24" height="2.6" fill={cake.frosting} opacity="0.85" />
      {/* 윗면 아이싱 */}
      <rect x="8" y="15" width="24" height="7" rx="3.5" fill={cake.frosting} />
      {/* 흘러내리는 크림 방울 */}
      <circle cx="13" cy="22" r="2.2" fill={cake.frosting} />
      <circle cx="20" cy="22.6" r="2.5" fill={cake.frosting} />
      <circle cx="27" cy="22" r="2.2" fill={cake.frosting} />
      {/* 초 */}
      <rect x="19" y="7" width="2" height="8" rx="1" fill="#f4b93f" />
      {/* 불꽃 */}
      <path d="M20 3.6c1.7 1.3 1.7 3.6 0 4.5c-1.7-0.9-1.7-3.2 0-4.5z" fill="#ff8a3d" />
      {/* 베리 장식 */}
      <circle cx="13" cy="18.4" r="1.5" fill={cake.topping} />
      <circle cx="27" cy="18.4" r="1.5" fill={cake.topping} />
    </svg>
  );
}
