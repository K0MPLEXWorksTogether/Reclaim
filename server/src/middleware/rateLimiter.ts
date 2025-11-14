import rateLimit from "express-rate-limit";

export const ipLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});

export const idLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10,
  keyGenerator: (req, res) => {
    return req.userId ?? "";
  },
  message: "Too many requests from this user ID, please slow down.",
});
