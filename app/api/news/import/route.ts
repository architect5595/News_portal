import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isCategoryKey } from "@/lib/categories";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as any;

    const url = String(body?.url ?? "").trim();
    const title = String(body?.title ?? "").trim();

    if (!url || !title) {
      return NextResponse.json({ error: "url/title required" }, { status: 400 });
    }

    const categoryRaw = String(body?.category ?? "ETC").trim();
    const category = isCategoryKey(categoryRaw) ? categoryRaw : "ETC";

    const source = String(body?.source ?? "Google News").trim() || "Google News";
    const description = typeof body?.description === "string" ? body.description : null;

    const publishedAt =
      typeof body?.publishedAt === "string" || body?.publishedAt instanceof Date
        ? new Date(body.publishedAt)
        : undefined;

    const imageUrl = typeof body?.imageUrl === "string" ? body.imageUrl : undefined;

    const existing = await prisma.newsItem.findUnique({ where: { url } });

    if (!existing) {
      const created = await prisma.newsItem.create({
        data: {
          source,
          category,
          title,
          description,
          url,
          publishedAt,
          imageUrl,
        },
      });

      return NextResponse.json({ ok: true, id: created.id, inserted: true });
    }

    const updated = await prisma.newsItem.update({
      where: { url },
      data: {
        source,
        title,
        description,
        // ✅ 검색 결과에서 사용자가 지정한 category를 반영
        category,
        publishedAt: publishedAt ?? existing.publishedAt ?? undefined,
        imageUrl: imageUrl ?? existing.imageUrl ?? undefined,
      },
    });

    return NextResponse.json({ ok: true, id: updated.id, inserted: false });
  } catch {
    return NextResponse.json({ error: "import failed" }, { status: 500 });
  }
}
