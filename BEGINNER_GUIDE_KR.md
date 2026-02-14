# 초보자용 설치/실행/배포 가이드 (Windows 기준)

이 문서는 **압축 풀기부터** 로컬 실행, 뉴스 수집, 자주 발생하는 오류 해결, 그리고 **도메인(구글 검색 가능한 주소)** 로 배포하는 단계까지를 **하나씩** 안내합니다.

---

## 0) 준비물 체크리스트

### 필수 프로그램
1. **Chrome** (또는 Edge)
2. **VS Code** (코드 편집기)
3. **Node.js LTS** (npm 포함)
4. (배포용) **Git**
5. (배포용) GitHub 계정 + Vercel 계정

---

## 1) ZIP 압축 풀기 (Windows)

1. 다운로드한 zip 파일을 찾습니다.  
   예: `C:\Users\strin\Downloads\toss-news-clone-v3-portal.zip`

2. zip 파일에서 **우클릭 → “모두 압축 풀기(Extract All…)”** 를 선택합니다.

3. 압축을 풀면 폴더가 생깁니다.  
   예시 폴더 구조(중요):
   - `toss-news-clone-v3-portal\toss-news-clone\package.json`  ✅ 여기 있어야 정상

> ✅ 핵심: **package.json이 있는 폴더**에서 npm을 실행해야 합니다.

---

## 2) “package.json이 있는 폴더”로 이동 (PowerShell)

1. Windows에서 **PowerShell**을 엽니다.
2. 아래처럼 `cd`로 이동합니다 (본인 경로에 맞게 수정):

```powershell
cd "C:\Users\strin\Downloads\toss-news-clone-v3-portal\toss-news-clone"
```

3. 정말 `package.json`이 있는지 확인합니다:

```powershell
dir
```

목록에 `package.json`이 보여야 합니다.

---

## 3) 의존성 설치 (npm install)

아래 명령을 실행합니다:

```powershell
npm install
```

- 처음 설치는 시간이 조금 걸릴 수 있습니다.
- 오류가 나면, 일단 에러 메시지를 그대로 복사해서 보내주시면 “원인→해결”로 안내 가능합니다.

---

## 4) .env 파일 만들기 (DATABASE_URL 설정)

이 프로젝트는 Prisma가 DB에 접속하기 위해 **DATABASE_URL** 환경변수가 필요합니다.

1. `.env.example`을 `.env`로 복사합니다:

```powershell
Copy-Item .env.example .env
```

2. `.env` 파일을 VS Code로 열어서 확인합니다:

```env
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

> ✅ 로컬에서는 위 그대로 두면 됩니다.

---

## 5) Prisma 마이그레이션 (DB 테이블 만들기)

아래 명령을 실행합니다:

```powershell
npx prisma migrate dev --name init
```

성공하면:
- `dev.db`(SQLite 파일)가 생기고
- `NewsItem`, `NewsViewEvent`, `NewsSource` 테이블이 생성됩니다.

---

## 6) 개발 서버 실행

```powershell
npm run dev
```

이제 브라우저에서:
- `http://localhost:3000` 접속

---

## 7) 뉴스 수집하기 (RSS → DB)

홈에서 우측 상단 **“뉴스 업데이트”** 버튼을 누르면:
- 기본 RSS 소스(한국경제/연합뉴스TV/Google News 등)를 읽어서
- DB에 저장합니다.

---

## 8) 기능 사용법

### 8-1) “오늘/7일/전체 많이 본 뉴스”
- 뉴스 상세페이지를 클릭하면 조회 이벤트가 기록됩니다.
- **오늘/7일** 탭은 `NewsViewEvent`(조회 이벤트 로그) 기준으로 랭킹을 계산합니다.
- **전체** 탭은 `NewsItem.viewCount` 누적값 기준입니다.

### 8-2) 관심 분야(카테고리) 직접 선택
- 상단의 **“관심분야”** 버튼 → 카테고리 선택 → 저장
- 쿠키로 저장되어 홈에서 기본 필터로 적용됩니다.

### 8-3) 뉴스 채널(언론사) 검색/필터
- 홈의 “뉴스 채널” 칩을 클릭하면 해당 채널만 필터링됩니다.
- “검색” 페이지에서 키워드로 Google News RSS 검색 → 다양한 언론사 결과가 나옵니다.

