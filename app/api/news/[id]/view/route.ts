import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.newsItem.update({
      where: { id: params.id },
      data: {
        viewCount: { increment: 1 },
        views: { create: {} }, // viewedAt는 default(now())
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
