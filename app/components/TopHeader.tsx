import Link from "next/link";
import { RefreshButton } from "./actions/RefreshButton";
import { CategoryPrefsButton } from "./prefs/CategoryPrefsButton";

export function TopHeader() {
  return (
    <header className="sticky top-0 z-20 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1400px] items-center gap-3 px-4 py-3">
        <Link href="/" className="shrink-0 text-sm font-semibold tracking-tight">
          뉴스 포털
        </Link>

        <form action="/search" method="get" className="flex w-full max-w-[680px] items-center gap-2">
          <input
            name="q"
            placeholder="키워드로 뉴스 검색 (Google News RSS)"
            className="w-full rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm outline-none focus:border-gray-300"
          />
          <button
            type="submit"
            className="rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
          >
            검색
          </button>
        </form>

        <div className="ml-auto flex items-center gap-2">
          <CategoryPrefsButton />
          <RefreshButton />
          <Link
            href="/settings/sources"
            className="hidden rounded-full border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50 sm:inline-flex"
          >
            소스관리
          </Link>
        </div>
      </div>
    </header>
  );
}
