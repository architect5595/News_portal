import Parser from "rss-parser";

export type ParsedNews = {
  source: string;
  title: string;

  // optional(?)은 "키 자체가 없을 수 있음"을 의미합니다.
  // 우리는 항상 description 키를 만들고 값만 undefined가 될 수 있으므로
  // "string | undefined"가 더 정확합니다.
  description: string | undefined;

  url: string;
  publishedAt: Date | undefined;
  imageUrl: string | undefined;
};

/**
 * rss-parser는 RSS 표준이 조금씩 다른 경우가 많아서 customFields로 확장 필드를 넓게 허용합니다.
 */
const parser: Parser = new Parser({
  customFields: {
    item: [
      ["media:content", "mediaContent"],
      ["media:thumbnail", "mediaThumbnail"],
      ["content:encoded", "contentEncoded"],
      ["source", "sourceTag"], // Google News RSS는 <source>를 자주 씁니다.
    ],
  },
});

function firstNonEmpty(...values: Array<string | undefined | null>): string | undefined {
  for (const v of values) {
    if (typeof v === "string" && v.trim().length > 0) return v.trim();
  }
  return undefined;
}

function extractImageUrl(item: any): string | undefined {
  const mediaContentUrl =
    item?.mediaContent?.$?.url ||
    (Array.isArray(item?.mediaContent) ? item.mediaContent?.[0]?.$?.url : undefined);

  const mediaThumbUrl =
    item?.mediaThumbnail?.$?.url ||
    (Array.isArray(item?.mediaThumbnail) ? item.mediaThumbnail?.[0]?.$?.url : undefined);

  const enclosureUrl = item?.enclosure?.url;

  const html = firstNonEmpty(item?.contentEncoded, item?.["content:encoded"]);
  const imgFromHtml = html?.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1];

  return firstNonEmpty(mediaContentUrl, mediaThumbUrl, enclosureUrl, imgFromHtml);
}

/**
 * RSS item에서 "출처"를 최대한 추정합니다.
 * - 일반 RSS: feed.title을 쓰는 편이 자연스럽습니다.
 * - Google News RSS: item의 <source>가 실제 언론사 이름인 경우가 많아서 그것을 우선합니다.
 */
function extractSourceName(feedTitle: string | undefined, feedUrl: string, item: any): string {
  const sourceFromItem =
    typeof item?.sourceTag === "string"
      ? item.sourceTag
      : (item?.sourceTag?.title as string | undefined);

  const fromTag = firstNonEmpty(sourceFromItem);
  if (fromTag) return fromTag;

  return firstNonEmpty(feedTitle, new URL(feedUrl).hostname) ?? "뉴스";
}

/**
 * 하나의 RSS URL을 파싱해서 뉴스 메타데이터 배열로 변환합니다.
 */
export async function fetchRssAsNews(
  feedUrl: string,
  opts?: { sourceNameOverride?: string }
): Promise<ParsedNews[]> {
  const feed = await parser.parseURL(feedUrl);

  const items = (feed.items || [])
    .map((item) => {
      const title = item.title?.trim();
      const url = item.link?.trim();
      if (!title || !url) return null;

      const source =
        opts?.sourceNameOverride?.trim() ||
        extractSourceName(feed.title, feedUrl, item);

      return {
        source,
        title,
        description: firstNonEmpty(item.contentSnippet, (item as any).summary, item.content),
        url,
        publishedAt: item.isoDate ? new Date(item.isoDate) : undefined,
        imageUrl: extractImageUrl(item),
      } satisfies ParsedNews;
    })
    .filter((v): v is ParsedNews => v !== null);

  return items;
}
