import type { FastifyInstance } from "fastify";
import { ApiError } from "./api-error";

export function registerErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((err, _req, reply) => {
    // Known errors
    if (err instanceof ApiError) {
      return reply.status(err.statusCode).send({
        error: err.message,
        details: err.details ?? null,
      });
    }

    // Fastify schema validation errors
    // (Fastify attaches statusCode sometimes)
    const anyErr = err as any;
    const statusCode = typeof anyErr.statusCode === "number" ? anyErr.statusCode : 500;

    // return reply.status(statusCode).send({
    //   error: statusCode === 500 ? "Internal Server Error" : err.message,
    //   details: statusCode === 500 ? null : anyErr.validation ?? null,
    // });

    return reply.status(statusCode).send({
        error: err.message,
        details: anyErr.validation ?? null,
    });

    
  });
}
