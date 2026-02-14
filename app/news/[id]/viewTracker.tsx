"use client";

import { useEffect } from "react";

/**
 * ✅ 조회 이벤트 기록
 * - 상세 페이지 진입 시 1회만 조회를 기록합니다.
 * - sessionStorage로 같은 세션에서 중복 카운트 방지(간단 버전)
 */
export function ViewTracker({ newsId }: { newsId: string }) {
  useEffect(() => {
    const key = `viewed:${newsId}`;
    if (typeof window === "undefined") return;

    if (sessionStorage.getItem(key) === "1") return;
    sessionStorage.setItem(key, "1");

    void fetch(`/api/news/${newsId}/view`, { method: "POST" });
  }, [newsId]);

  return null;
}
