import { Habit } from "../../generated/prisma-client";
import { createHabitPayload, updateHabitPayload } from "../types/habits/habit";

export interface HabitInterface {
  createHabit(data: createHabitPayload): Promise<Habit>;
  getHabit(habitId: string): Promise<Habit | null>;
  getAllHabits(page: number, limit: number): Promise<Habit[]>;
  updateHabit(habitId: string, data: updateHabitPayload): Promise<Habit>;
  deleteHabit(habitId: string): Promise<Habit>;
  getHabitsByPeriod(page: number, limit: number, period: string): Promise<Habit[]>;
  getHabitsByFrequency(page: number, limit: number, frequency: number): Promise<Habit[]>;
}
