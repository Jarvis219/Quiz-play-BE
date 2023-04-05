/*
  Warnings:

  - You are about to drop the column `locked` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `verify` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "locked",
DROP COLUMN "verify",
ADD COLUMN     "is_active" BOOLEAN DEFAULT false,
ADD COLUMN     "is_verified" BOOLEAN DEFAULT false;
