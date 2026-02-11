// Adding returnBookSchema
// Why: to return book and validate request body.

import type { FastifySchema } from "fastify";

// schema to loan a book
export const loanBookSchema: FastifySchema = {
  body: {
    type: "object",
    required: ["book_id"],
    additionalProperties: false,
    properties: {
      book_id: { type: "string" }, // "5"
    },
  },
};

// schema to return a book
export const returnBookSchema: FastifySchema = {
  body: {
    type: "object",
    required: ["book_id"],
    additionalProperties: false,
    properties: {
      book_id: { type: "string" },
    },
  },
};
