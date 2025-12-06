import { Request, Response } from "express";
import { HabitRepository } from "../repositories/habit.repository";
import { Period } from "../../generated/prisma-client";
import { createHabitPayload, updateHabitPayload } from "../types/habits/habit";
import { ValidationError, InvalidError } from "../types/errors";
import AppLogger from "../utils/logger";

const habitRepo = new HabitRepository();
const logger = AppLogger.getInstance();

export class HabitController {
  static async createHabit(req: Request, res: Response) {
    const route = "POST /habits";
    const userId = req.userId ?? "unknown";
    logger.info(`[controller] ${route} called with userId: ${userId}`);

    try {
      const userId = req.userId;
      if (!userId) {
        throw new InvalidError("userId cannot be null.");
      }

      const { name, description, start, frequency, period } = req.body;
      const newHabitData: createHabitPayload = {
        userId,
        name,
        description,
        start,
        frequency,
        period,
      };

      const newHabit = await habitRepo.createHabit(newHabitData, userId);
      logger.success(
        `[controller] Habit created successfully with id: ${newHabit.id}`
      );
      res.status(201).json({ id: newHabit.id, name: newHabit.name });
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

  static async getHabit(req: Request, res: Response) {
    const route = "GET /habits/:id";
    const habitId = req.params.id;
    logger.info(`[controller] ${route} called with habitId: ${habitId}`);

    try {
      const userId = req.userId;
      if (!userId) {
        throw new InvalidError("userId cannot be null.");
      }

      const habit = await habitRepo.getHabit(habitId, userId);
      if (!habit) {
        logger.warn(`[controller] ${route} habit not found: ${habitId}`);
        return res.status(404).json({ error: "Habit not found" });
      }
      logger.success(
        `[controller] ${route} habit retrieved successfully: ${habitId}`
      );
      res.status(200).json(habit);
    } catch (err: any) {
      logger.error(`[controller] ${route} error: ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  }

  static async getAllHabits(req: Request, res: Response) {
    const route = "GET /habits";
    const { page = 1, limit = 10 } = req.query;
    logger.info(
      `[controller] ${route} called with page: ${page}, limit: ${limit}`
    );

    try {
      const userId = req.userId;
      if (!userId) {
        throw new InvalidError("userId cannot be null.");
      }

      const habits = await habitRepo.getAllHabits(
        Number(page),
        Number(limit),
        userId
      );
      logger.success(
        `[controller] ${route} all habits retrieved successfully.`
      );
      res.status(200).json(habits);
    } catch (err: any) {
      logger.error(`[controller] ${route} error: ${err.message}`);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async updateHabit(req: Request, res: Response) {
    const route = "PUT /habits/:id";
    const habitId = req.params.id;
    logger.info(`[controller] ${route} called with habitId: ${habitId}`);

    try {
      const userId = req.userId;
      if (!userId) {
        throw new InvalidError("userId cannot be null.");
      }

      const updateData: updateHabitPayload = req.body;
      const updatedHabit = await habitRepo.updateHabit(
        habitId,
        updateData,
        userId
      );
      logger.success(
        `[controller] ${route} habit updated successfully with id: ${updatedHabit.id}`
      );
      res.status(200).json(updatedHabit);
    } catch (err: any) {
      if (err instanceof InvalidError) {
        logger.warn(
          `[controller] ${route} habit not found for update: ${err.message}`
        );
        res.status(404).json({ error: "Habit not found" });
      } else {
        logger.error(`[controller] ${route} error: ${err.message}`);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  static async deleteHabit(req: Request, res: Response) {
    const route = "DELETE /habits/:id";
    const habitId = req.params.id;
    logger.info(`[controller] ${route} called with habitId: ${habitId}`);

    try {
      const userId = req.userId;
      if (!userId) {
        throw new InvalidError("userId cannot be null.");
      }

      const deletedHabit = await habitRepo.deleteHabit(habitId, userId);
      logger.success(
        `[controller] ${route} habit deleted successfully with id: ${deletedHabit.id}`
      );
      res.status(200).json(deletedHabit);
    } catch (err: any) {
      if (err instanceof InvalidError) {
        logger.warn(
          `[controller] ${route} habit not found for deletion: ${err.message}`
        );
        res.status(404).json({ error: "Habit not found" });
      } else {
        logger.error(`[controller] ${route} error: ${err.message}`);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  static async getHabitsByPeriod(req: Request, res: Response) {
    const route = "GET /habits/period/:period";
    const { page = 1, limit = 10 } = req.query;
    const period = req.params.period;
    logger.info(
      `[controller] ${route} called with period: ${period}, page: ${page}, limit: ${limit}`
    );
    const allowedPeriods = Object.values(Period);

    try {
      const userId = req.userId;
      if (!userId) {
        throw new InvalidError("userId cannot be null.");
      }

      if (!allowedPeriods.includes(period as Period)) {
        logger.warn(`[controller] ${period} is not a valid period.`);
        throw new InvalidError("Habit period does not exist.");
      }

      const habits = await habitRepo.getHabitsByPeriod(
        Number(page),
        Number(limit),
        period as Period,
        userId
      );
      logger.success(
        `[controller] ${route} habits retrieved successfully for period: ${period}`
      );
      res.status(200).json(habits);
    } catch (err: any) {
      logger.error(`[controller] ${route} error: ${err.message}`);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async getHabitsByFrequency(req: Request, res: Response) {
    const route = "GET /habits/frequency/:frequency";
    const { page = 1, limit = 10 } = req.query;
    const frequency = parseInt(req.params.frequency, 10);
    logger.info(
      `[controller] ${route} called with frequency: ${frequency}, page: ${page}, limit: ${limit}`
    );

    try {
      const userId = req.userId;
      if (!userId) {
        throw new InvalidError("userId cannot be null.");
      }

      const habits = await habitRepo.getHabitsByFrequency(
        Number(page),
        Number(limit),
        frequency,
        userId
      );
      logger.success(
        `[controller] ${route} habits retrieved successfully for frequency: ${frequency}`
      );
      res.status(200).json(habits);
    } catch (err: any) {
      logger.error(`[controller] ${route} error: ${err.message}`);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
