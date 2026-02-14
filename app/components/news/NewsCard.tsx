import Link from "next/link";
import { labelOfCategory, type CategoryKey } from "@/lib/categories";
import { formatKoreanDate } from "@/lib/time";

export type NewsListItem = {
  id: string;
  title: string;
  description: string | null;
  source: string;
  category: string;
  publishedAt: string | null;
  viewCount: number;
  metricCount: number;
  metricLabel: string;
};

export function NewsCard({ item, rank }: { item: NewsListItem; rank: number }) {
  const cat = (item.category as CategoryKey) ?? "ETC";

  return (
    <Link
      href={`/news/${item.id}`}
      className="group block rounded-2xl bg-white p-4 ring-1 ring-black/5 hover:bg-gray-50"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-sm font-semibold text-white">
          {rank}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-700">
              {item.source}
            </span>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-700">
              {labelOfCategory(cat)}
            </span>
            <span className="ml-auto text-[11px] text-gray-500">
              {item.metricLabel}: <b className="text-gray-900">{item.metricCount}</b>
            </span>
          </div>

          <h3 className="mt-2 text-sm font-semibold text-gray-900 group-hover:underline">
            {item.title}
          </h3>

          {item.description ? (
            <p className="mt-2 text-xs text-gray-600">{item.description}</p>
          ) : null}

          <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-gray-500">
            <span>발행: {formatKoreanDate(item.publishedAt)}</span>
            <span>누적조회: {item.viewCount}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
