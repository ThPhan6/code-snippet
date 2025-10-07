// General utility helper functions

/**
 * Generate a unique ID
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

/**
 * Format date to readable string
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

/**
 * Format date to relative time (e.g., "2 days ago")
 */
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000)
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 31536000)
    return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

/**
 * Create a slug from a string
 */
export const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Get initials from name
 */
export const getInitials = (name: string): string => {
  const names = name.trim().split(" ");
  if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
  return (names[0][0] + names[names.length - 1][0]).toUpperCase();
};

/**
 * Count words in text
 */
export const countWords = (text: string): number => {
  return text.trim().split(/\s+/).length;
};

/**
 * Count lines in text
 */
export const countLines = (text: string): number => {
  return text.split("\n").length;
};

/**
 * Generate shareable URL for snippet
 */
export const getSnippetShareUrl = (
  snippetId: string,
  title: string,
  baseUrl: string = ""
): string => {
  const slug = createSlug(title);
  return `${baseUrl}/snippets/${snippetId}/${slug}`;
};

/**
 * Generate profile URL
 */
export const getProfileUrl = (
  username: string,
  baseUrl: string = ""
): string => {
  return `${baseUrl}/profile/${username}`;
};

/**
 * Generate language page URL
 */
export const getLanguageUrl = (
  language: string,
  baseUrl: string = ""
): string => {
  const slug = createSlug(language);
  return `${baseUrl}/languages/${slug}`;
};

/**
 * Get full URL (for sharing)
 */
export const getFullUrl = (path: string): string => {
  if (typeof window !== "undefined") {
    return `${window.location.origin}${path}`;
  }
  return path;
};

/**
 * Get complexity color for display
 */
export const getComplexityColor = (complexity: string): string => {
  // Handle dynamic O(n^k) patterns
  if (complexity.match(/^O\(n\^?\d+\)$/)) {
    const match = complexity.match(/^O\(n\^?(\d+)\)$/);
    if (match) {
      const power = parseInt(match[1]);
      if (power === 1) return "text-yellow-600";
      if (power === 2) return "text-red-600";
      if (power === 3) return "text-red-800";
      if (power >= 4) return "text-red-900";
    }
  }

  // Handle specific cases
  switch (complexity) {
    case "O(1)":
      return "text-green-600";
    case "O(log n)":
      return "text-blue-600";
    case "O(n)":
      return "text-yellow-600";
    case "O(n log n)":
      return "text-orange-600";
    case "O(n²)":
    case "O(n^2)":
      return "text-red-600";
    case "O(n³)":
    case "O(n^3)":
      return "text-red-800";
    default:
      return "text-gray-600";
  }
};
