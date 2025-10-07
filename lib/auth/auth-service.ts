// Authentication service functions

import { User, AuthResponse } from "../data/types";
import {
  loadUsers,
  addUser,
  getUserByEmail,
  getUserByUsername,
  updateUser,
  saveAuthToken,
  loadAuthToken,
  removeAuthToken,
} from "../data/storage";
import { createJWT, verifyJWT } from "./jwt";

/**
 * Generate unique user ID
 */
const generateUserId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

/**
 * Register a new user
 */
export const register = (
  email: string,
  userPassword: string,
  name: string,
  username: string
): AuthResponse => {
  try {
    // Validate input
    if (!email || !userPassword || !name || !username) {
      return { success: false, error: "All fields are required" };
    }

    // Check if email already exists
    const existingUserByEmail = getUserByEmail(email);
    if (existingUserByEmail) {
      return { success: false, error: "Email already exists" };
    }

    // Check if username already exists
    const existingUserByUsername = getUserByUsername(username);
    if (existingUserByUsername) {
      return { success: false, error: "Username already exists" };
    }

    // Validate password length
    if (userPassword.length < 6) {
      return {
        success: false,
        error: "Password must be at least 6 characters",
      };
    }

    // Validate username format (alphanumeric and underscore only)
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      return {
        success: false,
        error: "Username can only contain letters, numbers, and underscores",
      };
    }

    // Create new user
    const newUser: User = {
      id: generateUserId(),
      email,
      password: userPassword, // Note: In a real app with backend, this would be hashed
      name,
      username,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save user to storage
    addUser(newUser);

    // Create JWT token
    const token = createJWT({
      userId: newUser.id,
      email: newUser.email,
      username: newUser.username,
    });

    // Save token to storage
    saveAuthToken(token);

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;

    return {
      success: true,
      user: userWithoutPassword,
      token,
    };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: "Registration failed" };
  }
};

/**
 * Login user
 */
export const login = (email: string, userPassword: string): AuthResponse => {
  try {
    // Validate input
    if (!email || !userPassword) {
      return { success: false, error: "Email and password are required" };
    }

    // Find user by email
    const user = getUserByEmail(email);

    if (!user) {
      return { success: false, error: "Invalid email or password" };
    }

    // Check password

    if (user.password !== userPassword) {
      // Note: In a real app, this would use bcrypt.compare()
      return { success: false, error: "Invalid email or password" };
    }

    // Create JWT token
    const token = createJWT({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    // Save token to storage
    saveAuthToken(token);

    // Return user without password
    const { password, ...userWithoutPassword } = user;

    return {
      success: true,
      user: userWithoutPassword,
      token,
    };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Login failed" };
  }
};

/**
 * Logout user
 */
export const logout = (): void => {
  removeAuthToken();
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = (): Omit<User, "password"> | null => {
  try {
    const token = loadAuthToken();
    if (!token) return null;

    // Verify token
    const decoded = verifyJWT(token);
    if (!decoded) {
      // Token is invalid or expired
      removeAuthToken();
      return null;
    }

    // Get user from storage
    const users = loadUsers();
    const user = users.find((u) => u.id === decoded.userId);
    if (!user) {
      removeAuthToken();
      return null;
    }

    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const user = getCurrentUser();
  return !!user;
};

/**
 * Update user profile
 */
export const updateUserProfile = (
  userId: string,
  updates: Partial<Pick<User, "name" | "username">>
): AuthResponse => {
  try {
    // Check if username is being updated and if it already exists
    if (updates.username) {
      const existingUser = getUserByUsername(updates.username);
      if (existingUser && existingUser.id !== userId) {
        return { success: false, error: "Username already exists" };
      }
    }

    // Update user
    updateUser(userId, updates);

    // Get updated user
    const updatedUser = getCurrentUser();
    if (!updatedUser) {
      return { success: false, error: "Failed to update user" };
    }

    return {
      success: true,
      user: updatedUser,
    };
  } catch (error) {
    console.error("Update user error:", error);
    return { success: false, error: "Failed to update profile" };
  }
};

/**
 * Change user password
 */
export const changePassword = (
  userId: string,
  currentPassword: string,
  newPassword: string
): AuthResponse => {
  try {
    const users = loadUsers();
    const user = users.find((u) => u.id === userId);

    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Verify current password
    if (user.password !== currentPassword) {
      return { success: false, error: "Current password is incorrect" };
    }

    // Validate new password
    if (newPassword.length < 6) {
      return {
        success: false,
        error: "Password must be at least 6 characters",
      };
    }

    // Update password
    updateUser(userId, { password: newPassword });

    return { success: true };
  } catch (error) {
    console.error("Change password error:", error);
    return { success: false, error: "Failed to change password" };
  }
};
