-- CreateEnum
CREATE TYPE "ERole" AS ENUM ('ADMIN', 'USER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "locked" BOOLEAN DEFAULT false,
ADD COLUMN     "role" "ERole" DEFAULT 'USER',
ADD COLUMN     "verify" BOOLEAN DEFAULT false;
