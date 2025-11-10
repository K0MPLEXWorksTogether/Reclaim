import { Request, Response } from "express";
import { UserRepository } from "../repositories/user.repository";
import {
  signupValidator,
  loginValidator,
  changeUsernameValidator,
  resetPasswordValidator,
} from "../validators/user.validator";
import { ValidationError, InvalidError, CompareError } from "../types/errors"; // Import the custom errors

const userRepo = new UserRepository();

export class UserController {
  static async signup(req: Request, res: Response) {
    try {
      const { username, password } = signupValidator.parse(req.body);
      const user = await userRepo.signup(username, password);
      res.status(201).json({ id: user.id, username: user.username });
    } catch (err: any) {
      if (err instanceof ValidationError) {
        console.error(`Validation error: ${err.message}`);
        res.status(400).json({ error: err.message });
      } else if (err instanceof InvalidError) {
        console.error(`Invalid error: ${err.message}`);
        res.status(400).json({ error: err.message });
      } else {
        console.error(`Internal error: ${err.message}`);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { username, password } = loginValidator.parse(req.body);
      const token = await userRepo.login(username, password);
      res.status(200).json({ token });
    } catch (err: any) {
      if (err instanceof ValidationError) {
        console.error(`Validation error: ${err.message}`);
        res.status(400).json({ error: err.message });
      } else if (err instanceof InvalidError || err instanceof CompareError) {
        console.error(`Authentication error: ${err.message}`);
        res.status(401).json({ error: err.message });
      } else {
        console.error(`Internal error: ${err.message}`);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  static async getProfile(req: Request, res: Response) {
    try {
      const userId = req.userId ?? "";
      const user = await userRepo.getProfile(userId);
      if (!user) return res.status(404).json({ error: "User not found" });
      res.status(200).json({
        id: user.id,
        username: user.username,
        createdAt: user.createdAt,
      });
    } catch (err: any) {
      console.error(`Error: ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  }

  static async resetPassword(req: Request, res: Response) {
    try {
      const userId = req.userId ?? "";
      const { newPassword } = resetPasswordValidator.parse(req.body);
      const user = await userRepo.resetPassword(userId, newPassword);
      res.status(200).json({ id: user.id, username: user.username });
    } catch (err: any) {
      if (err instanceof ValidationError) {
        console.error(`Validation error: ${err.message}`);
        res.status(400).json({ error: err.message });
      } else {
        console.error(`Internal error: ${err.message}`);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  static async changeUsername(req: Request, res: Response) {
    try {
      const userId = req.userId ?? "";
      const { newUsername } = changeUsernameValidator.parse(req.body);
      const user = await userRepo.changeUsername(userId, newUsername);
      res.status(200).json({ id: user.id, username: user.username });
    } catch (err: any) {
      if (err instanceof ValidationError) {
        console.error(`Validation error: ${err.message}`);
        res.status(400).json({ error: err.message });
      } else {
        console.error(`Internal error: ${err.message}`);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }
}
