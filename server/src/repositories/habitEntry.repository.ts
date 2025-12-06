import { HabitEntry, PrismaClient, Habit } from "../../generated/prisma-client";
import { HabitEntryInterface } from "../interfaces/habitEntry.interface";
import { ValidationError, InvalidError } from "../types/errors";
import {
  createHabitEntryPayload,
  updateHabitEntryPayload,
} from "../types/habit-entry/habitEntry";
import AppLogger from "../utils/logger";

const prisma = new PrismaClient();

export class HabitEntryRepository implements HabitEntryInterface {
  private logger = AppLogger.getInstance();

  private getPeriodRange(period: string, referenceDate: Date) {
    const start = new Date(referenceDate);
    const end = new Date(referenceDate);

    switch (period.toLowerCase()) {
      case "day":
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;

      case "week": {
        const day = referenceDate.getDay(); // 0 Sun → 6 Sat
        const diffToMonday = (day + 6) % 7;

        start.setDate(referenceDate.getDate() - diffToMonday);
        start.setHours(0, 0, 0, 0);

        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);
        break;
      }

      case "fortnight": {
        const day = referenceDate.getDay();
        const diffToMonday = (day + 6) % 7;

        // Week of the month (0 or 1 → 1st or 2nd half)
        const weekIndex = Math.floor(
          (referenceDate.getDate() - diffToMonday - 1) / 7
        );
        const fortnightStartWeek = weekIndex < 2 ? 0 : 2;

        start.setDate(
          referenceDate.getDate() -
            diffToMonday -
            (weekIndex - fortnightStartWeek) * 7
        );
        start.setHours(0, 0, 0, 0);

        end.setDate(start.getDate() + 13);
        end.setHours(23, 59, 59, 999);
        break;
      }

      case "month":
        start.setDate(1);
        start.setHours(0, 0, 0, 0);

        end.setMonth(referenceDate.getMonth() + 1, 0); // last day
        end.setHours(23, 59, 59, 999);
        break;

      case "year":
        start.setMonth(0, 1);
        start.setHours(0, 0, 0, 0);

        end.setMonth(11, 31);
        end.setHours(23, 59, 59, 999);
        break;

      default:
        throw new ValidationError(`Invalid period: ${period}`);
    }

    return { start, end };
  }

  private async validateHabitEntryLimit(
    habit: Habit,
    userId: string,
    entryTime: Date
  ) {
    const { start, end } = this.getPeriodRange(habit.period, entryTime);

    const count = await prisma.habitEntry.count({
      where: {
        habitId: habit.id,
        userId,
        entryTime: { gte: start, lte: end },
      },
    });

    if (count >= habit.frequency) {
      throw new InvalidError(
        `You have already logged ${habit.frequency} entries for this ${habit.period}.`
      );
    }
  }

  async createHabitEntry(data: createHabitEntryPayload): Promise<HabitEntry> {
    this.logger.info(`[repo] createHabitEntry called.`);

    try {
      if (!data.habitId || !data.userId || !data.entryTime) {
        this.logger.warn("[repo] Missing habitId, userId or entryTime.");
        throw new ValidationError("Missing habitId, userId or entryTime.");
      }

      const habit = await prisma.habit.findUnique({
        where: { id: data.habitId, userId: data.userId },
      });

      if (!habit) {
        throw new InvalidError("Habit not found for this user.");
      }
      await this.validateHabitEntryLimit(habit, data.userId, data.entryTime);

      this.logger.info(`[repo] Creating habit entry for habit ${habit.id}`);
      const newEntry = await prisma.habitEntry.create({ data });

      this.logger.success(`[repo] Habit entry created with id: ${newEntry.id}`);
      return newEntry;
    } catch (error: any) {
      this.logger.error(`[repo] createHabitEntry error: ${error.message}`);
      throw error instanceof ValidationError || error instanceof InvalidError
        ? error
        : new Error(`Error creating habit entry: ${error.message}`);
    }
  }

  async updateHabitEntry(
    habitEntryId: string,
    data: updateHabitEntryPayload
  ): Promise<HabitEntry> {
    this.logger.info(`[repo] updateHabitEntry called with id: ${habitEntryId}`);

    try {
      const existing = await prisma.habitEntry.findUnique({
        where: { id: habitEntryId },
      });

      if (!existing) {
        throw new InvalidError("HabitEntry not found.");
      }

      const newEntryTime = data.entryTime ?? existing.entryTime;
      const newHabitId = data.habitId ?? existing.habitId;

      const habit = await prisma.habit.findUnique({
        where: { id: newHabitId, userId: existing.userId },
      });

      if (!habit) {
        throw new InvalidError("Habit not found for this user.");
      }

      await this.validateHabitEntryLimit(habit, existing.userId, newEntryTime);

      const updated = await prisma.habitEntry.update({
        where: { id: habitEntryId },
        data,
      });

      this.logger.success(
        `[repo] Habit entry updated successfully: ${habitEntryId}`
      );

      return updated;
    } catch (error: any) {
      this.logger.error(`[repo] updateHabitEntry error: ${error.message}`);
      throw error instanceof InvalidError || error instanceof ValidationError
        ? error
        : new Error(`Error during updateHabitEntry: ${error.message}`);
    }
  }

  async getHabitEntry(habitEntryId: string): Promise<HabitEntry | null> {
    this.logger.info(`[repo] getHabitEntry() called with ${habitEntryId}`);

    try {
      if (!habitEntryId) throw new InvalidError("habitEntryId is required.");

      const entry = await prisma.habitEntry.findUnique({
        where: { id: habitEntryId },
      });

      return entry;
    } catch (error: any) {
      this.logger.error(`[repo] getHabitEntry error: ${error.message}`);
      throw error instanceof InvalidError
        ? error
        : new Error(`Error during getHabitEntry: ${error.message}`);
    }
  }

  async getHabitEntries(
    page: number,
    limit: number,
    userId: string
  ): Promise<HabitEntry[]> {
    this.logger.info(`[repo] getHabitEntries() called.`);

    try {
      if (!page || !limit) {
        throw new InvalidError("Page or limit is missing.");
      }

      const skip = (page - 1) * limit;

      return await prisma.habitEntry.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (error: any) {
      this.logger.error(`[repo] getHabitEntries error: ${error.message}`);
      throw error instanceof InvalidError
        ? error
        : new Error(`Error during getHabitEntries: ${error.message}`);
    }
  }

  async deleteHabitEntry(habitEntryId: string): Promise<HabitEntry> {
    this.logger.info(`[repo] deleteHabitEntry() called.`);

    try {
      const existing = await prisma.habitEntry.findUnique({
        where: { id: habitEntryId },
      });

      if (!existing) {
        throw new InvalidError("HabitEntry not found.");
      }

      const deleted = await prisma.habitEntry.delete({
        where: { id: habitEntryId },
      });

      this.logger.success(
        `[repo] Habit entry deleted successfully: ${habitEntryId}`
      );
      return deleted;
    } catch (error: any) {
      this.logger.error(`[repo] deleteHabitEntry error: ${error.message}`);
      throw error instanceof InvalidError
        ? error
        : new Error(`Error during deleteHabitEntry: ${error.message}`);
    }
  }
}
