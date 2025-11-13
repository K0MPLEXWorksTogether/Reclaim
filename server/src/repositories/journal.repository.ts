import { Journal, PrismaClient } from "../../generated/prisma-client";
import { JournalInterface } from "../interfaces/journal.interface";
import { ValidationError, InvalidError } from "../types/errors";
import {
  createJournalPayload,
  updateJournalPayload,
} from "../types/journals/journals";
import AppLogger from "../utils/logger";

const prisma = new PrismaClient();

export class JournalRepository implements JournalInterface {
  private logger = AppLogger.getInstance();

  async createJournal(
    data: createJournalPayload,
    userId: string
  ): Promise<Journal> {
    this.logger.info(`[repo] createJournal called with userId: ${userId}`);
    try {
      if (!data.content || !data.title) {
        this.logger.warn(`[repo] Validation failed: Missing journal content.`);
        throw new ValidationError("Content is required.");
      }

      this.logger.info(`[repo] Creating new journal entry`);
      data.userId = userId;
      const newJournal = await prisma.journal.create({ data });

      this.logger.success(
        `[repo] Journal created successfully with id: ${newJournal.id}`
      );
      return newJournal;
    } catch (error: any) {
      this.logger.error(`[repo] createJournal error: ${error.message}`);
      throw error instanceof ValidationError
        ? error
        : new Error(`Error during createJournal: ${error.message}`);
    }
  }

  async getJournal(journalId: string, userId: string): Promise<Journal | null> {
    this.logger.info(`[repo] getJournal() called with journalId: ${journalId}`);
    try {
      if (!journalId) {
        this.logger.warn(`[repo] journalId cannot be empty`);
        throw new InvalidError("journalId cannot be empty.");
      }

      const journal = await prisma.journal.findUnique({
        where: { id: journalId, userId: userId },
      });

      if (!journal) {
        this.logger.warn(`[repo] Journal not found: ${journalId}`);
      } else {
        this.logger.success(`[repo] Journal found successfully: ${journalId}`);
      }

      return journal;
    } catch (error: any) {
      this.logger.error(`[repo] getJournal error: ${error.message}`);
      throw error instanceof InvalidError
        ? error
        : new Error(`Error during getJournal: ${error.message}`);
    }
  }

  async getJournals(
    page: number,
    limit: number,
    userId: string
  ): Promise<Journal[]> {
    this.logger.info(
      `[repo] getJournals() called with page: ${page}, limit: ${limit}`
    );
    try {
      if (!page || !limit) {
        this.logger.warn("[repo] page or limit is empty");
        throw new InvalidError("Page or limit is empty.");
      }

      const skip: number = (page - 1) * limit;
      const journals = await prisma.journal.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      });

      this.logger.success(
        `[repo] Journals retrieved successfully for userId: ${userId}`
      );
      return journals;
    } catch (error: any) {
      this.logger.error(`[repo] getJournals error: ${error.message}`);
      throw error instanceof InvalidError
        ? error
        : new Error(`Error during getJournals: ${error.message}`);
    }
  }

  async updateJournal(
    journalId: string,
    data: updateJournalPayload,
    userId: string
  ): Promise<Journal> {
    this.logger.info(
      `[repo] updateJournal called with journalId: ${journalId}`
    );
    try {
      const journalExists = await prisma.journal.findUnique({
        where: { id: journalId, userId: userId },
      });
      if (!journalExists) {
        this.logger.warn(`[repo] Journal not found for update: ${journalId}`);
        throw new InvalidError("Journal not found.");
      }

      this.logger.info(`[repo] Updating journal: ${journalId}`);
      const updatedJournal = await prisma.journal.update({
        where: { id: journalId, userId: userId },
        data,
      });

      this.logger.success(
        `[repo] Journal updated successfully with id: ${updatedJournal.id}`
      );
      return updatedJournal;
    } catch (error: any) {
      this.logger.error(`[repo] updateJournal error: ${error.message}`);
      throw error instanceof InvalidError
        ? error
        : new Error(`Error during updateJournal: ${error.message}`);
    }
  }

  async deleteJournal(journalId: string, userId: string): Promise<Journal> {
    this.logger.info(
      `[repo] deleteJournal called with journalId: ${journalId}`
    );
    try {
      const journalExists = await prisma.journal.findUnique({
        where: { id: journalId, userId: userId },
      });
      if (!journalExists) {
        this.logger.warn(`[repo] Journal not found for deletion: ${journalId}`);
        throw new InvalidError("Journal not found.");
      }

      this.logger.info(`[repo] Deleting journal: ${journalId}`);
      const deletedJournal = await prisma.journal.delete({
        where: { id: journalId, userId: userId },
      });

      this.logger.success(
        `[repo] Journal deleted successfully with id: ${deletedJournal.id}`
      );
      return deletedJournal;
    } catch (error: any) {
      this.logger.error(`[repo] deleteJournal error: ${error.message}`);
      throw error instanceof InvalidError
        ? error
        : new Error(`Error during deleteJournal: ${error.message}`);
    }
  }
}
