import { Request, Response } from "express";
import { HabitEntryRepository } from "../repositories/habitEntry.repository";
import {
  createHabitEntryPayload,
  updateHabitEntryPayload,
} from "../types/habit-entry/habitEntry";
import { ValidationError, InvalidError } from "../types/errors";
import AppLogger from "../utils/logger";

const habitEntryRepo = new HabitEntryRepository();
const logger = AppLogger.getInstance();

export class HabitEntryController {
  static async createHabitEntry(req: Request, res: Response) {
    const route = "POST /habit-entries";
    logger.info(`[controller] ${route} called`);

    try {
      const userId = req.userId;
      if (!userId) throw new InvalidError("userId cannot be null.");

      const { habitId, entryTime } = req.body;

      const newEntryData: createHabitEntryPayload = {
        userId,
        habitId,
        entryTime: new Date(entryTime),
      };

      const newEntry = await habitEntryRepo.createHabitEntry(newEntryData);

      logger.success(
        `[controller] ${route} created successfully with id: ${newEntry.id}`
      );
      res.status(201).json(newEntry);
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

  static async getHabitEntry(req: Request, res: Response) {
    const route = "GET /habit-entries/:id";
    const entryId = req.params.id;
    logger.info(`[controller] ${route} called with id: ${entryId}`);

    try {
      const entry = await habitEntryRepo.getHabitEntry(entryId);

      if (!entry) {
        logger.warn(`[controller] ${route} entry not found: ${entryId}`);
        return res.status(404).json({ error: "Habit entry not found" });
      }

      logger.success(
        `[controller] ${route} entry retrieved successfully: ${entryId}`
      );
      res.status(200).json(entry);
    } catch (err: any) {
      logger.error(`[controller] ${route} error: ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  }

  static async getHabitEntries(req: Request, res: Response) {
    const route = "GET /habit-entries";
    const { page = 1, limit = 10 } = req.query;

    logger.info(
      `[controller] ${route} called with page: ${page}, limit: ${limit}`
    );

    try {
      const userId = req.userId;
      if (!userId) throw new InvalidError("userId cannot be null.");

      const entries = await habitEntryRepo.getHabitEntries(
        Number(page),
        Number(limit),
        userId
      );

      logger.success(`[controller] ${route} retrieved successfully.`);
      res.status(200).json(entries);
    } catch (err: any) {
      logger.error(`[controller] ${route} error: ${err.message}`);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async updateHabitEntry(req: Request, res: Response) {
    const route = "PUT /habit-entries/:id";
    const entryId = req.params.id;

    logger.info(`[controller] ${route} called with id: ${entryId}`);

    try {
      const updateData: updateHabitEntryPayload = req.body;

      const updated = await habitEntryRepo.updateHabitEntry(
        entryId,
        updateData
      );

      logger.success(
        `[controller] ${route} updated successfully with id: ${updated.id}`
      );
      res.status(200).json(updated);
    } catch (err: any) {
      if (err instanceof InvalidError || err instanceof ValidationError) {
        logger.warn(`[controller] ${route} update error: ${err.message}`);
        res.status(400).json({ error: err.message });
      } else {
        logger.error(`[controller] ${route} internal error: ${err.message}`);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  static async deleteHabitEntry(req: Request, res: Response) {
    const route = "DELETE /habit-entries/:id";
    const entryId = req.params.id;

    logger.info(`[controller] ${route} called with id: ${entryId}`);

    try {
      const deleted = await habitEntryRepo.deleteHabitEntry(entryId);

      logger.success(
        `[controller] ${route} deleted successfully with id: ${deleted.id}`
      );
      res.status(200).json(deleted);
    } catch (err: any) {
      if (err instanceof InvalidError) {
        logger.warn(
          `[controller] ${route} not found for deletion: ${err.message}`
        );
        res.status(404).json({ error: "Habit entry not found" });
      } else {
        logger.error(`[controller] ${route} error: ${err.message}`);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }
}
