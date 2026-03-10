// This file will be used to add custom properties to 
// the FastifyRequest type.

import "fastify";

declare module "fastify" {
  interface FastifyRequest {
    user?: {
      id: number;
      email?: string;
      role?: string;
    };
  }
}