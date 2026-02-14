import { NewsCard, type NewsListItem } from "./NewsCard";

export function NewsList({ items }: { items: NewsListItem[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-6 text-sm text-gray-600 ring-1 ring-black/5">
        뉴스가 없습니다. 상단 <b>뉴스 업데이트</b> 버튼을 눌러 RSS를 수집하거나, 검색 탭에서
        원하는 키워드를 검색 후 추가하세요.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((it, idx) => (
        <NewsCard key={it.id} item={it} rank={idx + 1} />
      ))}
    </div>
  );
}
