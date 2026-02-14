"use client";

import { useMemo, useState } from "react";
import { CATEGORIES, type CategoryKey, isCategoryKey } from "@/lib/categories";

type NewsSource = {
  id: string;
  name: string;
  url: string;
  category: string;
  enabled: boolean;
  createdAt: string;
};

async function fetchSources(): Promise<NewsSource[]> {
  const res = await fetch("/api/sources");
  const json = await res.json();
  return json.sources as NewsSource[];
}

export function SourceManager({ initialSources }: { initialSources: any[] }) {
  const [sources, setSources] = useState<NewsSource[]>(
    initialSources.map((s) => ({
      ...s,
      createdAt: new Date(s.createdAt).toISOString(),
    }))
  );
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState<CategoryKey>("ETC");

  const catOptions = useMemo(() => CATEGORIES, []);

  async function refresh() {
    setLoading(true);
    try {
      const list = await fetchSources();
      setSources(list.map((s) => ({ ...s, createdAt: new Date(s.createdAt).toISOString() })));
    } finally {
      setLoading(false);
    }
  }

  async function seedDefaults() {
    setLoading(true);
    try {
      await fetch("/api/sources/seed", { method: "POST" });
      await refresh();
    } finally {
      setLoading(false);
    }
  }

  async function addSource() {
    if (!name.trim() || !url.trim()) {
      alert("이름/URL을 입력하세요.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), url: url.trim(), category }),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        alert(j?.error ?? "추가 실패");
        return;
      }

      setName("");
      setUrl("");
      setCategory("ETC");

      await refresh();
    } finally {
      setLoading(false);
    }
  }

  async function toggleEnabled(id: string, enabled: boolean) {
    setLoading(true);
    try {
      await fetch(`/api/sources/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled }),
      });
      await refresh();
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("정말 삭제할까요?")) return;

    setLoading(true);
    try {
      await fetch(`/api/sources/${id}`, { method: "DELETE" });
      await refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={seedDefaults}
          disabled={loading}
          className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black disabled:opacity-60"
        >
          기본 소스 추가
        </button>
        <button
          onClick={refresh}
          disabled={loading}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-60"
        >
          목록 새로고침
        </button>
        {loading ? <span className="text-xs text-gray-500">처리 중...</span> : null}
      </div>

      <div className="rounded-2xl bg-gray-50 p-4">
        <h3 className="text-sm font-semibold">새 RSS 소스 추가</h3>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름 (예: 한국경제-경제)"
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-300"
          />
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="RSS URL (https://...)"
            className="sm:col-span-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-300"
          />
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
        </div>

        <div className="mt-3">
          <button
            onClick={addSource}
            disabled={loading}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            추가
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold">현재 소스</h3>
        <div className="mt-3 space-y-2">
          {sources.length === 0 ? (
            <div className="text-sm text-gray-600">소스가 없습니다. “기본 소스 추가”를 눌러보세요.</div>
          ) : (
            sources.map((s) => (
              <div key={s.id} className="flex flex-col gap-2 rounded-2xl bg-white p-4 ring-1 ring-black/5 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="text-sm font-semibold">{s.name}</div>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                      {s.category}
                    </span>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                      {s.enabled ? "ENABLED" : "DISABLED"}
                    </span>
                  </div>
                  <div className="mt-1 break-all text-xs text-gray-500">{s.url}</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleEnabled(s.id, !s.enabled)}
                    disabled={loading}
                    className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-60"
                  >
                    {s.enabled ? "비활성화" : "활성화"}
                  </button>
                  <button
                    onClick={() => remove(s.id)}
                    disabled={loading}
                    className="rounded-xl bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
