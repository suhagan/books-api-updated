// This file contains the controller functions for 
// authentication routes. They mostly just call the 
// service functions and handle HTTP details (status 
// codes, etc).

import type { FastifyReply, FastifyRequest } from "fastify";
import type { LoginBody, RefreshBody, RegisterBody } from "./auth.types";
import * as authService from "./auth.service";

// In a real app, we might want to add more detailed 
// error handling here (e.g. catch specific errors from 
// the service and return different status codes), 
// but for simplicity, we let errors propagate and be 
// handled by a global error handler that returns 500 
// for unexpected errors.
export async function register(
  req: FastifyRequest<{ Body: RegisterBody }>,
  reply: FastifyReply
) {
  const tokens = await authService.register(req.body);
  return reply.code(201).send(tokens);
}

export async function login(
  req: FastifyRequest<{ Body: LoginBody }>,
  reply: FastifyReply
) {
  const tokens = await authService.login(req.body);
  return reply.code(200).send(tokens);
}

export async function refresh(
  req: FastifyRequest<{ Body: RefreshBody }>,
  reply: FastifyReply
) {
  const tokens = await authService.refresh(req.body.refreshToken);
  return reply.code(200).send(tokens);
}

export async function logout(
  req: FastifyRequest<{ Body: RefreshBody }>,
  reply: FastifyReply
) {
  await authService.logout(req.body.refreshToken);
  return reply.code(204).send();
}