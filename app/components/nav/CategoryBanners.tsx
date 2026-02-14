import Link from "next/link";
import { CATEGORIES, type CategoryKey } from "@/lib/categories";
import { getParam, hrefWith, type SearchParams } from "@/lib/params";
import { cx } from "../ClassNames";

export function CategoryBanners({ searchParams }: { searchParams: SearchParams }) {
  const category = getParam(searchParams, "category");

  return (
    <section className="mt-4">
      <div className="mb-2 flex items-end justify-between">
        <h2 className="text-sm font-semibold">분야</h2>
        <p className="text-xs text-gray-500">배너 클릭으로 필터링</p>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        <Link
          href={hrefWith(searchParams, { category: null })}
          className={cx(
            "shrink-0 rounded-2xl border px-4 py-3 text-sm",
            !category ? "border-gray-900 bg-gray-900 text-white" : "border-gray-200 bg-white hover:bg-gray-50"
          )}
        >
          <div className="font-semibold">전체</div>
          <div className="text-xs opacity-80">모든 분야</div>
        </Link>

        {CATEGORIES.map((c) => (
          <Link
            key={c.key}
            href={hrefWith(searchParams, { category: c.key as CategoryKey })}
            className={cx(
              "shrink-0 rounded-2xl border px-4 py-3 text-sm",
              category === c.key ? "border-gray-900 bg-gray-900 text-white" : `border-gray-200 ${c.bannerClass} hover:opacity-90`
            )}
          >
            <div className="font-semibold">{c.label}</div>
            <div className="text-xs text-gray-600">{c.hint ?? ""}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
