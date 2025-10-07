// Core data type definitions for the application

export interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  password: string; // In a real app with backend, this would be hashed
  createdAt: string;
  updatedAt: string;
}

export interface Snippet {
  id: string;
  title: string; // Title of the snippet
  description: string;
  code: string;
  language: string; // Programming language (e.g., "JavaScript", "Python")
  authorId: string;
  isPublic: boolean;
  timeComplexity?: string; // e.g., "O(n)", "O(n²)", "O(log n)"
  tags: string[]; // Array of topic tag IDs (API, Database, Algorithm, etc.)
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  type: "language" | "topic";
  createdAt: string;
  updatedAt: string;
}

// Helper types for frontend usage
export interface SnippetWithAuthor extends Snippet {
  author: Pick<User, "id" | "name" | "username">;
}

export interface UserPublicProfile {
  id: string;
  name: string;
  username: string;
  createdAt: string;
  snippetCount: number;
  languages: string[];
}

// JWT Payload type
export interface JWTPayload {
  userId: string;
  email: string;
  username: string;
  iat?: number;
  exp?: number;
}

// Auth response types
export interface AuthResponse {
  success: boolean;
  user?: Omit<User, "password">;
  token?: string;
  error?: string;
}

// User credentials (stored separately for security)
export interface UserCredentials {
  userId: string;
  email: string;
  password: string; // Only for demo - never store in real app
}

// Public user profile (stored in localStorage)
export interface UserProfile {
  id: string;
  name: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "authToken",
  AUTH_CREDENTIALS: "authCredentials", // Separate storage for sensitive data
  USERS: "users", // Only stores public profile data
  SNIPPETS: "snippets",
  TAGS: "tags",
  LANGUAGE: "language", // UI language preference (en/vi)
} as const;
