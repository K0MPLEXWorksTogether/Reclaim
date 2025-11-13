import jwt from "jsonwebtoken";
import AppLogger from "./logger";
import { InvalidError } from "../types/errors";

const SECRET_KEY = process.env.JWT_SECRET || "supersecret";
const logger = AppLogger.getInstance();

export function generateToken(userId: string): string {
  try {
    const token = jwt.sign({ userId }, SECRET_KEY, { expiresIn: "1h" });
    logger.success(`[jwt] Successfully generated token!`);
    return token;
  } catch (err) {
    logger.error(`[jwt]Error generating token: ${err}`);
    throw new InvalidError("Failed to generate token.");
  }
}

export function verifyToken(token: string): { userId: string } {
  try {
    const payload = jwt.verify(token, SECRET_KEY) as { userId: string };
    logger.success(`[jwt] Successfully validated token.`);
    return payload;
  } catch (err) {
    logger.error(`[jwt] Error validating token: ${err}`);
    throw new InvalidError("Failed to validate token.");
  }
}
