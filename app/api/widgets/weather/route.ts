import { NextResponse } from "next/server";
import { weatherCodeToKorean } from "@/lib/weatherCodes";

type GeoResult = {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
};

async function geocode(city: string): Promise<GeoResult | null> {
  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", city);
  url.searchParams.set("count", "1");
  url.searchParams.set("language", "ko");
  url.searchParams.set("format", "json");

  const res = await fetch(url.toString(), { next: { revalidate: 60 * 60 } });
  if (!res.ok) return null;

  const data = (await res.json()) as any;
  const r = data?.results?.[0];
  if (!r) return null;

  return {
    name: r.name,
    country: r.country,
    latitude: r.latitude,
    longitude: r.longitude,
    timezone: r.timezone,
  };
}

async function currentWeather(lat: number, lon: number) {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lon));
  url.searchParams.set("current", "temperature_2m,apparent_temperature,weather_code,wind_speed_10m");
  url.searchParams.set("timezone", "auto");

  const res = await fetch(url.toString(), { next: { revalidate: 10 * 60 } });
  if (!res.ok) throw new Error("weather fetch failed");
  const data = (await res.json()) as any;

  const c = data?.current;
  const code = typeof c?.weather_code === "number" ? c.weather_code : null;

  return {
    temperatureC: c?.temperature_2m ?? null,
    apparentTemperatureC: c?.apparent_temperature ?? null,
    windSpeedMs: c?.wind_speed_10m ?? null,
    weatherCode: code,
    weatherText: weatherCodeToKorean(code),
  };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city")?.trim() || "Seoul";

  try {
    const geo = await geocode(city);
    if (!geo) {
      return NextResponse.json({ error: "도시를 찾을 수 없습니다." }, { status: 404 });
    }

    const current = await currentWeather(geo.latitude, geo.longitude);

    return NextResponse.json({
      city: geo.name,
      country: geo.country,
      timezone: geo.timezone,
      latitude: geo.latitude,
      longitude: geo.longitude,
      current,
    });
  } catch (e: any) {
    return NextResponse.json({ error: "날씨 데이터를 가져오지 못했습니다." }, { status: 500 });
  }
}
