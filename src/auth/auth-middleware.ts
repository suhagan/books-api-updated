// JWT middleware 

import type { FastifyReply, FastifyRequest } from "fastify";
import { ApiError } from "../errors/api-error";
import { verifyAccessToken } from "./jwt";

export type AuthUser = {
  id: number;
  email?: string;
  role?: string;
};

export async function verifyJwt(
  request: FastifyRequest,
  _reply: FastifyReply
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new ApiError(401, "Missing Authorization header");
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw new ApiError(401, "Invalid Authorization format");
  }

  const payload = await verifyAccessToken(token);

  const user: AuthUser = {
    id: Number(payload.sub),
    email: typeof payload.email === "string" ? payload.email : undefined,
    role: typeof payload.role === "string" ? payload.role : undefined,
  };

  (request as FastifyRequest & { user: AuthUser }).user = user;
}