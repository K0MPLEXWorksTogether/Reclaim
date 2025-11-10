import { Request, Response } from "express";
import { UserRepository } from "../repositories/user.repository";
import {
  signupValidator,
  loginValidator,
  changeUsernameValidator,
  resetPasswordValidator,
} from "../validators/user.validator";
import { ValidationError, InvalidError, CompareError } from "../types/errors";
import AppLogger from "../utils/logger";

const userRepo = new UserRepository();
const logger = AppLogger.getInstance();

export class UserController {
  static async signup(req: Request, res: Response) {
    const route = "POST /signup";
    const username = req.body.username ?? "unknown";
    logger.info(`[controller] ${route} called with username: ${username}`);

    try {
      const { username, password } = signupValidator.parse(req.body);
      const user = await userRepo.signup(username, password);
      logger.success(`[controller] Signup successful for userId: ${user.id}`);
      res.status(201).json({ id: user.id, username: user.username });
    } catch (err: any) {
      if (err instanceof ValidationError || err instanceof InvalidError) {
        logger.warn(
          `[controller] ${route} validation/auth error: ${err.message}`
        );
        res.status(400).json({ error: err.message });
      } else {
        logger.error(`[controller] ${route} internal error: ${err.message}`);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  static async login(req: Request, res: Response) {
    const route = "POST /login";
    const username = req.body.username ?? "unknown";
    logger.info(`[controller] ${route} called with username: ${username}`);

    try {
      const { username, password } = loginValidator.parse(req.body);
      const token = await userRepo.login(username, password);
      logger.success(`[controller] Login successful for username: ${username}`);
      res.status(200).json({ token });
    } catch (err: any) {
      if (err instanceof ValidationError) {
        logger.warn(`[controller] ${route} validation error: ${err.message}`);
        res.status(400).json({ error: err.message });
      } else if (err instanceof InvalidError || err instanceof CompareError) {
        logger.warn(
          `[controller] ${route} authentication error: ${err.message}`
        );
        res.status(401).json({ error: err.message });
      } else {
        logger.error(`[controller] ${route} internal error: ${err.message}`);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  static async getProfile(req: Request, res: Response) {
    const route = "GET /profile";
    const userId = req.userId ?? "unknown";
    logger.info(`[controller] ${route} called for userId: ${userId}`);

    try {
      const user = await userRepo.getProfile(userId);
      if (!user) {
        logger.warn(`[controller] ${route} user not found: ${userId}`);
        return res.status(404).json({ error: "User not found" });
      }
      logger.success(
        `[controller] ${route} profile retrieved for userId: ${user.id}`
      );
      res.status(200).json({
        id: user.id,
        username: user.username,
        createdAt: user.createdAt,
      });
    } catch (err: any) {
      logger.error(`[controller] ${route} error: ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  }

  static async resetPassword(req: Request, res: Response) {
    const route = "POST /reset-password";
    const userId = req.userId ?? "unknown";
    logger.info(`[controller] ${route} called for userId: ${userId}`);

    try {
      const { newPassword } = resetPasswordValidator.parse(req.body);
      const user = await userRepo.resetPassword(userId, newPassword);
      logger.success(
        `[controller] ${route} password reset successful for userId: ${user.id}`
      );
      res.status(200).json({ id: user.id, username: user.username });
    } catch (err: any) {
      if (err instanceof ValidationError) {
        logger.warn(`[controller] ${route} validation error: ${err.message}`);
        res.status(400).json({ error: err.message });
      } else {
        logger.error(`[controller] ${route} internal error: ${err.message}`);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  static async changeUsername(req: Request, res: Response) {
    const route = "POST /change-username";
    const userId = req.userId ?? "unknown";
    logger.info(`[controller] ${route} called for userId: ${userId}`);

    try {
      const { newUsername } = changeUsernameValidator.parse(req.body);
      const user = await userRepo.changeUsername(userId, newUsername);
      logger.success(
        `[controller] ${route} username changed successfully for userId: ${user.id}`
      );
      res.status(200).json({ id: user.id, username: user.username });
    } catch (err: any) {
      if (err instanceof ValidationError) {
        logger.warn(`[controller] ${route} validation error: ${err.message}`);
        res.status(400).json({ error: err.message });
      } else {
        logger.error(`[controller] ${route} internal error: ${err.message}`);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }
}
