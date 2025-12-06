/*
  Warnings:

  - Changed the type of `period` on the `Habit` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Period" AS ENUM ('day', 'week', 'fortnight', 'month', 'year');

-- AlterTable
ALTER TABLE "Habit" DROP COLUMN "period",
ADD COLUMN     "period" "Period" NOT NULL;
