import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { DEFAULT_SOURCES } from "@/lib/sources";

export async function POST() {
  try {
    // ✅ SQLite + Prisma 5.x 호환
    // - SQLite에서는 createMany 옵션 중 일부가 제한될 수 있어, upsert로 멱등 시드를 구성합니다.
    let upserted = 0;

    for (const s of DEFAULT_SOURCES) {
      await prisma.newsSource.upsert({
        // NewsSource.url 이 @unique 라는 전제
        where: { url: s.url },
        update: {
          name: s.name,
          category: s.category,
          enabled: true,
        },
        create: {
          name: s.name,
          url: s.url,
          category: s.category,
          enabled: true,
        },
      });
      upserted += 1;
    }

    return NextResponse.json({ ok: true, upserted });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "seed failed" }, { status: 500 });
  }
}
