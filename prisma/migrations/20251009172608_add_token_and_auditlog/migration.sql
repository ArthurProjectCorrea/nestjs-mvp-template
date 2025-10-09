/*
  Warnings:

  - You are about to drop the column `refreshToken` on the `Token` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[refreshTokenHash]` on the table `Token` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[jti]` on the table `Token` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `jti` to the `Token` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refreshTokenHash` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Token_refreshToken_key";

-- AlterTable
ALTER TABLE "Token" DROP COLUMN "refreshToken",
ADD COLUMN     "deviceName" TEXT,
ADD COLUMN     "ip" TEXT,
ADD COLUMN     "jti" TEXT NOT NULL,
ADD COLUMN     "lastUsedAt" TIMESTAMP(3),
ADD COLUMN     "location" TEXT,
ADD COLUMN     "refreshTokenHash" TEXT NOT NULL,
ADD COLUMN     "userAgent" TEXT;

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "event" TEXT NOT NULL,
    "ip" TEXT,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Token_refreshTokenHash_key" ON "Token"("refreshTokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "Token_jti_key" ON "Token"("jti");

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
