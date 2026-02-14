/**
 * ✅ Google News RSS 검색 URL 생성기
 * - 기본 형태:
 *   https://news.google.com/rss/search?q=<QUERY>&hl=ko&gl=KR&ceid=KR:ko
 *
 * - 고급 검색 예시(Feedly 문서 예시):
 *   intitle:AAPL when:1h  → 제목에 AAPL 포함 + 최근 1시간
 */
export function buildGoogleNewsSearchUrl(q: string): string {
  const base = "https://news.google.com/rss/search";
  const params = new URLSearchParams({
    q,
    hl: "ko",
    gl: "KR",
    ceid: "KR:ko",
  });
  return `${base}?${params.toString()}`;
}
