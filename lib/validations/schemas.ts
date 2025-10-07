// Zod validation schemas for forms

import { z } from "zod";

/**
 * User registration schema
 */
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be less than 20 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      ),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password is too long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

/**
 * User login schema
 */
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

/**
 * Snippet creation/edit schema
 */
export const snippetSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional()
    .default(""),
  code: z.string().min(1, "Code is required").max(50000, "Code is too long"),
  language: z.string().min(1, "Language is required"),
  tags: z
    .array(z.string())
    .max(10, "Maximum 10 tags allowed")
    .optional()
    .default([]),
  isPublic: z.boolean(),
  timeComplexity: z.string().optional(),
});

/**
 * Tag creation schema
 */
export const tagSchema = z.object({
  name: z
    .string()
    .min(2, "Tag name must be at least 2 characters")
    .max(30, "Tag name must be less than 30 characters"),
  type: z.enum(["language", "topic"]),
});

/**
 * User profile update schema
 */
export const profileUpdateSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
});

/**
 * Change password schema
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters")
      .max(100, "Password is too long"),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"],
  });

/**
 * Search schema
 */
export const searchSchema = z.object({
  query: z
    .string()
    .min(1, "Search query is required")
    .max(100, "Search query is too long"),
  language: z.string().optional(),
});

// Type exports
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type SnippetInput = z.infer<typeof snippetSchema>;
export type TagInput = z.infer<typeof tagSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
