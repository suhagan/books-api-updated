// JWT Helpers
// This module provides functions to sign and verify JWTs for access and 
// refresh tokens, using the 'jose' library.
// It also includes helper functions to read secrets and TTLs from 
// environment variables, with validation.

import { SignJWT, jwtVerify } from "jose"; // for signing and verifying JWTs
import type { UserRole } from "./auth.types"; // for type annotations

// TextEncoder is used to convert secret strings to Uint8Array for jose functions
const textEncoder = new TextEncoder(); 

// Helper functions to get secrets and TTLs from environment variables, with validation
function getAccessSecret() {
  const s = process.env.JWT_ACCESS_SECRET;
  if (!s) throw new Error("Missing JWT_ACCESS_SECRET");
  return textEncoder.encode(s);
}

// Get TTL (time to live) in seconds for access and refresh tokens, with defaults
function getRefreshSecret() {
  const s = process.env.JWT_REFRESH_SECRET;
  if (!s) throw new Error("Missing JWT_REFRESH_SECRET");
  return textEncoder.encode(s);
}

// Helper function to get TTL from env vars, with validation and fallback
function ttlSeconds(name: string, fallback: number) {
  const raw = process.env[name];
  const n = raw ? Number(raw) : fallback;
  if (!Number.isFinite(n) || n <= 0) return fallback;
  return n;
}

// Payload structure for access tokens, including standard 'sub' claim and custom claims
export type AccessPayload = {
  sub: string; // user id as string
  email: string;
  role: UserRole;
};

// Function to sign an access token with the given payload, 
// using the access secret and TTL
export async function signAccessToken(payload: AccessPayload) {
  const exp = ttlSeconds("ACCESS_TOKEN_TTL_SECONDS", 900);
  return new SignJWT({ email: payload.email, role: payload.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${exp}s`)
    .sign(getAccessSecret());
}

// Function to sign a refresh token, which typically has a longer TTL 
// and may contain minimal payload (e.g., just the user id in 'sub')
export async function signRefreshToken(payload: Pick<AccessPayload, "sub">) {
  const exp = ttlSeconds("REFRESH_TOKEN_TTL_SECONDS", 1209600);
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${exp}s`)
    .sign(getRefreshSecret());
}

// Function to verify an access token and return its payload if valid, 
// or throw an error if invalid/expired
export async function verifyAccessToken(token: string) {
  const { payload } = await jwtVerify(token, getAccessSecret());
  return payload; // includes sub + custom claims
}

// Function to verify a refresh token and return its payload if valid, 
// or throw an error if invalid/expired
export async function verifyRefreshToken(token: string) {
  const { payload } = await jwtVerify(token, getRefreshSecret());
  return payload;
}