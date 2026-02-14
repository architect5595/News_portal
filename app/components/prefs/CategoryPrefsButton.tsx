"use client";

import { useEffect, useMemo, useState } from "react";
import { CATEGORIES, type CategoryKey } from "@/lib/categories";

function readCookie(name: string): string | null {
  const match = document.cookie
    .split(";")
    .map((v) => v.trim())
    .find((v) => v.startsWith(`${name}=`));
  if (!match) return null;
  return decodeURIComponent(match.split("=").slice(1).join("="));
}

export function CategoryPrefsButton() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<CategoryKey[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const raw = readCookie("cats");
    if (!raw) {
      setSelected([]);
      return;
    }
    const parts = raw.split(",").map((s) => s.trim()).filter(Boolean) as CategoryKey[];
    setSelected(parts);
  }, [open]);

  const selectedSet = useMemo(() => new Set(selected), [selected]);

  function toggle(key: CategoryKey) {
    setSelected((prev) => {
      const set = new Set(prev);
      if (set.has(key)) set.delete(key);
      else set.add(key);
      return Array.from(set);
    });
  }

  async function save() {
    try {
      setSaving(true);
      const res = await fetch("/api/prefs/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categories: selected }),
      });
      if (!res.ok) {
        alert("저장 실패");
        return;
      }
      setOpen(false);
      window.location.reload();
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-full border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50"
        title="홈에서 보여줄 관심 분야를 선택합니다."
      >
        관심분야
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div className="w-full max-w-lg rounded-2xl bg-white p-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">관심 분야 선택</h3>
              <button
                onClick={() => setOpen(false)}
                className="rounded-full px-2 py-1 text-sm text-gray-500 hover:bg-gray-100"
              >
                닫기
              </button>
            </div>

            <p className="mt-1 text-xs text-gray-500">
              선택한 분야만 홈에서 기본 필터로 적용됩니다. (언제든 변경 가능)
            </p>

            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {CATEGORIES.filter((c) => c.key !== "ETC").map((c) => (
                <button
                  key={c.key}
                  onClick={() => toggle(c.key)}
                  className={[
                    "rounded-xl border px-3 py-2 text-left text-sm",
                    selectedSet.has(c.key)
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 bg-white hover:bg-gray-50",
                  ].join(" ")}
                >
                  <div className="font-medium">{c.label}</div>
                  <div className="text-xs text-gray-500">{c.hint ?? ""}</div>
                </button>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={() => setSelected([])}
                className="rounded-full border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50"
              >
                전체 보기(해제)
              </button>

              <button
                onClick={save}
                disabled={saving}
                className="rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black disabled:opacity-60"
              >
                {saving ? "저장중..." : "저장"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
