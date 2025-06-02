import { compare } from "bcryptjs";
import { getUserByEmailWithPassword } from "../db/users/users-get";

export async function authenticateUser(
  email: string,
  password: string
): Promise<{ id: string; email: string; password_hash: string } | null> {
  const user = await getUserByEmailWithPassword(email);
  if (!user) {
    return null;
  }
  const isValid = await compare(password, user.password_hash);
  return isValid ? user : null;
}
