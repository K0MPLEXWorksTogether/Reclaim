import { PrismaClient, User } from "../../generated/prisma-client";
import { UserInterface } from "../interfaces/user.interface";
import { hashPassword, comparePassword } from "../utils/passwordUtils";
import { generateToken } from "../utils/jwtUtils";
import { ValidationError, InvalidError, CompareError } from "../types/errors";

const prisma = new PrismaClient();

export class UserRepository implements UserInterface {
  async signup(username: string, password: string): Promise<User> {
    try {
      if (!username || !password) {
        throw new ValidationError("Username and password are required.");
      }
      const existingUser = await prisma.user.findUnique({
        where: { username },
      });
      if (existingUser) {
        throw new InvalidError("Username already exists.");
      }
      const passwordHash = await hashPassword(password);
      return await prisma.user.create({
        data: { username, passwordHash },
      });
    } catch (error: any) {
      if (error instanceof ValidationError || error instanceof InvalidError) {
        throw error;
      }
      throw new Error(`Error during signup: ${error.message}`);
    }
  }

  async login(username: string, password: string): Promise<string> {
    try {
      if (!username || !password) {
        throw new ValidationError("Username and password are required.");
      }

      const user = await prisma.user.findUnique({ where: { username } });
      if (!user) {
        throw new InvalidError("Invalid username or password");
      }

      const valid = await comparePassword(password, user.passwordHash);
      if (!valid) {
        throw new CompareError("Invalid username or password");
      }

      return generateToken(user.id);
    } catch (error: any) {
      if (
        error instanceof ValidationError ||
        error instanceof InvalidError ||
        error instanceof CompareError
      ) {
        throw error;
      }
      throw new Error(`Error during login: ${error.message}`);
    }
  }

  async getProfile(userId: string): Promise<User | null> {
    try {
      return await prisma.user.findUnique({ where: { id: userId } });
    } catch (error: any) {
      throw new Error(`Error fetching profile: ${error.message}`);
    }
  }

  async resetPassword(userId: string, newPassword: string): Promise<User> {
    try {
      if (!newPassword) {
        throw new ValidationError("New password is required.");
      }

      const passwordHash = await hashPassword(newPassword);
      return await prisma.user.update({
        where: { id: userId },
        data: { passwordHash },
      });
    } catch (error: any) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new Error(`Error resetting password: ${error.message}`);
    }
  }

  async changeUsername(userId: string, newUsername: string): Promise<User> {
    try {
      if (!newUsername) {
        throw new ValidationError("New username is required.");
      }

      return await prisma.user.update({
        where: { id: userId },
        data: { username: newUsername },
      });
    } catch (error: any) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new Error(`Error changing username: ${error.message}`);
    }
  }
}
