import { hash } from "bcryptjs";
import { queryOne, transaction } from "../postgres";

export const createUser = async (user: {
  email: string;
  name: string;
  username: string;
  role: string;
  password: string;
}) => {
  try {
    return await transaction(async () => {
      const passwordHash = await hash(user.password, 12);

      const sql = `
          INSERT INTO users (email, name, username, role, password_hash)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *
        `;
      const params = [
        user.email,
        user.name,
        user.username,
        user.role,
        passwordHash,
      ];

      const newUser = await queryOne(sql, params);

      if (!newUser) {
        throw new Error("Failed to create user");
      }

      return newUser;
    });
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};
