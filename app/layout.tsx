import type { Metadata } from "next";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "뉴스 포털 (토스 스타일)",
    template: "%s | 뉴스 포털",
  },
  description:
    "많이 본 뉴스(오늘/7일/전체), 최신 뉴스, 한국 뉴스 RSS + Google News 검색, 날씨/환율 위젯을 제공하는 개인용 뉴스 포털.",
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "뉴스 포털 (토스 스타일)",
    description:
      "많이 본 뉴스(오늘/7일/전체), 최신 뉴스, 한국 뉴스 RSS + Google News 검색, 날씨/환율 위젯.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <div className="min-h-screen">
          {children}
          <footer className="mt-10 border-t bg-white">
            <div className="mx-auto w-full max-w-[1400px] px-4 py-6 text-xs text-gray-500">
              <p>
                © {new Date().getFullYear()} 뉴스 포털. RSS/외부 링크 기반 예제 프로젝트.
              </p>
              <p className="mt-1">
                환율 데이터: ExchangeRate-API(Open Access). 날씨 데이터: Open-Meteo.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
