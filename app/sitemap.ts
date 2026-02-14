import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";

  // ✅ 너무 큰 사이트맵 방지: 최신 500개만 노출
  const items = await prisma.newsItem.findMany({
    select: { id: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
    take: 500,
  });

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/search`, lastModified: new Date() },
    { url: `${base}/settings/sources`, lastModified: new Date() },
  ];

  const newsRoutes: MetadataRoute.Sitemap = items.map((it) => ({
    url: `${base}/news/${it.id}`,
    lastModified: it.updatedAt,
  }));

  return [...staticRoutes, ...newsRoutes];
}
