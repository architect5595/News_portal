import Link from "next/link";
import { prisma } from "@/lib/db";
import { SourceManager } from "./sourceManager";

export default async function SourcesPage() {
  const sources = await prisma.newsSource.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div>
      <header className="sticky top-0 z-20 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1000px] items-center gap-3 px-4 py-3">
          <Link href="/" className="rounded-full border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50">
            ← 홈
          </Link>
          <h1 className="text-sm font-semibold">뉴스 소스(채널) 관리</h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1000px] px-4 py-8">
        <div className="rounded-2xl bg-white p-6 ring-1 ring-black/5">
          <h2 className="text-sm font-semibold">기본 소스 추가</h2>
          <p className="mt-1 text-xs text-gray-500">
            한국경제/연합뉴스TV/Google News RSS 기본 목록을 DB에 추가합니다. (중복은 자동 스킵)
          </p>
          <div className="mt-3">
            <SourceManager initialSources={sources} />
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-white p-6 ring-1 ring-black/5">
          <h2 className="text-sm font-semibold">TIP</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
            <li>RSS URL이 공개되어 있지 않은 언론사는 “검색” 탭에서 Google News RSS 검색으로 대체할 수 있습니다.</li>
            <li>소스를 비활성화하면 다음 “뉴스 업데이트”에서 수집 대상에서 제외됩니다.</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
