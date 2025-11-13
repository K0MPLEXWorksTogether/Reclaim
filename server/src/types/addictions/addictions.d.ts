import { Addiction } from "../../../generated/prisma-client";

export type createAddictionPayload = Pick<
  Addiction,
  "name",
  "description",
  "startTime"
>;
export type updateAddictionPayload = Omit<createAddictionPayload, "startTime">;
