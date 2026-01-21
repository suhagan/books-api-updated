import type { FastifySchema } from "fastify";

export const loanBookSchema: FastifySchema = {
  body: {
    type: "object",
    required: ["book_id"],
    properties: {
      book_id: { type: "string" }, // "5"
    },
  },
};
