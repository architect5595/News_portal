import Link from "next/link";
import { cx } from "../ClassNames";
import { getParam, hrefWith, type SearchParams } from "@/lib/params";

export type SourceChip = {
  source: string;
  count: number;
};

export function SourceChips({
  searchParams,
  sources,
}: {
  searchParams: SearchParams;
  sources: SourceChip[];
}) {
  const current = getParam(searchParams, "source") ?? "";

  return (
    <section className="mt-4">
      <div className="mb-2 flex items-end justify-between">
        <h2 className="text-sm font-semibold">뉴스 채널</h2>
        <p className="text-xs text-gray-500">채널별 필터</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        <Link
          href={hrefWith(searchParams, { source: null })}
          className={cx(
            "shrink-0 rounded-full px-3 py-1 text-xs ring-1",
            current === ""
              ? "bg-gray-900 text-white ring-gray-900"
              : "bg-white text-gray-600 ring-gray-200 hover:bg-gray-50"
          )}
        >
          전체
        </Link>

        {sources.map((s) => (
          <Link
            key={s.source}
            href={hrefWith(searchParams, { source: s.source })}
            className={cx(
              "shrink-0 rounded-full px-3 py-1 text-xs ring-1",
              current === s.source
                ? "bg-gray-900 text-white ring-gray-900"
                : "bg-white text-gray-600 ring-gray-200 hover:bg-gray-50"
            )}
            title={`${s.source} (${s.count}건)`}
          >
            {s.source}
          </Link>
        ))}
      </div>
    </section>
  );
}
