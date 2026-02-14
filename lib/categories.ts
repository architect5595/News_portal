export type CategoryKey =
  | "POLITICS"
  | "ECONOMY"
  | "FINANCE"
  | "REAL_ESTATE"
  | "IT_SCIENCE"
  | "SOCIETY"
  | "WORLD"
  | "CULTURE"
  | "SPORTS"
  | "HEALTH"
  | "WEATHER"
  | "ETC";

export type CategoryMeta = {
  key: CategoryKey;
  label: string;
  // 배너/칩에서 보여줄 짧은 설명(선택)
  hint?: string;
  // 배너 배경 스타일 (Tailwind class)
  bannerClass: string;
};

export const CATEGORIES: CategoryMeta[] = [
  { key: "ECONOMY", label: "경제", hint: "물가·산업", bannerClass: "bg-gradient-to-r from-blue-50 to-blue-100" },
  { key: "FINANCE", label: "금융/증권", hint: "시장·금리", bannerClass: "bg-gradient-to-r from-indigo-50 to-indigo-100" },
  { key: "REAL_ESTATE", label: "부동산", hint: "주거·분양", bannerClass: "bg-gradient-to-r from-emerald-50 to-emerald-100" },
  { key: "IT_SCIENCE", label: "IT/과학", hint: "기술·AI", bannerClass: "bg-gradient-to-r from-cyan-50 to-cyan-100" },
  { key: "POLITICS", label: "정치", hint: "국회·외교", bannerClass: "bg-gradient-to-r from-slate-50 to-slate-100" },
  { key: "SOCIETY", label: "사회", hint: "사건·교육", bannerClass: "bg-gradient-to-r from-zinc-50 to-zinc-100" },
  { key: "WORLD", label: "세계", hint: "글로벌", bannerClass: "bg-gradient-to-r from-amber-50 to-amber-100" },
  { key: "CULTURE", label: "문화/연예", hint: "콘텐츠", bannerClass: "bg-gradient-to-r from-pink-50 to-pink-100" },
  { key: "SPORTS", label: "스포츠", hint: "경기", bannerClass: "bg-gradient-to-r from-orange-50 to-orange-100" },
  { key: "HEALTH", label: "건강", hint: "의학·생활", bannerClass: "bg-gradient-to-r from-lime-50 to-lime-100" },
  { key: "WEATHER", label: "날씨", hint: "기상", bannerClass: "bg-gradient-to-r from-sky-50 to-sky-100" },
  { key: "ETC", label: "기타", hint: "기타", bannerClass: "bg-gradient-to-r from-gray-50 to-gray-100" },
];

export function isCategoryKey(v: string): v is CategoryKey {
  return CATEGORIES.some((c) => c.key === v);
}

export function labelOfCategory(key: CategoryKey): string {
  return CATEGORIES.find((c) => c.key === key)?.label ?? key;
}
