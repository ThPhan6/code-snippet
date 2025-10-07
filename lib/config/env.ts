/**
 * Centralized environment configuration
 * Eliminates duplication of environment variable access
 */

export const ENV = {
  // Base URL for the application
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

  // JWT Configuration
  JWT_SECRET:
    process.env.NEXT_PUBLIC_JWT_SECRET ||
    "your-super-secret-jwt-key-change-this-in-production",

  // Node Environment
  NODE_ENV: process.env.NODE_ENV || "development",

  // Check if running in production
  IS_PRODUCTION: process.env.NODE_ENV === "production",

  // Check if running in development
  IS_DEVELOPMENT: process.env.NODE_ENV === "development",
} as const;

/**
 * Helper function to get full URL for a path
 */
export function getFullUrl(path: string = ""): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${ENV.APP_URL}${cleanPath}`;
}

/**
 * Helper function to check if a URL is absolute
 */
export function isAbsoluteUrl(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://");
}

/**
 * Helper function to get absolute URL (handles both relative and absolute URLs)
 */
export function getAbsoluteUrl(url: string): string {
  if (isAbsoluteUrl(url)) {
    return url;
  }
  return getFullUrl(url);
}
