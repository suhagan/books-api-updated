// auth repository for database interactions related to authentication

import { sql } from "../db/client";
import type { User } from "./auth.types";

// Functions to interact with the database for user 
// management and refresh token handling
export async function findUserByEmail(email: string): Promise<User | null> {
  const rows = await sql`
    SELECT id, email, password_hash, role
    FROM users
    WHERE email = ${email}
    LIMIT 1
  `;
  return (rows[0] as User | undefined) ?? null;
}

// Additional functions for user management and refresh token handling
export async function findUserById(id: number): Promise<User | null> {
  const rows = await sql`
    SELECT id, email, password_hash, role
    FROM users
    WHERE id = ${id}
    LIMIT 1
  `;
  return (rows[0] as User | undefined) ?? null;
}

// Create a new user in the database with 
// the given email, password hash, and role
export async function createUser(params: {
  email: string;
  password_hash: string;
  role: "user" | "admin";
}): Promise<User> {
  const rows = await sql`
    INSERT INTO users (email, password_hash, role)
    VALUES (${params.email}, ${params.password_hash}, ${params.role})
    RETURNING id, email, password_hash, role
  `;
  return rows[0] as User;
}

// Functions to manage refresh tokens in the database, 
// including inserting new tokens, revoking tokens, and validating tokens
export async function insertRefreshToken(params: {
  user_id: number;
  token_hash: string;
  expires_at: Date;
}) {
  await sql`
    INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
    VALUES (${params.user_id}, ${params.token_hash}, ${params.expires_at})
  `;
}

// Mark a refresh token as revoked in the database by setting 
// the revoked_at timestamp
export async function revokeRefreshToken(token_hash: string) {
  await sql`
    UPDATE refresh_tokens
    SET revoked_at = now()
    WHERE token_hash = ${token_hash} AND revoked_at IS NULL
  `;
}

// Check if a refresh token is valid by verifying that it exists, 
// has not been revoked, and has not expired
export async function isRefreshTokenValid(token_hash: string) {
  const rows = await sql`
    SELECT id
    FROM refresh_tokens
    WHERE token_hash = ${token_hash}
      AND revoked_at IS NULL
      AND expires_at > now()
    LIMIT 1
  `;
  return Boolean(rows[0]);
}