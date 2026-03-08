// This file contains the core business logic for authentication: register, login, refresh, logout.

import { compare, hash } from "bcryptjs";
import { createHash } from "node:crypto";
import { ApiError } from "../errors/api-error";
import type { AuthTokens, LoginBody, RegisterBody } from "./auth.types";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "./jwt";
import {
  createUser,
  findUserByEmail,
  insertRefreshToken,
  isRefreshTokenValid,
  revokeRefreshToken,
} from "./auth.repository";

// We hash refresh tokens in DB since they are long-lived and more vulnerable to leaks.
function sha256(input: string) {
  return createHash("sha256").update(input).digest("hex");
}

// Helper to read TTL from env with fallback and sanity checks.
function seconds(name: string, fallback: number) {
  const raw = process.env[name];
  const n = raw ? Number(raw) : fallback;
  if (!Number.isFinite(n) || n <= 0) return fallback;
  return n;
}

// In a real app, we might want to split this into multiple files (e.g. service vs repository).
export async function register(body: RegisterBody): Promise<AuthTokens> {
  const email = body.email.trim().toLowerCase();

  const existing = await findUserByEmail(email);
  if (existing) throw new ApiError(409, "Email already registered");

  const password_hash = await hash(body.password, 12);
  const role = body.role ?? "user"; // you can force "user" later

  const user = await createUser({ email, password_hash, role });

  const accessToken = await signAccessToken({
    sub: String(user.id),
    email: user.email,
    role: user.role,
  });

  // For simplicity, we issue tokens immediately on registration. In some apps, we might want email verification first.
  const refreshToken = await signRefreshToken({ sub: String(user.id) });

  const ttl = seconds("REFRESH_TOKEN_TTL_SECONDS", 1209600);
  const expires_at = new Date(Date.now() + ttl * 1000);

  await insertRefreshToken({
    user_id: user.id,
    token_hash: sha256(refreshToken),
    expires_at,
  });

  return { accessToken, refreshToken };
}

// in a real app, we might want to add rate limiting and more detailed error messages (e.g. distinguish "email not found" vs "wrong password"), but that can also leak info to attackers, so we keep it generic here.
export async function login(body: LoginBody): Promise<AuthTokens> {
  const email = body.email.trim().toLowerCase();

  const user = await findUserByEmail(email);
  if (!user) throw new ApiError(401, "Invalid credentials");

  const ok = await compare(body.password, user.password_hash);
  if (!ok) throw new ApiError(401, "Invalid credentials");

  const accessToken = await signAccessToken({
    sub: String(user.id),
    email: user.email,
    role: user.role,
  });

  const refreshToken = await signRefreshToken({ sub: String(user.id) });

  const ttl = seconds("REFRESH_TOKEN_TTL_SECONDS", 1209600);
  const expires_at = new Date(Date.now() + ttl * 1000);

  await insertRefreshToken({
    user_id: user.id,
    token_hash: sha256(refreshToken),
    expires_at,
  });

  return { accessToken, refreshToken };
}

export async function refresh(refreshToken: string): Promise<AuthTokens> {
  // 1) verify JWT signature + expiry
  const payload = await verifyRefreshToken(refreshToken);
  const sub = payload.sub;
  if (!sub) throw new ApiError(401, "Invalid refresh token");

  // 2) validate token in DB (not revoked, not expired)
  const token_hash = sha256(refreshToken);
  const valid = await isRefreshTokenValid(token_hash);
  if (!valid) throw new ApiError(401, "Refresh token revoked/expired");

  // 3) rotate: revoke old, create new
  await revokeRefreshToken(token_hash);

  const userId = Number(sub);
  if (!Number.isFinite(userId)) throw new ApiError(401, "Invalid refresh token");

  // Access token should include user claims; easiest is to embed role/email by DB lookup later.
  // For now, you can keep it minimal, then later we’ll add `findUserById()` and attach role/email.
  // (I’ll do that in the next step when we wire middleware + RBAC.)
  const accessToken = await signAccessToken({
    sub: String(userId),
    email: "unknown@local", // will be replaced next step
    role: "user",          // will be replaced next step
  });

  const newRefreshToken = await signRefreshToken({ sub: String(userId) });

  const ttl = seconds("REFRESH_TOKEN_TTL_SECONDS", 1209600);
  const expires_at = new Date(Date.now() + ttl * 1000);

  await insertRefreshToken({
    user_id: userId,
    token_hash: sha256(newRefreshToken),
    expires_at,
  });

  return { accessToken, refreshToken: newRefreshToken };
}

export async function logout(refreshToken: string) {
  // revoke refresh token in DB (if exists)
  try {
    const token_hash = sha256(refreshToken);
    await revokeRefreshToken(token_hash);
  } catch {
    // do not leak info
  }
}