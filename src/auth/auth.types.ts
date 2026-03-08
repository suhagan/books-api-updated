// auth types and interfaces

// Define user roles, user data structures, and request/response types for authentication
export type UserRole = "user" | "admin"; 

// User entity representing a user in the database
export type User = {
  id: number;
  email: string;
  password_hash: string;
  role: UserRole;
};

// Public user data that can be safely exposed (e.g., in API responses)
export type PublicUser = {
  id: number;
  email: string;
  role: UserRole;
};

// Request body types for authentication endpoints
export type RegisterBody = {
  email: string;
  password: string;
  role?: UserRole; // allow only in dev OR remove later
};

// Request body for login endpoint
export type LoginBody = {
  email: string;
  password: string;
};

// Request body for token refresh endpoint
export type RefreshBody = {
  refreshToken: string;
};

// Response type for authentication endpoints (e.g., login and refresh)
export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};