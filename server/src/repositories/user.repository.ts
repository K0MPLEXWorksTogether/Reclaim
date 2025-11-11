import { PrismaClient, User } from "../../generated/prisma-client";
import { UserInterface } from "../interfaces/user.interface";
import { hashPassword, comparePassword } from "../utils/passwordUtils";
import { generateToken } from "../utils/jwtUtils";
import { ValidationError, InvalidError, CompareError } from "../types/errors";
import AppLogger from "../utils/logger";

const prisma = new PrismaClient();

export class UserRepository implements UserInterface {
  private logger = AppLogger.getInstance();

  async signup(username: string, password: string): Promise<User> {
    this.logger.info(`[repo] signup() called with username: ${username}`);
    try {
      if (!username || !password) {
        this.logger.warn(
          `[repo] Validation failed: username or password missing.`
        );
        throw new ValidationError("Username and password are required.");
      }

      this.logger.info(`[repo] Checking if username exists: ${username}`);
      const existingUser = await prisma.user.findUnique({
        where: { username },
      });
      if (existingUser) {
        this.logger.warn(`[repo] Username already exists: ${username}`);
        throw new InvalidError("Username already exists.");
      }

      this.logger.info(`[repo] Hashing password for username: ${username}`);
      const passwordHash = await hashPassword(password);

      this.logger.info(`[repo] Creating user in database: ${username}`);
      const user = await prisma.user.create({
        data: { username, passwordHash },
      });

      this.logger.success(`[repo] Signup successful for userId: ${user.id}`);
      return user;
    } catch (error: any) {
      this.logger.error(`[repo] Signup error: ${error.message}`);
      throw error instanceof ValidationError || error instanceof InvalidError
        ? error
        : new Error(`Error during signup: ${error.message}`);
    }
  }

  async login(username: string, password: string): Promise<string> {
    this.logger.info(`[repo] login() called with username: ${username}`);
    try {
      if (!username || !password) {
        this.logger.warn(
          `[repo] Validation failed: username or password missing`
        );
        throw new ValidationError("Username and password are required.");
      }

      this.logger.info(`[repo] Retrieving user from database: ${username}`);
      const user = await prisma.user.findUnique({ where: { username } });
      if (!user) {
        this.logger.warn(`[repo] User not found: ${username}`);
        throw new InvalidError("Invalid username or password");
      }

      this.logger.info(`[repo] Comparing password for userId: ${user.id}`);
      const valid = await comparePassword(password, user.passwordHash);
      if (!valid) {
        this.logger.warn(`[repo] Password mismatch for userId: ${user.id}`);
        throw new CompareError("Invalid username or password");
      }

      const token = generateToken(user.id);
      this.logger.success(`[repo] Login successful for userId: ${user.id}`);
      return token;
    } catch (error: any) {
      this.logger.error(`[repo] Login error: ${error.message}`);
      throw error instanceof ValidationError ||
        error instanceof InvalidError ||
        error instanceof CompareError
        ? error
        : new Error(`Error during login: ${error.message}`);
    }
  }

  async getProfile(userId: string): Promise<User | null> {
    this.logger.info(`[repo] getProfile() called for userId: ${userId}`);
    try {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        this.logger.warn(`[repo] User not found: ${userId}`);
      } else {
        this.logger.success(`[repo] Profile retrieved for userId: ${user.id}`);
      }
      return user;
    } catch (error: any) {
      this.logger.error(`[repo] getProfile error: ${error.message}`);
      throw new Error(`Error fetching profile: ${error.message}`);
    }
  }

  async resetPassword(userId: string, newPassword: string): Promise<User> {
    this.logger.info(`[repo] resetPassword() called for userId: ${userId}`);
    try {
      if (!newPassword) {
        this.logger.warn(`[repo] Validation failed: new password missing`);
        throw new ValidationError("New password is required.");
      }

      this.logger.info(`[repo] Hashing new password for userId: ${userId}`);
      const passwordHash = await hashPassword(newPassword);

      this.logger.info(
        `[repo] Updating password in database for userId: ${userId}`
      );
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { passwordHash, updateCount: { increment: 1 } },
      });

      this.logger.success(
        `[repo] Password reset successful for userId: ${userId}`
      );
      return updatedUser;
    } catch (error: any) {
      this.logger.error(`[repo] resetPassword error: ${error.message}`);
      if (error instanceof ValidationError) throw error;
      throw new Error(`Error resetting password: ${error.message}`);
    }
  }

  async changeUsername(userId: string, newUsername: string): Promise<User> {
    this.logger.info(`[repo] changeUsername() called for userId: ${userId}`);
    try {
      if (!newUsername) {
        this.logger.warn(`[repo] Validation failed: new username missing`);
        throw new ValidationError("New username is required.");
      }

      this.logger.info(
        `[repo] Updating username in database for userId: ${userId}`
      );
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { username: newUsername, updateCount: { increment: 1 } },
      });

      this.logger.success(
        `[repo] Username changed successfully for userId: ${userId}`
      );
      return updatedUser;
    } catch (error: any) {
      this.logger.error(`[repo] changeUsername error: ${error.message}`);
      if (error instanceof ValidationError) throw error;
      throw new Error(`Error changing username: ${error.message}`);
    }
  }
}
