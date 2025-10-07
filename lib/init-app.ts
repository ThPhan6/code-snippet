// Application initialization script
// This should be called once when the app starts (e.g., in root layout)

import { initializeMockData } from "./data/mock-data";

/**
 * Initialize the application
 * - Seeds mock data to localStorage if not present
 */
export const initializeApp = (): void => {
  if (typeof window === "undefined") return;

  try {
    // Initialize mock data
    initializeMockData();

    console.log("✅ App initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize app:", error);
  }
};
