import argon2 from "argon2";
import AppLogger from "./logger";
import { InvalidError } from "../types/errors";

const OPTIONS = {
  type: argon2.argon2id,
  memoryCost: 2 * 16, // 64 MB
  timeCost: 3,
  parallelism: 1,
};
const logger = AppLogger.getInstance();

export async function hashPassword(password: string): Promise<string> {
  try {
    const passwordHash = argon2.hash(password);
    logger.success(`[password] Successfully hashed password.`);
    return passwordHash;
  } catch (err) {
    logger.error(`[password] Error hashing password: ${err}`);
    throw new InvalidError("Error while hashing password.");
  }
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  try {
    const isCorrectPassword = argon2.verify(hash, password);
    logger.success(`[password] Successfully compared passwords!`);
    return isCorrectPassword;
  } catch (err) {
    logger.error(`[password] Error comparing password: ${err}`);
    throw new InvalidError("Error while validating password.");
  }
}
