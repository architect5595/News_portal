import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { fetchRssAsNews } from "@/lib/rss";
import { DEFAULT_SOURCES } from "@/lib/sources";
import { isCategoryKey } from "@/lib/categories";

function inferPublisher(feedUrl: string): string | null {
  try {
    const host = new URL(feedUrl).hostname;
    if (host.includes("hankyung.com")) return "한국경제";
    if (host.includes("yonhapnewstv.co.kr")) return "연합뉴스TV";
    // Google News는 item별 source(언론사)가 따로 있으므로 override 하지 않음
    if (host.includes("news.google.com")) return null;
    return host;
  } catch {
    return null;
  }
}

async function ensureDefaultSources() {
  const count = await prisma.newsSource.count();
  if (count > 0) return;

  await prisma.newsSource.createMany({
    data: DEFAULT_SOURCES.map((s) => ({
      name: s.name,
      url: s.url,
      category: s.category,
      enabled: true,
    })),
  });
}

export async function POST() {
  try {
    await ensureDefaultSources();

    const sources = await prisma.newsSource.findMany({
      where: { enabled: true },
      orderBy: { createdAt: "asc" },
    });

    let inserted = 0;
    let updated = 0;

    for (const src of sources) {
      const publisher = inferPublisher(src.url);
      const items = await fetchRssAsNews(src.url, {
        sourceNameOverride: publisher ?? undefined,
      });

      for (const it of items) {
        const existing = await prisma.newsItem.findUnique({ where: { url: it.url } });
        if (!existing) {
          await prisma.newsItem.create({
            data: {
              source: it.source,
              sourceId: src.id,
              category: isCategoryKey(src.category) ? src.category : "ETC",
              title: it.title,
              description: it.description,
              url: it.url,
              publishedAt: it.publishedAt,
              imageUrl: it.imageUrl,
            },
          });
          inserted += 1;
        } else {
          await prisma.newsItem.update({
            where: { url: it.url },
            data: {
              // ✅ 사용자가 수동으로 바꾼 category는 덮어쓰지 않음
              source: it.source,
              sourceId: src.id,
              title: it.title,
              description: it.description,
              publishedAt: it.publishedAt ?? existing.publishedAt,
              imageUrl: it.imageUrl ?? existing.imageUrl,
            },
          });
          updated += 1;
        }
      }
    }

    return NextResponse.json({ ok: true, inserted, updated, sources: sources.length });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "refresh failed" }, { status: 500 });
  }
}
