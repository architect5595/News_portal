import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatKoreanDate } from "@/lib/time";
import { ViewTracker } from "./viewTracker";
import { CategoryEditor } from "./categoryEditor";
import { BackButton } from "./backButton";

export default async function NewsDetail({ params }: { params: { id: string } }) {
  const item = await prisma.newsItem.findUnique({ where: { id: params.id } });
  if (!item) return notFound();

  return (
    <div>
      <header className="sticky top-0 z-20 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[900px] items-center gap-3 px-4 py-3">
          <BackButton />
          <Link href="/" className="text-sm font-semibold">
            홈
          </Link>
          <span className="text-xs text-gray-400">/</span>
          <span className="text-xs text-gray-600">{item.source}</span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[900px] px-4 py-8">
        <ViewTracker newsId={item.id} />

        <div className="rounded-2xl bg-white p-6 ring-1 ring-black/5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
              {item.source}
            </span>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
              {item.category}
            </span>
            <span className="ml-auto text-xs text-gray-500">누적조회: {item.viewCount}</span>
          </div>

          <h1 className="mt-3 text-xl font-semibold leading-relaxed">{item.title}</h1>

          {item.description ? (
            <p className="mt-4 whitespace-pre-line text-sm text-gray-700">
              {item.description}
            </p>
          ) : (
            <p className="mt-4 text-sm text-gray-500">요약이 없는 기사입니다.</p>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-gray-500">
            <span>발행: {formatKoreanDate(item.publishedAt ? item.publishedAt.toISOString() : null)}</span>
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-gray-900 px-3 py-1 text-white hover:bg-black"
            >
              원문 보기
            </a>
          </div>

          <div className="mt-6 border-t pt-4">
            <h2 className="text-sm font-semibold">분야 직접 선택</h2>
            <p className="mt-1 text-xs text-gray-500">
              기사(뉴스 아이템)의 category 값을 직접 바꿉니다. (DB에 저장됨)
            </p>
            <div className="mt-3">
              <CategoryEditor newsId={item.id} current={item.category} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
