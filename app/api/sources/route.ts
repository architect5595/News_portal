import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isCategoryKey } from "@/lib/categories";

export async function GET() {
  const sources = await prisma.newsSource.findMany({ orderBy: { createdAt: "asc" } });
  return NextResponse.json({ sources });
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as any;

    const name = String(body?.name ?? "").trim();
    const url = String(body?.url ?? "").trim();
    const categoryRaw = String(body?.category ?? "ETC").trim();
    const category = isCategoryKey(categoryRaw) ? categoryRaw : "ETC";

    if (!name || !url) {
      return NextResponse.json({ error: "name/url required" }, { status: 400 });
    }

    // URL 형식 검증(기본)
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: "invalid url" }, { status: 400 });
    }

    const created = await prisma.newsSource.create({
      data: { name, url, category, enabled: true },
    });

    return NextResponse.json({ ok: true, source: created });
  } catch (e: any) {
    return NextResponse.json({ error: "create failed" }, { status: 500 });
  }
}
