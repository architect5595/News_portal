"use client";

import { useMemo, useState } from "react";
import { CATEGORIES, isCategoryKey, type CategoryKey } from "@/lib/categories";

export function CategoryEditor({ newsId, current }: { newsId: string; current: string }) {
  const currentKey = useMemo(() => (isCategoryKey(current) ? (current as CategoryKey) : "ETC"), [current]);
  const [value, setValue] = useState<CategoryKey>(currentKey);
  const [saving, setSaving] = useState(false);

  async function save() {
    try {
      setSaving(true);
      const res = await fetch(`/api/news/${newsId}/category`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: value }),
      });

      if (!res.ok) {
        alert("저장 실패");
        return;
      }

      window.location.reload();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={value}
        onChange={(e) => setValue(e.target.value as CategoryKey)}
        className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm"
      >
        {CATEGORIES.map((c) => (
          <option key={c.key} value={c.key}>
            {c.label} ({c.key})
          </option>
        ))}
      </select>

      <button
        onClick={save}
        disabled={saving}
        className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {saving ? "저장중..." : "저장"}
      </button>
    </div>
  );
}
