/*
  Warnings:

  - You are about to drop the column `auth_email_google` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_auth_email_google_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "auth_email_google";
