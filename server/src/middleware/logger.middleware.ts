import { Request, Response, NextFunction } from "express";
import AppLogger from "../utils/logger";

const logger = AppLogger.getInstance();

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  logger.info(
    `[request:${req.method}] ${req.originalUrl} - Body: ${JSON.stringify(
      req.body
    )}`
  );

  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info(
      `Request completed: [${req.method}] ${req.originalUrl} - Status: ${res.statusCode} - Duration: ${duration}ms`
    );
  });
  next();
}
