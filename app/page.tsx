import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { isCategoryKey, type CategoryKey, labelOfCategory } from "@/lib/categories";
import { kstStartDaysAgo, kstStartOfDay } from "@/lib/time";
import { TopHeader } from "./components/TopHeader";
import { PrimaryTabs } from "./components/nav/PrimaryTabs";
import { PeriodTabs, type PeriodKey } from "./components/nav/PeriodTabs";
import { CategoryBanners } from "./components/nav/CategoryBanners";
import { SourceChips } from "./components/nav/SourceChips";
import { NewsList } from "./components/news/NewsList";
import type { NewsListItem } from "./components/news/NewsCard";
import { WeatherWidget } from "./components/widgets/WeatherWidget";
import { FxWidget } from "./components/widgets/FxWidget";
import { getParam, type SearchParams } from "@/lib/params";

type HomeTab = "trending" | "latest";

function parsePreferredCategoriesFromCookie(): CategoryKey[] {
  const raw = cookies().get("cats")?.value;
  if (!raw) return [];
  const parts = raw.split(",").map((s) => s.trim()).filter(Boolean);
  return parts.filter(isCategoryKey);
}

function buildCategoryFilter(searchParams: SearchParams): {
  label: string;
  where: { category?: any };
} {
  const explicit = getParam(searchParams, "category");
  if (explicit && isCategoryKey(explicit)) {
    return { label: labelOfCategory(explicit), where: { category: explicit } };
  }

  const preferred = parsePreferredCategoriesFromCookie();
  if (preferred.length > 0) {
    return { label: `관심분야(${preferred.map(labelOfCategory).join(", ")})`, where: { category: { in: preferred } } };
  }

  return { label: "전체", where: {} };
}

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
  const tab = (getParam(searchParams, "tab") as HomeTab | undefined) ?? "trending";
  const period = (getParam(searchParams, "period") as PeriodKey | undefined) ?? "today";
  const source = getParam(searchParams, "source") ?? "";

  const categoryFilter = buildCategoryFilter(searchParams);

  // ✅ NewsItem 조회 조건
  const baseWhere: any = {
    ...categoryFilter.where,
    ...(source ? { source } : {}),
  };

  // ✅ 채널 칩 목록(현재 카테고리 필터는 반영하되, source 선택은 제외)
  const whereForSources: any = {
    ...categoryFilter.where,
  };
  const sourceAgg = await prisma.newsItem.groupBy({
    by: ["source"],
    where: whereForSources,
    // Prisma 5.x에서는 orderBy에서 _count._all 정렬이 지원되지 않습니다.
    // 대신, 항상 존재하는 필드(id)를 count 대상으로 사용하면 "그룹의 전체 개수"와 동일합니다.
    // 예: 그룹이 source라면 COUNT(id) == 해당 source의 기사 개수
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: 20,
  });

  const sources = sourceAgg.map((s) => ({ source: s.source, count: s._count.id }));

  // ✅ 리스트 데이터
  let items: NewsListItem[] = [];

  if (tab === "latest") {
    const rows = await prisma.newsItem.findMany({
      where: baseWhere,
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: 50,
    });

    items = rows.map((r) => ({
      id: r.id,
      title: r.title,
      description: r.description ?? null,
      source: r.source,
      category: r.category,
      publishedAt: r.publishedAt ? r.publishedAt.toISOString() : null,
      viewCount: r.viewCount,
      metricCount: r.viewCount,
      metricLabel: "누적조회",
    }));
  } else {
    // tab === "trending"
    if (period === "all") {
      const rows = await prisma.newsItem.findMany({
        where: baseWhere,
        orderBy: [{ viewCount: "desc" }, { publishedAt: "desc" }],
        take: 50,
      });

      items = rows.map((r) => ({
        id: r.id,
        title: r.title,
        description: r.description ?? null,
        source: r.source,
        category: r.category,
        publishedAt: r.publishedAt ? r.publishedAt.toISOString() : null,
        viewCount: r.viewCount,
        metricCount: r.viewCount,
        metricLabel: "누적조회",
      }));
    } else {
      const since =
        period === "today" ? kstStartOfDay(new Date()) : kstStartDaysAgo(7, new Date());

      const groups = await prisma.newsViewEvent.groupBy({
        by: ["newsItemId"],
        where: {
          viewedAt: { gte: since },
          newsItem: baseWhere,
        },
        // 여기서도 동일하게 COUNT(id)로 정렬하면 "기간 내 조회 이벤트 수" 기준으로 정렬됩니다.
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 50,
      });

      const ids = groups.map((g) => g.newsItemId);
      const idToCount = new Map(groups.map((g) => [g.newsItemId, g._count.id]));

      const rows = await prisma.newsItem.findMany({
        where: { id: { in: ids } },
      });

      const map = new Map(rows.map((r) => [r.id, r]));

      items = ids
        .map((id) => map.get(id))
        .filter((v): v is NonNullable<typeof v> => Boolean(v))
        .map((r) => ({
          id: r.id,
          title: r.title,
          description: r.description ?? null,
          source: r.source,
          category: r.category,
          publishedAt: r.publishedAt ? r.publishedAt.toISOString() : null,
          viewCount: r.viewCount,
          metricCount: idToCount.get(r.id) ?? 0,
          metricLabel: period === "today" ? "오늘 조회" : "7일 조회",
        }));
    }
  }

  return (
    <div>
      <TopHeader />

      <main className="mx-auto w-full max-w-[1400px] px-4 pb-10">
        <PrimaryTabs searchParams={searchParams} />
        <PeriodTabs searchParams={searchParams} />
        <CategoryBanners searchParams={searchParams} />
        <SourceChips searchParams={searchParams} sources={sources} />

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left: Filters summary */}
          <aside className="lg:col-span-3">
            <div className="rounded-2xl bg-white p-4 ring-1 ring-black/5">
              <h3 className="text-sm font-semibold">현재 필터</h3>
              <div className="mt-2 space-y-2 text-sm text-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">분야</span>
                  <span className="font-medium">{categoryFilter.label}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">채널</span>
                  <span className="font-medium">{source || "전체"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">탭</span>
                  <span className="font-medium">{tab === "trending" ? "인기" : "최신"}</span>
                </div>
                {tab === "trending" ? (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">기간</span>
                    <span className="font-medium">
                      {period === "today" ? "오늘" : period === "7d" ? "7일" : "전체"}
                    </span>
                  </div>
                ) : null}
              </div>

              <p className="mt-3 text-xs text-gray-500">
                “관심분야”는 우측 상단 버튼으로 저장되며, 홈 기본 필터로 적용됩니다.
              </p>
            </div>

            <div className="mt-6 space-y-6">
              <WeatherWidget />
              <FxWidget />
            </div>
          </aside>

          {/* Center: News list */}
          <section className="lg:col-span-9">
            <div className="mb-3 flex items-end justify-between">
              <h2 className="text-sm font-semibold">
                {tab === "trending"
                  ? period === "today"
                    ? "오늘 많이 본 뉴스"
                    : period === "7d"
                      ? "7일간 많이 본 뉴스"
                      : "누적 인기 뉴스"
                  : "최신 뉴스"}
              </h2>
              <p className="text-xs text-gray-500">클릭 시 조회가 기록됩니다.</p>
            </div>

            <NewsList items={items} />
          </section>
        </div>
      </main>
    </div>
  );
}
