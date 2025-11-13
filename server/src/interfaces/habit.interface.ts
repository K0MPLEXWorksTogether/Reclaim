import { Habit } from "../../generated/prisma-client";
import { createHabitPayload, updateHabitPayload } from "../types/habits/habit";

export interface HabitInterface {
  createHabit(data: createHabitPayload, userId: string): Promise<Habit>;
  getHabit(habitId: string, userId: string): Promise<Habit | null>;
  getAllHabits(page: number, limit: number, userId: string): Promise<Habit[]>;
  updateHabit(
    habitId: string,
    data: updateHabitPayload,
    userId: string
  ): Promise<Habit>;
  deleteHabit(habitId: string, userId: string): Promise<Habit>;
  getHabitsByPeriod(
    page: number,
    limit: number,
    period: string,
    userId: string
  ): Promise<Habit[]>;
  getHabitsByFrequency(
    page: number,
    limit: number,
    frequency: number,
    userId: string
  ): Promise<Habit[]>;
}
