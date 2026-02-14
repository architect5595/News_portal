"use client";

import { useEffect, useState } from "react";

type FxPayload = {
  updatedUtc: string;
  nextUpdateUtc: string;
  rates: Record<string, number>;
  note?: string;
  error?: string;
};

function fmt(n: number): string {
  // 환율은 소수점 2자리 정도가 보기 좋음(통화별 차이가 있어 2~4 사이 자동)
  if (!Number.isFinite(n)) return "-";
  if (n >= 100) return n.toFixed(2);
  if (n >= 10) return n.toFixed(3);
  return n.toFixed(4);
}

export function FxWidget() {
  const [data, setData] = useState<FxPayload | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    try {
      setLoading(true);
      const res = await fetch("/api/widgets/fx");
      const json = (await res.json()) as FxPayload;
      setData(json);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-black/5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">실시간 환율</h3>
        <button
          onClick={load}
          className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700 hover:bg-gray-200"
          title="캐시된 데이터가 갱신될 수 있습니다."
        >
          새로고침
        </button>
      </div>

      <div className="mt-3 rounded-xl bg-gray-50 p-3">
        {loading ? (
          <div className="text-sm text-gray-600">불러오는 중...</div>
        ) : data?.error ? (
          <div className="text-sm text-red-600">{data.error}</div>
        ) : data ? (
          <>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(data.rates).map(([k, v]) => (
                <div key={k} className="rounded-lg bg-white p-2 ring-1 ring-black/5">
                  <div className="text-[11px] text-gray-500">{k}</div>
                  <div className="mt-1 text-base font-semibold">{fmt(v)}</div>
                </div>
              ))}
            </div>

            <div className="mt-3 space-y-1 text-[11px] text-gray-500">
              <div>업데이트(UTC): {data.updatedUtc}</div>
              <div>다음 업데이트(UTC): {data.nextUpdateUtc}</div>
              {data.note ? <div>{data.note}</div> : null}
            </div>
          </>
        ) : (
          <div className="text-sm text-gray-600">데이터 없음</div>
        )}
      </div>
    </div>
  );
}
