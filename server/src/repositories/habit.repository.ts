import { Habit, PrismaClient } from "../../generated/prisma-client";
import { HabitInterface } from "../interfaces/habit.interface";
import { ValidationError, InvalidError } from "../types/errors";
import { createHabitPayload, updateHabitPayload } from "../types/habits/habit";
import AppLogger from "../utils/logger";

const prisma = new PrismaClient();

export class HabitRepository implements HabitInterface {
  private logger = AppLogger.getInstance();
  async createHabit(data: createHabitPayload, userId: string): Promise<Habit> {
    this.logger.info(`[repo] createHabit called with userId: ${data.userId}`);
    try {
      if (!data.name || !data.frequency || !data.period || !data.start) {
        this.logger.warn(
          `[repo] Validation failed: Missing required fields in habit data.`
        );
        throw new ValidationError(
          "Habit name, frequency or period are missing."
        );
      }

      const existingUser = await prisma.habit.findFirst({
        where: { name: data.name, userId: userId },
      });
      if (existingUser) {
        this.logger.warn(
          `[repo] Invalid: Habit with the same name already exists.`
        );
        throw new InvalidError("Habit with the same name already exists.");
      }

      this.logger.info(
        `[repo] Creating new habit in the database ${data.name}`
      );
      data.userId = userId;
      const newHabit = await prisma.habit.create({ data });

      this.logger.success(
        `[repo] Habit created successfully with id: ${newHabit.id}`
      );
      return newHabit;
    } catch (error: any) {
      this.logger.error(`[repo] createHabit error: ${error.message}`);
      throw error instanceof ValidationError || error instanceof InvalidError
        ? error
        : new Error(`Error during createHabit: ${error.message}`);
    }
  }

  async getHabit(habitId: string, userId: string): Promise<Habit | null> {
    this.logger.info(`[repo] getHabit() called with habitId: ${habitId}`);
    try {
      if (!habitId) {
        this.logger.warn(`[repo] habitId cannot be empty`);
        throw new InvalidError("habitId cannot be empty.");
      }

      const habit = await prisma.habit.findUnique({
        where: { id: habitId, userId: userId },
      });
      if (habit) {
        this.logger.warn(`[repo] Habit not found: ${habitId}`);
      } else {
        this.logger.success(`[repo] Habit found successfully: ${habitId}`);
      }

      return habit;
    } catch (error: any) {
      this.logger.error(`[repo] getHabit error: ${error.message}`);
      throw error instanceof InvalidError
        ? error
        : new Error(`Error during getHabit: ${error.message}`);
    }
  }

  async getAllHabits(
    page: number,
    limit: number,
    userId: string
  ): Promise<Habit[]> {
    this.logger.info(`[repo] getAllHabits() called.`);
    try {
      if (!page || !limit) {
        this.logger.warn("[repo] page or limit is empty");
        throw new InvalidError("Page or limit is empty.");
      }

      const skip: number = (page - 1) * limit;
      const habits = await prisma.habit.findMany({
        where: { userId: userId },
        skip: skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      });

      this.logger.success(`[repo] All habits retrieved successfully.`);
      return habits;
    } catch (error: any) {
      this.logger.error(`[repo] getAllHabits error: ${error.message}`);
      throw error instanceof InvalidError
        ? error
        : new Error(`Error during getAllHabits: ${error.message}`);
    }
  }

  async updateHabit(
    habitId: string,
    data: updateHabitPayload,
    userId: string
  ): Promise<Habit> {
    this.logger.info(`[repo] updateHabit called with habitId: ${habitId}`);
    try {
      const habitExists = await prisma.habit.findUnique({
        where: { id: habitId, userId: userId },
      });
      if (!habitExists) {
        this.logger.warn(`[repo] Habit not found for update: ${habitId}`);
        throw new InvalidError("Habit not found.");
      }

      this.logger.info(`[repo] Updating habit: ${habitId}`);
      const updatedHabit = await prisma.habit.update({
        where: { id: habitId, userId: userId },
        data,
      });

      this.logger.success(
        `[repo] Habit updated successfully with id: ${updatedHabit.id}`
      );
      return updatedHabit;
    } catch (error: any) {
      this.logger.error(`[repo] updateHabit error: ${error.message}`);
      throw error instanceof InvalidError
        ? error
        : new Error(`Error during updateHabit: ${error.message}`);
    }
  }

  async deleteHabit(habitId: string, userId: string): Promise<Habit> {
    this.logger.info(`[repo] deleteHabit called with habitId: ${habitId}`);
    try {
      const habitExists = await prisma.habit.findUnique({
        where: { id: habitId, userId: userId },
      });
      if (!habitExists) {
        this.logger.warn(`[repo] Habit not found for deletion: ${habitId}`);
        throw new InvalidError("Habit not found.");
      }

      this.logger.info(`[repo] Deleting habit: ${habitId}`);
      const deletedHabit = await prisma.habit.delete({
        where: { id: habitId, userId: userId },
      });

      this.logger.success(
        `[repo] Habit deleted successfully with id: ${deletedHabit.id}`
      );
      return deletedHabit;
    } catch (error: any) {
      this.logger.error(`[repo] deleteHabit error: ${error.message}`);
      throw error instanceof InvalidError
        ? error
        : new Error(`Error during deleteHabit: ${error.message}`);
    }
  }

  async getHabitsByPeriod(
    page: number,
    limit: number,
    period: string,
    userId: string
  ): Promise<Habit[]> {
    this.logger.info(
      `[repo] getHabitsByPeriod() called with period: ${period}`
    );
    try {
      if (!page || !limit) {
        this.logger.warn("[repo] page or limit is empty");
        throw new InvalidError("Page or limit is empty.");
      }

      const skip: number = (page - 1) * limit;
      const habits = await prisma.habit.findMany({
        where: {
          period: period,
          userId: userId,
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      });

      this.logger.success(
        `[repo] Habits retrieved successfully for period: ${period}`
      );
      return habits;
    } catch (error: any) {
      this.logger.error(`[repo] getHabitsByPeriod error: ${error.message}`);
      throw error instanceof InvalidError
        ? error
        : new Error(`Error during getHabitsByPeriod: ${error.message}`);
    }
  }

  async getHabitsByFrequency(
    page: number,
    limit: number,
    frequency: number,
    userId: string
  ): Promise<Habit[]> {
    this.logger.info(
      `[repo] getHabitsByFrequency() called with frequency: ${frequency}`
    );
    try {
      if (!page || !limit) {
        this.logger.warn("[repo] page or limit is empty");
        throw new InvalidError("Page or limit is empty.");
      }

      const skip: number = (page - 1) * limit;
      const habits = await prisma.habit.findMany({
        where: {
          frequency: frequency,
          userId: userId,
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      });

      this.logger.success(
        `[repo] Habits retrieved successfully for frequency: ${frequency}`
      );
      return habits;
    } catch (error: any) {
      this.logger.error(`[repo] getHabitsByFrequency error: ${error.message}`);
      throw error instanceof InvalidError
        ? error
        : new Error(`Error during getHabitsByFrequency: ${error.message}`);
    }
  }
}
