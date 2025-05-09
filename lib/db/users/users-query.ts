import { queryOne, query } from "../postgres"
import type { User } from "./users-modify"

export async function getUserById(id: string): Promise<User | null> {
  return queryOne<User>(
    `SELECT 
      id,
      email,
      full_name as "fullName",
      username,
      avatar_url as "avatarUrl",
      role,
      created_at as "createdAt",
      updated_at as "updatedAt"
    FROM users 
    WHERE id = $1`,
    [id],
  )
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return queryOne<User>(
    `SELECT 
      id,
      email,
      full_name as "fullName",
      username,
      avatar_url as "avatarUrl",
      role,
      created_at as "createdAt",
      updated_at as "updatedAt"
    FROM users 
    WHERE email = $1`,
    [email],
  )
}

export async function getUsersByRole(role: string): Promise<User[]> {
  return query<User>(
    `SELECT 
      id,
      email,
      full_name as "fullName",
      username,
      avatar_url as "avatarUrl",
      role,
      created_at as "createdAt",
      updated_at as "updatedAt"
    FROM users 
    WHERE role = $1
    ORDER BY created_at DESC`,
    [role],
  )
}
