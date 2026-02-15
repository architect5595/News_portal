import { NextResponse } from "next/server";
import { isCategoryKey } from "@/lib/categories";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = (await req.json()) as any;
    const category = String(body?.category ?? "").trim();

    if (!isCategoryKey(category)) {
      return NextResponse.json({ error: "invalid category" }, { status: 400 });
    }

    // ✅ Prisma는 "요청이 왔을 때"만 로드/초기화
    const { prisma } = await import("@/lib/db");

    await prisma.newsItem.update({
      where: { id: params.id },
      data: { category },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    // ✅ 원인 파악을 위해 에러 로그는 남기는 게 좋습니다 (Vercel logs에서 확인 가능)
    console.error(e);
    return NextResponse.json({ error: "update failed" }, { status: 500 });
  }
}
