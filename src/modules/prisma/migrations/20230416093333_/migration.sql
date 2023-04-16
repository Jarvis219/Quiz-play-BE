/*
  Warnings:

  - You are about to drop the column `full_name` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "full_name",
ADD COLUMN     "first_name" VARCHAR,
ADD COLUMN     "last_name" VARCHAR;
