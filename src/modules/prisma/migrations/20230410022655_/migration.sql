/*
  Warnings:

  - You are about to drop the column `isAnswered` on the `QuizDetail` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "QuizDetail" DROP COLUMN "isAnswered",
ALTER COLUMN "type" DROP NOT NULL,
ALTER COLUMN "type" SET DEFAULT 'SINGLE_CHOICE';

-- CreateTable
CREATE TABLE "Answer" (
    "id" SERIAL NOT NULL,
    "quizDetailId" INTEGER,
    "answer" TEXT NOT NULL,
    "isCorrect" BOOLEAN DEFAULT false,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_quizDetailId_fkey" FOREIGN KEY ("quizDetailId") REFERENCES "QuizDetail"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
