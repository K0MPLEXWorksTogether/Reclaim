import { z } from "zod";

export const signupValidator = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginValidator = z.object({
  username: z.string(),
  password: z.string(),
});

export const changeUsernameValidator = z.object({
  newUsername: z.string().min(3),
});

export const resetPasswordValidator = z.object({
  newPassword: z.string().min(6),
});