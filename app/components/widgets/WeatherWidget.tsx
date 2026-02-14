"use client";

import { useEffect, useMemo, useState } from "react";

type WeatherPayload = {
  city: string;
  country: string;
  timezone: string;
  current: {
    temperatureC: number | null;
    apparentTemperatureC: number | null;
    windSpeedMs: number | null;
    weatherCode: number | null;
    weatherText: string;
  };
  error?: string;
};

const DEFAULT_CITIES = ["Seoul", "Tokyo", "New York", "London"];

export function WeatherWidget() {
  const [city, setCity] = useState(DEFAULT_CITIES[0]);
  const [input, setInput] = useState("");
  const [data, setData] = useState<WeatherPayload | null>(null);
  const [loading, setLoading] = useState(false);

  const cities = useMemo(() => DEFAULT_CITIES, []);

  async function load(targetCity: string) {
    try {
      setLoading(true);
      const res = await fetch(`/api/widgets/weather?city=${encodeURIComponent(targetCity)}`);
      const json = (await res.json()) as WeatherPayload;
      if (!res.ok) {
        setData({ city: targetCity, country: "", timezone: "", current: { temperatureC: null, apparentTemperatureC: null, windSpeedMs: null, weatherCode: null, weatherText: "" }, error: json?.error ?? "오류" });
        return;
      }
      setData(json);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load(city);
  }, [city]);

  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-black/5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">세계 날씨</h3>
        <span className="text-[11px] text-gray-500">Open-Meteo</span>
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {cities.map((c) => (
          <button
            key={c}
            onClick={() => setCity(c)}
            className={[
              "shrink-0 rounded-full px-3 py-1 text-xs ring-1",
              c === city ? "bg-gray-900 text-white ring-gray-900" : "bg-white text-gray-600 ring-gray-200 hover:bg-gray-50",
            ].join(" ")}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="도시 검색 (예: Paris)"
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-gray-300"
        />
        <button
          onClick={() => input.trim() && setCity(input.trim())}
          className="rounded-xl bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-black"
        >
          조회
        </button>
      </div>

      <div className="mt-4 rounded-xl bg-gray-50 p-3">
        {loading ? (
          <div className="text-sm text-gray-600">불러오는 중...</div>
        ) : data?.error ? (
          <div className="text-sm text-red-600">{data.error}</div>
        ) : data ? (
          <>
            <div className="flex items-baseline justify-between">
              <div className="text-sm font-semibold">
                {data.city} <span className="text-xs font-normal text-gray-500">({data.country})</span>
              </div>
              <div className="text-xs text-gray-500">{data.timezone}</div>
            </div>

            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-lg bg-white p-2 ring-1 ring-black/5">
                <div className="text-[11px] text-gray-500">현재</div>
                <div className="mt-1 text-base font-semibold">
                  {data.current.temperatureC ?? "-"}°C
                </div>
              </div>
              <div className="rounded-lg bg-white p-2 ring-1 ring-black/5">
                <div className="text-[11px] text-gray-500">체감</div>
                <div className="mt-1 text-base font-semibold">
                  {data.current.apparentTemperatureC ?? "-"}°C
                </div>
              </div>
              <div className="rounded-lg bg-white p-2 ring-1 ring-black/5">
                <div className="text-[11px] text-gray-500">풍속</div>
                <div className="mt-1 text-base font-semibold">
                  {data.current.windSpeedMs ?? "-"} m/s
                </div>
              </div>
              <div className="rounded-lg bg-white p-2 ring-1 ring-black/5">
                <div className="text-[11px] text-gray-500">상태</div>
                <div className="mt-1 text-base font-semibold">
                  {data.current.weatherText || "-"}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-sm text-gray-600">데이터 없음</div>
        )}
      </div>
    </div>
  );
}