### 8-4) 분야를 직접 지정(분류)
- 검색 결과에서 **저장 시 분야**를 선택한 다음 “추가” 버튼을 누르면
  저장되는 뉴스 아이템에 해당 category가 저장됩니다.
- 뉴스 상세 화면에서도 “분야 직접 선택”에서 바꿀 수 있습니다.

### 8-5) 공간 활용(네이버형 2~3단 레이아웃)
- 큰 화면에서는 좌(필터/위젯) + 우(뉴스 리스트) 형태로 넓게 사용합니다.
- 우측(위젯 영역)에 **세계 날씨 / 실시간 환율**을 표시합니다.

---

## 9) 자주 나오는 오류 해결

### 9-1) npm error code ENOENT … package.json 을 못 찾음
원인:
- `package.json`이 없는 폴더에서 `npm install`을 실행했을 가능성이 99%입니다.

해결:
1) `cd`를 다시 확인  
2) `dir`로 package.json 있는지 확인  
3) package.json 있는 폴더에서 다시 실행

---

### 9-2) Prisma P1012: Environment variable not found: DATABASE_URL
원인:
- `.env` 파일이 없거나, `.env`에 `DATABASE_URL`이 없습니다.

해결:
1) `Copy-Item .env.example .env`  
2) `.env`에 `DATABASE_URL="file:./dev.db"` 있는지 확인  
3) 다시 `npx prisma migrate dev --name init`

---

### 9-3) SQLite에서 enum 미지원 오류 (이전 버전에서 발생)
이 버전(v3)은 SQLite에서도 동작하도록 **enum을 사용하지 않고 category를 String으로 저장**합니다.

---

## 10) localhost → 도메인(구글 검색 가능한 주소)로 배포하기

여기서부터는 “다른 사람이 접속 가능한 공개 주소”를 만드는 단계입니다.

---

### 10-1) 먼저 알아야 할 것 (중요)
- 로컬에서는 항상 `localhost`입니다.
- 공개 도메인은 **배포(Deploy)** 를 해야 생깁니다.
- Vercel 같은 플랫폼에 올리면 `https://프로젝트명.vercel.app` 같은 주소가 자동으로 생깁니다.

> ⚠️ 운영 배포에서는 SQLite 파일 DB가 서버리스 환경에서 영속 저장이 어려울 수 있습니다.  
> 즉, 조회수/뉴스 데이터가 리셋될 수 있습니다.  
> “실습/데모”는 가능하지만, “운영/검색 노출”까지 하려면 Postgres(Neon/Supabase 등) 권장을 합니다.

---

### 10-2) (추천) Vercel 배포 흐름 요약
1) GitHub에 코드 업로드  
2) Vercel에서 GitHub Repo Import  
3) 환경변수 설정  
4) Deploy → `vercel.app` 주소 생성  
5) `NEXT_PUBLIC_SITE_URL`을 배포된 URL로 변경  
6) 구글 검색 노출: sitemap/robots + Search Console 제출

---

### 10-3) GitHub에 업로드(처음 1회)
1) Git 설치
2) 프로젝트 폴더에서:

```powershell
git init
git add .
git commit -m "init"
```

3) GitHub에서 새 Repo 생성 후, 안내되는 remote 추가/푸시 명령을 실행합니다.

---

### 10-4) Vercel에서 배포
1) Vercel 로그인 → New Project  
2) GitHub Repo 선택 → Import  
3) Environment Variables 설정
   - 데모용(SQLite): `DATABASE_URL=file:./dev.db` (단, 데이터 리셋 가능)
   - 운영용(Postgres): `DATABASE_URL=postgresql://...` (권장)
4) Deploy

---

### 10-5) Google에 검색되게 하기(사이트맵/robots)
이 프로젝트는 이미 다음을 제공합니다:
- `https://도메인/robots.txt`
- `https://도메인/sitemap.xml`

Google Search Console에서:
- 사이트 등록
- **Sitemaps** 메뉴에서 `sitemap.xml` 제출

> 참고: 제출은 “힌트”이며, 색인까지 시간이 걸릴 수 있습니다.

---

## 11) 추가 확장 아이디어(선택)
- 로그인/회원별 관심분야 저장(쿠키 → DB)
- “채널(언론사)별” 랭킹 페이지
- 환율 위젯에서 더 많은 통화 추가
- 날씨 위젯에서 즐겨찾기 도시 저장
