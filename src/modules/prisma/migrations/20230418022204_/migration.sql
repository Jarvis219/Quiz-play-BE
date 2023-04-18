/*
  Warnings:

  - The values [USER] on the enum `ERole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ERole_new" AS ENUM ('ADMIN', 'PLAYER');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "ERole_new" USING ("role"::text::"ERole_new");
ALTER TYPE "ERole" RENAME TO "ERole_old";
ALTER TYPE "ERole_new" RENAME TO "ERole";
DROP TYPE "ERole_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'PLAYER';
COMMIT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'PLAYER';

-- CreateTable
CREATE TABLE "Avatar" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "Avatar_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Avatar_name_key" ON "Avatar"("name");
