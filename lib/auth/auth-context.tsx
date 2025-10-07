// Authentication context and hooks for React components

"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, AuthResponse } from "../data/types";
import { getCurrentUser, login, register, logout } from "./auth-service";

interface AuthContextType {
  user: Omit<User, "password"> | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  loginUser: (email: string, password: string) => Promise<AuthResponse>;
  registerUser: (
    email: string,
    password: string,
    name: string,
    username: string
  ) => Promise<AuthResponse>;
  logoutUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Omit<User, "password"> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Auth check failed:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const loginUser = async (
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    try {
      setIsLoading(true);
      const response = await login(email, password);

      if (response.success && response.user) {
        setUser(response.user);
      }

      return response;
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Login failed" };
    } finally {
      setIsLoading(false);
    }
  };

  const registerUser = async (
    email: string,
    password: string,
    name: string,
    username: string
  ): Promise<AuthResponse> => {
    try {
      setIsLoading(true);
      const response = await register(email, password, name, username);

      if (response.success && response.user) {
        setUser(response.user);
      }

      return response;
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, error: "Registration failed" };
    } finally {
      setIsLoading(false);
    }
  };

  const logoutUser = () => {
    logout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    loginUser,
    registerUser,
    logoutUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
