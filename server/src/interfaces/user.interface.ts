import { User } from "../../generated/prisma-client";

export interface UserInterface {
  signup(username: string, password: string): Promise<User>;
  login(username: string, password: string): Promise<string>;
  getProfile(userId: string): Promise<User | null>;
  resetPassword(userId: string, newPassword: string): Promise<User>;
  changeUsername(userId: string, newUsername: string): Promise<User>;
}
