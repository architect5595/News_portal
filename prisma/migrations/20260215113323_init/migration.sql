-- CreateTable
CREATE TABLE "NewsItem" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "sourceId" TEXT,
    "category" TEXT NOT NULL DEFAULT 'ETC',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "imageUrl" TEXT,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NewsItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsViewEvent" (
    "id" TEXT NOT NULL,
    "newsItemId" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NewsViewEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsSource" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'ETC',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NewsSource_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NewsItem_url_key" ON "NewsItem"("url");

-- CreateIndex
CREATE INDEX "NewsItem_viewCount_idx" ON "NewsItem"("viewCount");

-- CreateIndex
CREATE INDEX "NewsItem_publishedAt_idx" ON "NewsItem"("publishedAt");

-- CreateIndex
CREATE INDEX "NewsItem_category_idx" ON "NewsItem"("category");

-- CreateIndex
CREATE INDEX "NewsItem_sourceId_idx" ON "NewsItem"("sourceId");

-- CreateIndex
CREATE INDEX "NewsViewEvent_viewedAt_idx" ON "NewsViewEvent"("viewedAt");

-- CreateIndex
CREATE INDEX "NewsViewEvent_newsItemId_idx" ON "NewsViewEvent"("newsItemId");

-- CreateIndex
CREATE INDEX "NewsViewEvent_newsItemId_viewedAt_idx" ON "NewsViewEvent"("newsItemId", "viewedAt");

-- CreateIndex
CREATE UNIQUE INDEX "NewsSource_url_key" ON "NewsSource"("url");

-- CreateIndex
CREATE INDEX "NewsSource_enabled_idx" ON "NewsSource"("enabled");

-- CreateIndex
CREATE INDEX "NewsSource_category_idx" ON "NewsSource"("category");

-- AddForeignKey
ALTER TABLE "NewsItem" ADD CONSTRAINT "NewsItem_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "NewsSource"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsViewEvent" ADD CONSTRAINT "NewsViewEvent_newsItemId_fkey" FOREIGN KEY ("newsItemId") REFERENCES "NewsItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
