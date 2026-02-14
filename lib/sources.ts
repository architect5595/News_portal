import type { CategoryKey } from "./categories";

export type DefaultSource = {
  name: string;
  url: string;
  category: CategoryKey;
};

export const DEFAULT_SOURCES: DefaultSource[] = [
  // ✅ 한국경제 RSS (공식 목록: https://www.hankyung.com/feed)
  { name: "한국경제-경제", url: "https://www.hankyung.com/feed/economy", category: "ECONOMY" },
  { name: "한국경제-금융/증권", url: "https://www.hankyung.com/feed/finance", category: "FINANCE" },
  { name: "한국경제-부동산", url: "https://www.hankyung.com/feed/realestate", category: "REAL_ESTATE" },
  { name: "한국경제-IT", url: "https://www.hankyung.com/feed/it", category: "IT_SCIENCE" },
  { name: "한국경제-정치", url: "https://www.hankyung.com/feed/politics", category: "POLITICS" },
  { name: "한국경제-국제", url: "https://www.hankyung.com/feed/international", category: "WORLD" },

  // ✅ 연합뉴스TV RSS (공식 목록: https://www.yonhapnewstv.co.kr/add/rss)
  { name: "연합뉴스TV-정치", url: "http://www.yonhapnewstv.co.kr/category/news/politics/feed/", category: "POLITICS" },
  { name: "연합뉴스TV-경제", url: "http://www.yonhapnewstv.co.kr/category/news/economy/feed/", category: "ECONOMY" },
  { name: "연합뉴스TV-사회", url: "http://www.yonhapnewstv.co.kr/category/news/society/feed/", category: "SOCIETY" },
  { name: "연합뉴스TV-세계", url: "http://www.yonhapnewstv.co.kr/category/news/international/feed/", category: "WORLD" },
  { name: "연합뉴스TV-문화/연예", url: "http://www.yonhapnewstv.co.kr/category/news/culture/feed/", category: "CULTURE" },

  // ✅ Google News RSS (언론사 다양성 확보용)
  // - 한국 지역/한국어 설정: hl=ko, gl=KR, ceid=KR:ko
  { name: "Google News-Top", url: "https://news.google.com/rss?hl=ko&gl=KR&ceid=KR:ko", category: "ETC" },
  { name: "Google News-비즈니스", url: "https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=ko&gl=KR&ceid=KR:ko", category: "FINANCE" },
  { name: "Google News-기술", url: "https://news.google.com/rss/headlines/section/topic/TECHNOLOGY?hl=ko&gl=KR&ceid=KR:ko", category: "IT_SCIENCE" },
  { name: "Google News-세계", url: "https://news.google.com/rss/headlines/section/topic/WORLD?hl=ko&gl=KR&ceid=KR:ko", category: "WORLD" },
  { name: "Google News-스포츠", url: "https://news.google.com/rss/headlines/section/topic/SPORTS?hl=ko&gl=KR&ceid=KR:ko", category: "SPORTS" },
  { name: "Google News-건강", url: "https://news.google.com/rss/headlines/section/topic/HEALTH?hl=ko&gl=KR&ceid=KR:ko", category: "HEALTH" },
  { name: "Google News-연예", url: "https://news.google.com/rss/headlines/section/topic/ENTERTAINMENT?hl=ko&gl=KR&ceid=KR:ko", category: "CULTURE" },
];
