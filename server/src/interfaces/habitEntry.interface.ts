import { HabitEntry } from "../../generated/prisma-client";
import {
  createHabitEntryPayload,
  updateHabitEntryPayload,
} from "../types/habit-entry/habitEntry";

export interface HabitEntryInterface {
  createHabitEntry(data: createHabitEntryPayload): Promise<HabitEntry>;
  updateHabitEntry(
    habitEntryId: string,
    data: updateHabitEntryPayload
  ): Promise<HabitEntry>;
  getHabitEntry(habitEntryId: string): Promise<HabitEntry | null>;
  getHabitEntries(
    page: number,
    limit: number,
    userId: string
  ): Promise<HabitEntry[]>;
  deleteHabitEntry(habitEntryId: string): Promise<HabitEntry>;
}
