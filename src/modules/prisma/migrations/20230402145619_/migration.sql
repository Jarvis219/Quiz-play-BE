/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[auth_email_google]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
ADD COLUMN     "address" VARCHAR,
ADD COLUMN     "auth_email_google" VARCHAR,
ADD COLUMN     "avatar" VARCHAR,
ADD COLUMN     "email_unverify" VARCHAR,
ADD COLUMN     "password" VARCHAR,
ADD COLUMN     "phone" VARCHAR,
ADD COLUMN     "reset_password_token" VARCHAR,
ADD COLUMN     "token_expiry_date" TIMESTAMP(6),
ADD COLUMN     "username" VARCHAR NOT NULL,
ADD COLUMN     "verify_email_token" VARCHAR,
ALTER COLUMN "email" SET DATA TYPE VARCHAR;

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_auth_email_google_key" ON "User"("auth_email_google");
