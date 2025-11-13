import { Journal } from "../../generated/prisma-client";
import { createJournalPayload, updateJournalPayload } from "../types/journals/journals";

export interface JournalInterface {
  createJournal(data: createJournalPayload, userId: string): Promise<Journal>;
  getJournal(journalId: string, userId: string): Promise<Journal | null>;
  getJournals(page: number, limit: number, userId: string): Promise<Journal[]>;
  updateJournal(journalId: string, data: updateJournalPayload, userId: string): Promise<Journal>;
  deleteJournal(journalId: string, userId: string): Promise<Journal>;
}