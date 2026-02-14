import Link from "next/link";
import { prisma } from "@/lib/db";
import { SearchClient } from "./searchClient";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; when?: string; site?: string };
}) {
  const q = (searchParams.q || "").trim();
  const when = (searchParams.when || "7d").trim();
  const site = (searchParams.site || "").trim();

  const local = q
    ? await prisma.newsItem.findMany({
        where: {
          OR: [
            { title: { contains: q } },
            { description: { contains: q } },
            { source: { contains: q } },
          ],
        },
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        take: 20,
      })
    : [];

  return (
    <div>
      <header className="sticky top-0 z-20 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1000px] items-center gap-3 px-4 py-3">
          <Link href="/" className="rounded-full border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50">
            ← 홈
          </Link>
          <h1 className="text-sm font-semibold">검색</h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1000px] px-4 py-8">
        <div className="rounded-2xl bg-white p-6 ring-1 ring-black/5">
          <form action="/search" method="get" className="grid grid-cols-1 gap-2 sm:grid-cols-6">
            <input
              name="q"
              defaultValue={q}
              placeholder="키워드 (예: 삼성전자, 부동산, 금리)"
              className="sm:col-span-3 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-gray-300"
            />
            <select
              name="when"
              defaultValue={when}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm"
            >
              <option value="1h">최근 1시간</option>
              <option value="1d">최근 1일</option>
              <option value="7d">최근 7일</option>
              <option value="30d">최근 30일</option>
            </select>
            <input
              name="site"
              defaultValue={site}
              placeholder="특정 사이트 (예: mk.co.kr)"
              className="sm:col-span-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-gray-300"
            />
            <button className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black">
              검색
            </button>
          </form>

          <p className="mt-3 text-xs text-gray-500">
            Google News RSS 검색을 이용합니다. “site:” / “when:” 같은 고급 검색이 동작할 수 있습니다.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <section className="lg:col-span-7">
            <h2 className="mb-3 text-sm font-semibold">Google News 결과</h2>
            <SearchClient q={q} when={when} site={site} />
          </section>

          <aside className="lg:col-span-5">
            <h2 className="mb-3 text-sm font-semibold">내 DB(수집된 뉴스)에서 찾기</h2>
            <div className="space-y-2">
              {q && local.length === 0 ? (
                <div className="rounded-2xl bg-white p-4 text-sm text-gray-600 ring-1 ring-black/5">
                  로컬 DB에는 결과가 없습니다. Google News 결과에서 “추가”를 눌러 저장할 수 있습니다.
                </div>
              ) : null}

              {local.map((it) => (
                <Link
                  key={it.id}
                  href={`/news/${it.id}`}
                  className="block rounded-2xl bg-white p-4 ring-1 ring-black/5 hover:bg-gray-50"
                >
                  <div className="text-xs text-gray-500">{it.source} · {it.category}</div>
                  <div className="mt-1 text-sm font-semibold">{it.title}</div>
                </Link>
              ))}

              {!q ? (
                <div className="rounded-2xl bg-white p-4 text-sm text-gray-600 ring-1 ring-black/5">
                  키워드를 입력해 검색하세요.
                </div>
              ) : null}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
