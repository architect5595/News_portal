"use client";

import { useState } from "react";

export function RefreshButton() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onClick() {
    try {
      setLoading(true);
      setMsg(null);

      const res = await fetch("/api/news/refresh", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        setMsg(data?.error ? String(data.error) : "수집 실패");
        return;
      }

      setMsg(`수집 완료: ${data.inserted ?? 0}개`);
      // 새 데이터 반영을 위해 새로고침
      window.location.reload();
    } catch {
      setMsg("네트워크 오류");
    } finally {
      setLoading(false);
      // 메시지는 잠시 후 자동 숨김
      setTimeout(() => setMsg(null), 4000);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onClick}
        disabled={loading}
        className="rounded-full bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        title="RSS를 새로 수집하여 DB를 갱신합니다."
      >
        {loading ? "수집중..." : "뉴스 업데이트"}
      </button>
      {msg ? <span className="hidden text-xs text-gray-500 sm:inline">{msg}</span> : null}
    </div>
  );
}
