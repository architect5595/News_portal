/**
 * ✅ KST(UTC+9) 기준 시간 유틸
 * - 서버가 UTC로 동작하더라도 "오늘"을 한국시간 00:00~23:59 기준으로 집계하기 위함
 */

const KST_OFFSET_MIN = 9 * 60;
const KST_OFFSET_MS = KST_OFFSET_MIN * 60 * 1000;

/**
 * 주어진 Date를 기준으로 "KST 오늘 00:00"의 Date(UTC epoch 기반)를 반환합니다.
 *
 * 원리:
 * 1) now(UTC epoch)를 KST로 이동( +9h )
 * 2) 그 KST 날짜의 yyyy-mm-dd를 뽑음
 * 3) 해당 날짜의 00:00(KST)을 다시 UTC epoch로 환산( -9h )
 */
export function kstStartOfDay(now: Date = new Date()): Date {
  const kstMs = now.getTime() + KST_OFFSET_MS;
  const kst = new Date(kstMs);

  const y = kst.getUTCFullYear();
  const m = kst.getUTCMonth();
  const d = kst.getUTCDate();

  // UTC 기준으로 y-m-d 00:00을 만든 뒤, KST->UTC로 이동(-9h)
  const kstStartUtcMs = Date.UTC(y, m, d, 0, 0, 0) - KST_OFFSET_MS;
  return new Date(kstStartUtcMs);
}

/**
 * KST 기준 "N일 전 00:00"을 반환합니다.
 * - days=7이면 "7일 전 KST 00:00" (오늘 포함 X가 아니라, '시작 시각' 기준으로 기간 집계)
 */
export function kstStartDaysAgo(days: number, now: Date = new Date()): Date {
  const startToday = kstStartOfDay(now);
  const ms = startToday.getTime() - days * 24 * 60 * 60 * 1000;
  return new Date(ms);
}

export function formatKoreanDate(iso: string | null | undefined): string {
  if (!iso) return "-";
  const d = new Date(iso);
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}
