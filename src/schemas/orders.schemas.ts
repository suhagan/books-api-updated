export const createOrderBodySchema = {
  type: "object",
  required: ["customer_id", "items"],
  properties: {
    customer_id: { type: "integer" },
    items: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        required: ["book_id", "quantity"],
        properties: {
          book_id: { type: "integer" },
          quantity: { type: "integer", minimum: 1 },
        },
      },
    },
  },
} as const;

export const customerIdParamsSchemaForOrders = {
  type: "object",
  required: ["id"],
  properties: {
    id: { type: "string" },
  },
} as const;
