import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "supersecret";

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, SECRET_KEY, { expiresIn: "1h" });
}

export function verifyToken(token: string): { userId: string } {
  return jwt.verify(token, SECRET_KEY) as { userId: string };
}
