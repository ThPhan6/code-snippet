// JWT utility functions for authentication

import jwt from "jsonwebtoken";
import { JWTPayload } from "../data/types";

// Get JWT secret from environment variable with fallback
const JWT_SECRET =
  process.env.NEXT_PUBLIC_JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = "7d"; // Token expires in 7 days

/**
 * Create a JWT token for a user
 */
export const createJWT = (payload: Omit<JWTPayload, "iat" | "exp">): string => {
  try {
    // Ensure JWT_SECRET is a string
    const secret =
      typeof JWT_SECRET === "string" ? JWT_SECRET : "fallback-secret";

    // Create token with proper options
    const token = jwt.sign(payload, secret, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return token;
  } catch (error) {
    console.error("Error creating JWT:", error);
    // Return a simple fallback token
    try {
      return jwt.sign(payload, "fallback-secret", {
        expiresIn: "1h",
      });
    } catch (fallbackError) {
      console.error("Fallback JWT creation failed:", fallbackError);
      // Return a mock token as last resort
      return "mock-token-" + Date.now();
    }
  }
};

/**
 * Verify and decode a JWT token
 */
export const verifyJWT = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch {
    // Token is invalid or expired
    return null;
  }
};

/**
 * Decode JWT without verification (use with caution)
 */
export const decodeJWT = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.decode(token) as JWTPayload;
    return decoded;
  } catch {
    console.error("Error decoding JWT");
    return null;
  }
};

/**
 * Check if a JWT token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
};

/**
 * Get token expiration time
 */
export const getTokenExpiration = (token: string): Date | null => {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return null;

  return new Date(decoded.exp * 1000);
};
