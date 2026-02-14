"use client";

import { useRouter } from "next/navigation";

/**
 * ✅ 뒤로가기
 * - 히스토리가 있으면 back()
 * - 외부에서 바로 들어온 경우에는 홈으로 이동
 */
export function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => {
        if (window.history.length > 1) router.back();
        else router.push("/");
      }}
      className="rounded-full border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50"
    >
      ← 뒤로
    </button>
  );
}
