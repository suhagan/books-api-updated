// auth schemas for request validation and response formatting

// Define JSON schemas for validating request bodies and formatting responses for authentication endpoints
export const registerBodySchema = {
  type: "object",
  required: ["email", "password"],
  additionalProperties: false,
  properties: {
    email: { type: "string", minLength: 3, maxLength: 320 },
    password: { type: "string", minLength: 8, maxLength: 200 },
    role: { type: "string", enum: ["user", "admin"] },
  },
} as const;

// Schema for login request body
export const loginBodySchema = {
  type: "object",
  required: ["email", "password"],
  additionalProperties: false,
  properties: {
    email: { type: "string", minLength: 3, maxLength: 320 },
    password: { type: "string", minLength: 8, maxLength: 200 },
  },
} as const;

// Schema for token refresh request body
export const refreshBodySchema = {
  type: "object",
  required: ["refreshToken"],
  additionalProperties: false,
  properties: {
    refreshToken: { type: "string", minLength: 20 },
  },
} as const;

// Schema for authentication response (e.g., login and refresh)
export const authResponseSchema = {
  type: "object",
  required: ["accessToken", "refreshToken"],
  properties: {
    accessToken: { type: "string" },
    refreshToken: { type: "string" },
  },
} as const;