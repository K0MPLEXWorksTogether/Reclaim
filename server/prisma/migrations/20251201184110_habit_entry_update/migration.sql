/*
  Warnings:

  - You are about to drop the column `entryDate` on the `HabitEntry` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[habitId,userId,entryTime,createdAt]` on the table `HabitEntry` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "HabitEntry_habitId_userId_entryDate_entryTime_key";

-- AlterTable
ALTER TABLE "HabitEntry" DROP COLUMN "entryDate";

-- CreateIndex
CREATE UNIQUE INDEX "HabitEntry_habitId_userId_entryTime_createdAt_key" ON "HabitEntry"("habitId", "userId", "entryTime", "createdAt");
