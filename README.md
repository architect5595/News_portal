# toss-news-portal (토스증권 스타일 뉴스 포털)

## 핵심 기능
- **인기 뉴스 랭킹**: 오늘 / 7일 / 전체 (조회 이벤트 로그 기반)
- **최신 뉴스**: 발행일 기준 정렬
- **분야(카테고리) 배너/필터** + **관심분야 저장(쿠키)**
- **뉴스 채널(언론사) 필터**
- **Google News RSS 검색** + 검색 결과를 DB에 **추가(저장)**
- **세계 날씨(Open‑Meteo)** / **실시간 환율(ExchangeRate‑API Open Access)** 위젯
- **RSS 소스 관리 페이지**: 기본 소스 시드 + RSS URL 추가/비활성화/삭제

## 시작 방법(요약)
초보자용 아주 자세한 가이드는 `BEGINNER_GUIDE_KR.md`를 참고하세요.

1) 압축 해제 후 폴더로 이동  
2) Node.js(LTS) 설치  
3) 터미널에서 아래 실행

```bash
npm install
copy .env.example .env   # (Windows PowerShell이면 Copy-Item 사용)
npx prisma migrate dev --name init
npm run dev
```

브라우저에서 `http://localhost:3000` 접속 후 상단 **뉴스 업데이트** 버튼을 누르세요.

## 배포(도메인) 안내
- 로컬(localhost) 대신 전 세계에서 접속 가능한 주소로 만들려면 Vercel/Netlify/Cloudflare Pages 등으로 배포해야 합니다.
- 단, **SQLite(file:./dev.db)**는 서버리스 환경에서 영속 저장이 어려울 수 있어, 운영 배포에는 Postgres(Neon/Supabase/Vercel Postgres 등)를 권장합니다.

자세한 단계별 배포 가이드는 `BEGINNER_GUIDE_KR.md`에 포함되어 있습니다.
