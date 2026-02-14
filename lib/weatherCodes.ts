/**
 * Open-Meteo 문서의 WMO Weather interpretation codes(WW) 기반
 * - 0, 1-3, 45-48, 51-55, 56-57, 61-65, 66-67, 71-75, 77, 80-82, 85-86, 95, 96-99
 */
export function weatherCodeToKorean(code: number | null | undefined): string {
  if (code === null || code === undefined) return "알 수 없음";

  const c = Number(code);

  if (c === 0) return "맑음";
  if ([1, 2, 3].includes(c)) return "대체로 맑음/구름";
  if ([45, 48].includes(c)) return "안개";
  if ([51, 53, 55].includes(c)) return "이슬비";
  if ([56, 57].includes(c)) return "어는 이슬비";
  if ([61, 63, 65].includes(c)) return "비";
  if ([66, 67].includes(c)) return "어는 비";
  if ([71, 73, 75].includes(c)) return "눈";
  if (c === 77) return "싸락눈";
  if ([80, 81, 82].includes(c)) return "소나기";
  if ([85, 86].includes(c)) return "눈 소나기";
  if (c === 95) return "뇌우";
  if ([96, 99].includes(c)) return "우박 동반 뇌우";

  return `기상코드 ${c}`;
}
