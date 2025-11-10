import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwtUtils";

// TODO: Protect user routes
export default function validateJwt(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization ?? "";
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Authorization token required" });
    }

    const payload = verifyToken(token);
    req.userId = payload.userId;
    next();
  } catch (err) {
    console.error("Could not validate JWT:", err);
    next(err);
  }
}
