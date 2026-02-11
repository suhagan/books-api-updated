export const bookIdParamsSchema = {
  type: "object",
  required: ["id"],
  properties: {
    id: { type: "string" },
  },
} as const;

export const booksQuerySchema = {
  type: "object",
  properties: {
    year: { type: "integer" },
  },
} as const;

export const createBookBodySchema = {
  type: "object",
  required: ["title", "author", "year", "price"],
  properties: {
    title: { type: "string", minLength: 1 },
    author: { type: "string", minLength: 1 },
    year: { type: "integer" },
    isbn: { type: ["string", "null"] },
    price: { type: "number" },
    stock_quantity: { type: "integer" },
  },
} as const;

export const updateBookBodySchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: { type: "string", minLength: 1 },
    author: { type: "string", minLength: 1 },
    year: { type: "integer" },
    isbn: { type: ["string", "null"] },
    price: { type: "number" },
    stock_quantity: { type: "integer" },
  },
} as const;
