import { Habit } from "../../../generated/prisma-client";

export type createHabitPayload = Omit<Habit, "id", "createdAt", "updatedAt">;
export type updateHabitPayload = createHabitPayload;
