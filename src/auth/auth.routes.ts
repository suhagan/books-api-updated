// This file defines the authentication routes and 
// their handlers. It uses Fastify's route definitions 
// and connects them to the controller functions 
// defined in auth.controller.ts. The route handlers 
// also specify the expected request body schemas and 
// response schemas for validation and documentation 
// purposes.

import type { FastifyInstance } from "fastify";
import * as controller from "./auth.controller";
import {
  authResponseSchema,
  loginBodySchema,
  refreshBodySchema,
  registerBodySchema,
} from "./auth.schemas";

export async function authRoutes(app: FastifyInstance) {
  app.post(
    "/auth/register",
    {
      schema: {
        body: registerBodySchema,
        response: { 201: authResponseSchema },
      },
    },
    controller.register
  );

  app.post(
    "/auth/login",
    {
      schema: {
        body: loginBodySchema,
        response: { 200: authResponseSchema },
      },
    },
    controller.login
  );

  app.post(
    "/auth/refresh",
    {
      schema: {
        body: refreshBodySchema,
        response: { 200: authResponseSchema },
      },
    },
    controller.refresh
  );

  app.post(
    "/auth/logout",
    {
      schema: {
        body: refreshBodySchema,
      },
    },
    controller.logout
  );
}