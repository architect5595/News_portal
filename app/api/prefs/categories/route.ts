import { NextResponse } from "next/server";
import { isCategoryKey } from "@/lib/categories";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as any;
    const arr = Array.isArray(body?.categories) ? body.categories : [];
    const cats = arr.map((v: any) => String(v).trim()).filter(isCategoryKey);

    const res = NextResponse.json({ ok: true, categories: cats });

    if (cats.length === 0) {
      // 쿠키 삭제
      res.cookies.set("cats", "", { path: "/", maxAge: 0 });
    } else {
      res.cookies.set("cats", encodeURIComponent(cats.join(",")), {
        path: "/",
        maxAge: 60 * 60 * 24 * 365, // 1년
        sameSite: "lax",
      });
    }

    return res;
  } catch {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }
}
