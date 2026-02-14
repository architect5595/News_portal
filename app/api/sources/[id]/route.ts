import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isCategoryKey } from "@/lib/categories";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = (await req.json()) as any;

    const data: any = {};

    if (typeof body?.enabled === "boolean") data.enabled = body.enabled;

    if (typeof body?.name === "string" && body.name.trim()) data.name = body.name.trim();

    if (typeof body?.url === "string" && body.url.trim()) {
      try {
        new URL(body.url.trim());
        data.url = body.url.trim();
      } catch {
        return NextResponse.json({ error: "invalid url" }, { status: 400 });
      }
    }

    if (typeof body?.category === "string") {
      const c = body.category.trim();
      data.category = isCategoryKey(c) ? c : "ETC";
    }

    const updated = await prisma.newsSource.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json({ ok: true, source: updated });
  } catch {
    return NextResponse.json({ error: "update failed" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.newsSource.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "delete failed" }, { status: 500 });
  }
}
