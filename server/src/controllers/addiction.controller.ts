import { Request, Response } from "express";
import { AddictionRepository } from "../repositories/addiction.repository";
import {
  createAddictionPayload,
  updateAddictionPayload,
} from "../types/addictions/addictions";
import { ValidationError, InvalidError } from "../types/errors";
import AppLogger from "../utils/logger";

const addictionRepo = new AddictionRepository();
const logger = AppLogger.getInstance();

export class AddictionController {
  static async createAddiction(req: Request, res: Response) {
    const route = "POST /addictions";
    const userId = req.userId ?? "unknown";
    logger.info(`[controller] ${route} called with userId: ${userId}`);

    try {
      const userId = req.userId;
      if (!userId) {
        throw new InvalidError("userId cannot be null.");
      }

      const { name, description, startTime } = req.body;
      const newAddictionData: createAddictionPayload = {
        userId,
        name,
        description,
        startTime,
      };

      const newAddiction = await addictionRepo.createAddiction(
        newAddictionData,
        userId
      );
      logger.success(
        `[controller] Addiction created successfully with id: ${newAddiction.id}`
      );
      res.status(201).json({ id: newAddiction.id, name: newAddiction.name });
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

  static async getAddiction(req: Request, res: Response) {
    const route = "GET /addictions/:id";
    const addictionId = req.params.id;
    logger.info(
      `[controller] ${route} called with addictionId: ${addictionId}`
    );

    try {
      const userId = req.userId;
      if (!userId) throw new InvalidError("userId cannot be null.");

      const addiction = await addictionRepo.getAddiction(addictionId, userId);
      if (!addiction) {
        logger.warn(
          `[controller] ${route} addiction not found: ${addictionId}`
        );
        return res.status(404).json({ error: "Addiction not found" });
      }

      logger.success(
        `[controller] ${route} addiction retrieved successfully: ${addictionId}`
      );
      res.status(200).json(addiction);
    } catch (err: any) {
      logger.error(`[controller] ${route} error: ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  }

  static async getAllAddictions(req: Request, res: Response) {
    const route = "GET /addictions";
    const { page = 1, limit = 10 } = req.query;
    logger.info(
      `[controller] ${route} called with page: ${page}, limit: ${limit}`
    );

    try {
      const userId = req.userId;
      if (!userId) throw new InvalidError("userId cannot be null.");

      const addictions = await addictionRepo.getAddictions(
        Number(page),
        Number(limit),
        userId
      );

      logger.success(
        `[controller] ${route} addictions retrieved successfully.`
      );
      res.status(200).json(addictions);
    } catch (err: any) {
      logger.error(`[controller] ${route} error: ${err.message}`);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async updateAddiction(req: Request, res: Response) {
    const route = "PUT /addictions/:id";
    const addictionId = req.params.id;
    logger.info(
      `[controller] ${route} called with addictionId: ${addictionId}`
    );

    try {
      const userId = req.userId;
      if (!userId) throw new InvalidError("userId cannot be null.");

      const updateData: updateAddictionPayload = req.body;
      const updatedAddiction = await addictionRepo.updateAddiction(
        addictionId,
        userId,
        updateData
      );

      logger.success(
        `[controller] ${route} addiction updated successfully with id: ${updatedAddiction.id}`
      );
      res.status(200).json(updatedAddiction);
    } catch (err: any) {
      if (err instanceof InvalidError) {
        logger.warn(
          `[controller] ${route} addiction not found for update: ${err.message}`
        );
        res.status(404).json({ error: "Addiction not found" });
      } else {
        logger.error(`[controller] ${route} error: ${err.message}`);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  static async deleteAddiction(req: Request, res: Response) {
    const route = "DELETE /addictions/:id";
    const addictionId = req.params.id;
    logger.info(
      `[controller] ${route} called with addictionId: ${addictionId}`
    );

    try {
      const userId = req.userId;
      if (!userId) throw new InvalidError("userId cannot be null.");

      const deletedAddiction = await addictionRepo.deleteAddiction(
        addictionId,
        userId
      );
      logger.success(
        `[controller] ${route} addiction deleted successfully with id: ${deletedAddiction.id}`
      );
      res.status(200).json(deletedAddiction);
    } catch (err: any) {
      if (err instanceof InvalidError) {
        logger.warn(
          `[controller] ${route} addiction not found for deletion: ${err.message}`
        );
        res.status(404).json({ error: "Addiction not found" });
      } else {
        logger.error(`[controller] ${route} error: ${err.message}`);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  static async relapse(req: Request, res: Response) {
    const route = "POST /addictions/:id/relapse";
    const addictionId = req.params.id;
    logger.info(
      `[controller] ${route} called with addictionId: ${addictionId}`
    );

    try {
      const userId = req.userId;
      if (!userId) throw new InvalidError("userId cannot be null.");

      const { relapseDateTime } = req.body;
      if (!relapseDateTime) {
        throw new ValidationError("relapseDateTime is required.");
      }

      const updatedAddiction = await addictionRepo.relapse(
        addictionId,
        new Date(relapseDateTime),
        userId
      );

      logger.success(
        `[controller] ${route} relapse recorded successfully for addiction: ${updatedAddiction.id}`
      );
      res.status(200).json(updatedAddiction);
    } catch (err: any) {
      if (err instanceof InvalidError || err instanceof ValidationError) {
        logger.warn(`[controller] ${route} validation error: ${err.message}`);
        res.status(400).json({ error: err.message });
      } else {
        logger.error(`[controller] ${route} error: ${err.message}`);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }
}
