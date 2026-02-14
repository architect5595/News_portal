import { PrismaClient } from "@prisma/client";

/**
 * ✅ PrismaClient 싱글톤 캐싱 (Next.js dev HMR 대응)
 * - 개발 모드에서 모듈이 여러 번 로드되면 DB 연결이 과도하게 생성될 수 있습니다.
 * - globalThis에 prisma를 저장해 재사용합니다.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
