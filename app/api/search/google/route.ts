import { NextResponse } from "next/server";
import { fetchRssAsNews } from "@/lib/rss";
import { buildGoogleNewsSearchUrl } from "@/lib/googleNews";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  const when = (searchParams.get("when") || "").trim(); // 예: 1h, 1d, 7d, 30d
  const site = (searchParams.get("site") || "").trim(); // 예: mk.co.kr

  if (!q) {
    return NextResponse.json({ error: "q required" }, { status: 400 });
  }

  let query = q;
  if (when && !query.includes("when:")) query = `${query} when:${when}`;
  if (site && !query.includes("site:")) query = `${query} site:${site}`;

  try {
    const url = buildGoogleNewsSearchUrl(query);
    const items = await fetchRssAsNews(url);

    return NextResponse.json({
      query,
      count: items.length,
      items: items.slice(0, 50).map((it) => ({
        source: it.source,
        title: it.title,
        description: it.description ?? null,
        url: it.url,
        publishedAt: it.publishedAt ? it.publishedAt.toISOString() : null,
        imageUrl: it.imageUrl ?? null,
      })),
    });
  } catch {
    return NextResponse.json({ error: "google rss fetch failed" }, { status: 500 });
  }
}
