export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isCategoryKey } from "@/lib/categories";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = (await req.json()) as any;
    const category = String(body?.category ?? "").trim();

    if (!isCategoryKey(category)) {
      return NextResponse.json({ error: "invalid category" }, { status: 400 });
    }

    await prisma.newsItem.update({
      where: { id: params.id },
      data: { category },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "update failed" }, { status: 500 });
  }
}
