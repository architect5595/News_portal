import Link from "next/link";
import { cx } from "../ClassNames";
import { getParam, hrefWith, type SearchParams } from "@/lib/params";

export type PeriodKey = "today" | "7d" | "all";

export function PeriodTabs({ searchParams }: { searchParams: SearchParams }) {
  const tab = getParam(searchParams, "tab") ?? "trending";
  if (tab !== "trending") return null;

  const period = (getParam(searchParams, "period") as PeriodKey | undefined) ?? "today";

  const items: Array<{ key: PeriodKey; label: string }> = [
    { key: "today", label: "오늘" },
    { key: "7d", label: "7일" },
    { key: "all", label: "전체" },
  ];

  return (
    <div className="mt-3 flex items-center gap-2">
      {items.map((it) => (
        <Link
          key={it.key}
          href={hrefWith(searchParams, { period: it.key })}
          className={cx(
            "rounded-full px-3 py-1 text-xs",
            period === it.key ? "bg-gray-900 text-white" : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50"
          )}
        >
          {it.label}
        </Link>
      ))}
      <span className="ml-2 text-xs text-gray-400">기준: 사이트 내 조회수/조회 이벤트</span>
    </div>
  );
}
