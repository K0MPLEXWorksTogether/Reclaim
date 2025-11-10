import argon2 from "argon2";

const OPTIONS = {
  type: argon2.argon2id,
  memoryCost: 2 * 16, // 64 MB
  timeCost: 3,
  parallelism: 1,
};

export async function hashPassword(password: string) {
  return argon2.hash(password);
}

export async function comparePassword(password: string, hash: string) {
  return argon2.verify(hash, password);
}
