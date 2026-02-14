import Link from "next/link";
import { cx } from "../ClassNames";
import { getParam, hrefWith, type SearchParams } from "@/lib/params";

export function PrimaryTabs({ searchParams }: { searchParams: SearchParams }) {
  const tab = getParam(searchParams, "tab") ?? "trending";

  return (
    <nav className="mt-4">
      <div className="flex items-center gap-6 border-b">
        <Link
          href={hrefWith(searchParams, { tab: "trending" })}
          className={cx(
            "pb-3 text-sm font-medium",
            tab === "trending" ? "border-b-2 border-gray-900 text-gray-900" : "text-gray-500"
          )}
        >
          인기
        </Link>

        <Link
          href={hrefWith(searchParams, { tab: "latest", period: null })}
          className={cx(
            "pb-3 text-sm font-medium",
            tab === "latest" ? "border-b-2 border-gray-900 text-gray-900" : "text-gray-500"
          )}
        >
          최신
        </Link>

        <Link
          href="/search"
          className="ml-auto hidden pb-3 text-sm font-medium text-gray-500 hover:text-gray-800 sm:block"
        >
          검색 →
        </Link>
      </div>
    </nav>
  );
}
