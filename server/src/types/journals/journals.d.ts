import { Journal } from "../../../generated/prisma-client";

export type createJournalPayload = Pick<Journal, "content", "userId", "title">;
export type updateJournalPayload = Pick<Journal, "content", "title">;
