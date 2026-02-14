import { NextResponse } from "next/server";

type FxResponse = {
  base_code: string;
  time_last_update_unix: number;
  time_last_update_utc: string;
  time_next_update_unix: number;
  time_next_update_utc: string;
  rates: Record<string, number>;
  result?: string;
};

async function fetchFxBaseUSD(): Promise<FxResponse> {
  const url = "https://open.er-api.com/v6/latest/USD";
  const res = await fetch(url, { next: { revalidate: 60 * 60 } }); // 1시간 캐시 권장
  if (!res.ok) throw new Error("fx fetch failed");
  return (await res.json()) as FxResponse;
}

export async function GET() {
  try {
    const data = await fetchFxBaseUSD();

    const r = data.rates || {};
    const usdToKrw = r["KRW"];
    const usdToJpy = r["JPY"];
    const usdToEur = r["EUR"];
    const usdToCny = r["CNY"];

    if (!usdToKrw || !usdToJpy || !usdToEur || !usdToCny) {
      return NextResponse.json({ error: "환율 데이터가 불완전합니다." }, { status: 502 });
    }

    // ✅ KRW 기준으로 보기 좋게 변환
    const oneUsdInKrw = usdToKrw;
    const oneEurInKrw = usdToKrw / usdToEur;
    const oneCnyInKrw = usdToKrw / usdToCny;
    const oneJpyInKrw = usdToKrw / usdToJpy;
    const hundredJpyInKrw = oneJpyInKrw * 100;

    return NextResponse.json({
      updatedUtc: data.time_last_update_utc,
      nextUpdateUtc: data.time_next_update_utc,
      rates: {
        "USD/KRW": oneUsdInKrw,
        "EUR/KRW": oneEurInKrw,
        "CNY/KRW": oneCnyInKrw,
        "100JPY/KRW": hundredJpyInKrw,
      },
      note: "Source: ExchangeRate-API Open Access (open.er-api.com).",
    });
  } catch (e: any) {
    return NextResponse.json({ error: "환율 데이터를 가져오지 못했습니다." }, { status: 500 });
  }
}
