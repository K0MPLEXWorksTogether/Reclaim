import { HabitEntry } from "../../../generated/prisma-client";

export type createHabitEntryPayload = Omit<
  HabitEntry,
  "id",
  "createdAt",
  "updatedAt"
>;
export type updateHabitEntryPayload = createHabitEntryPayload;
