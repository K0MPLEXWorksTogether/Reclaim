import { Request, Response } from "express";
import { JournalRepository } from "../repositories/journal.repository";
import {
  createJournalPayload,
  updateJournalPayload,
} from "../types/journals/journals";
import { ValidationError, InvalidError } from "../types/errors";
import AppLogger from "../utils/logger";

const journalRepo = new JournalRepository();
const logger = AppLogger.getInstance();

export class JournalController {
  static async createJournal(req: Request, res: Response) {
    const route = "POST /journals";
    const userId = req.userId ?? "unknown";
    logger.info(`[controller] ${route} called with userId: ${userId}`);

    try {
      if (!userId) {
        throw new InvalidError("userId cannot be null.");
      }

      const { content, title } = req.body;
      const newJournalData: createJournalPayload = { content, title };

      const newJournal = await journalRepo.createJournal(
        newJournalData,
        userId
      );
      logger.success(
        `[controller] Journal created successfully with id: ${newJournal.id}`
      );
      res.status(201).json({ id: newJournal.id, content: newJournal.content });
    } catch (err: any) {
      if (err instanceof ValidationError || err instanceof InvalidError) {
        logger.warn(`[controller] ${route} validation error: ${err.message}`);
        res.status(400).json({ error: err.message });
      } else {
        logger.error(`[controller] ${route} internal error: ${err.message}`);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  static async getJournal(req: Request, res: Response) {
    const route = "GET /journals/:id";
    const journalId = req.params.id;
    logger.info(`[controller] ${route} called with journalId: ${journalId}`);

    try {
      const userId = req.userId;
      if (!userId) {
        throw new InvalidError("userId cannot be null.");
      }

      const journal = await journalRepo.getJournal(journalId, userId);
      if (!journal) {
        logger.warn(`[controller] ${route} journal not found: ${journalId}`);
        return res.status(404).json({ error: "Journal not found" });
      }
      logger.success(
        `[controller] ${route} journal retrieved successfully: ${journalId}`
      );
      res.status(200).json(journal);
    } catch (err: any) {
      logger.error(`[controller] ${route} error: ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  }

  static async getJournals(req: Request, res: Response) {
    const route = "GET /journals";
    const { page = 1, limit = 10 } = req.query;
    logger.info(
      `[controller] ${route} called with page: ${page}, limit: ${limit}`
    );

    try {
      const userId = req.userId;
      if (!userId) {
        throw new InvalidError("userId cannot be null.");
      }

      const journals = await journalRepo.getJournals(
        Number(page),
        Number(limit),
        userId
      );
      logger.success(
        `[controller] ${route} all journals retrieved successfully.`
      );
      res.status(200).json(journals);
    } catch (err: any) {
      logger.error(`[controller] ${route} error: ${err.message}`);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async updateJournal(req: Request, res: Response) {
    const route = "PUT /journals/:id";
    const journalId = req.params.id;
    logger.info(`[controller] ${route} called with journalId: ${journalId}`);

    try {
      const userId = req.userId;
      if (!userId) {
        throw new InvalidError("userId cannot be null.");
      }

      const updateData: updateJournalPayload = req.body;
      const updatedJournal = await journalRepo.updateJournal(
        journalId,
        updateData,
        userId
      );
      logger.success(
        `[controller] ${route} journal updated successfully with id: ${updatedJournal.id}`
      );
      res.status(200).json(updatedJournal);
    } catch (err: any) {
      if (err instanceof InvalidError) {
        logger.warn(
          `[controller] ${route} journal not found for update: ${err.message}`
        );
        res.status(404).json({ error: "Journal not found" });
      } else {
        logger.error(`[controller] ${route} error: ${err.message}`);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  static async deleteJournal(req: Request, res: Response) {
    const route = "DELETE /journals/:id";
    const journalId = req.params.id;
    logger.info(`[controller] ${route} called with journalId: ${journalId}`);

    try {
      const userId = req.userId;
      if (!userId) {
        throw new InvalidError("userId cannot be null.");
      }

      const deletedJournal = await journalRepo.deleteJournal(journalId, userId);
      logger.success(
        `[controller] ${route} journal deleted successfully with id: ${deletedJournal.id}`
      );
      res.status(200).json(deletedJournal);
    } catch (err: any) {
      if (err instanceof InvalidError) {
        logger.warn(
          `[controller] ${route} journal not found for deletion: ${err.message}`
        );
        res.status(404).json({ error: "Journal not found" });
      } else {
        logger.error(`[controller] ${route} error: ${err.message}`);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }
}
