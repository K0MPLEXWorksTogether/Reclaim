import { Habit } from "../../../generated/prisma-client";

export type createHabitPayload = Omit<
  Habit,
  "id",
  "createdAt",
  "updatedAt",
  "userId"
>;
export type updateHabitPayload = createHabitPayload;
