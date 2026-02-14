"use client";

import { useEffect, useMemo, useState } from "react";
import { CATEGORIES, type CategoryKey, isCategoryKey } from "@/lib/categories";

type GoogleItem = {
  source: string;
  title: string;
  description: string | null;
  url: string;
  publishedAt: string | null;
  imageUrl: string | null;
};

type ApiResponse = {
  query: string;
  count: number;
  items: GoogleItem[];
  error?: string;
};

export function SearchClient({ q, when, site }: { q: string; when: string; site: string }) {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<CategoryKey>("ETC");
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  const catOptions = useMemo(() => CATEGORIES, []);

  async function load() {
    if (!q) {
      setData(null);
      return;
    }
    setLoading(true);
    try {
      const params = new URLSearchParams({ q });
      if (when) params.set("when", when);
      if (site) params.set("site", site);

      const res = await fetch(`/api/search/google?${params.toString()}`);
      const json = (await res.json()) as ApiResponse;

      setData(json);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, when, site]);

  async function saveOne(it: GoogleItem) {
    try {
      const res = await fetch("/api/news/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...it, category }),
      });
      if (!res.ok) {
        alert("추가 실패");
        return;
      }
      setSaved((prev) => ({ ...prev, [it.url]: true }));
    } catch {
      alert("네트워크 오류");
    }
  }

  if (!q) {
    return (
      <div className="rounded-2xl bg-white p-4 text-sm text-gray-600 ring-1 ring-black/5">
        키워드를 입력하고 검색하세요.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="rounded-2xl bg-white p-4 ring-1 ring-black/5">
        <div className="flex flex-wrap items-center gap-2">
          <div className="text-sm font-semibold">저장 시 분야</div>
          <select
            value={category}
            onChange={(e) => setCategory(isCategoryKey(e.target.value) ? (e.target.value as CategoryKey) : "ETC")}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm"
          >
            {catOptions.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label} ({c.key})
              </option>
            ))}
          </select>

          <button
            onClick={load}
            className="ml-auto rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50"
          >
            결과 새로고침
          </button>
        </div>

        <p className="mt-2 text-xs text-gray-500">
          “추가”를 누르면 내 DB에 저장되어 홈(인기/최신)에도 노출될 수 있습니다.
        </p>
      </div>

      {loading ? (
        <div className="rounded-2xl bg-white p-4 text-sm text-gray-600 ring-1 ring-black/5">
          불러오는 중...
        </div>
      ) : data?.error ? (
        <div className="rounded-2xl bg-white p-4 text-sm text-red-600 ring-1 ring-black/5">
          {data.error}
        </div>
      ) : data ? (
        data.items.length === 0 ? (
          <div className="rounded-2xl bg-white p-4 text-sm text-gray-600 ring-1 ring-black/5">
            결과가 없습니다.
          </div>
        ) : (
          data.items.map((it) => (
            <div key={it.url} className="rounded-2xl bg-white p-4 ring-1 ring-black/5">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-xs text-gray-500">{it.source}</div>
                  <div className="mt-1 text-sm font-semibold">{it.title}</div>
                </div>

                <button
                  onClick={() => saveOne(it)}
                  disabled={Boolean(saved[it.url])}
                  className="shrink-0 rounded-xl bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {saved[it.url] ? "추가됨" : "추가"}
                </button>
              </div>

              {it.description ? (
                <p className="mt-2 text-sm text-gray-700">{it.description}</p>
              ) : null}

              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                {it.publishedAt ? <span>{new Date(it.publishedAt).toLocaleString("ko-KR")}</span> : null}
                <a
                  href={it.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-gray-100 px-3 py-1 text-gray-700 hover:bg-gray-200"
                >
                  원문
                </a>
              </div>
            </div>
          ))
        )
      ) : null}
    </div>
  );
}
