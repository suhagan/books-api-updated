export const customerIdParamsSchema = {
  type: "object",
  required: ["id"],
  properties: {
    id: { type: "string" },
  },
} as const;

export const createCustomerBodySchema = {
  type: "object",
  required: ["first_name", "last_name", "email"],
  properties: {
    first_name: { type: "string", minLength: 1 },
    last_name: { type: "string", minLength: 1 },
    email: { type: "string", minLength: 3 },
    phone: { type: ["string", "null"] },
    city: { type: ["string", "null"] },
    country: { type: ["string", "null"] },
  },
} as const;
