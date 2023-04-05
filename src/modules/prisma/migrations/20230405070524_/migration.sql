/*
  Warnings:

  - You are about to drop the column `image` on the `QuizDetail` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "photo" VARCHAR;

-- AlterTable
ALTER TABLE "QuizDetail" DROP COLUMN "image",
ADD COLUMN     "photo" TEXT DEFAULT '';
