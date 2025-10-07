// LocalStorage utility functions for data persistence

import {
  User,
  Snippet,
  Tag,
  STORAGE_KEYS,
  UserCredentials,
  UserProfile,
} from "./types";

/**
 * Generic localStorage save function
 */
export const saveToStorage = <T>(key: string, data: T): void => {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(data));
    }
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error);
  }
};

/**
 * Generic localStorage load function
 */
export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    if (typeof window !== "undefined") {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : defaultValue;
    }
  } catch (error) {
    console.error(`Error loading from localStorage (${key}):`, error);
  }
  return defaultValue;
};

/**
 * Generic localStorage remove function
 */
export const removeFromStorage = (key: string): void => {
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
    }
  } catch (error) {
    console.error(`Error removing from localStorage (${key}):`, error);
  }
};

/**
 * Clear all application data from localStorage
 */
export const clearAllStorage = (): void => {
  try {
    if (typeof window !== "undefined") {
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key);
      });
    }
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
};

// Specific storage functions for each data type

/**
 * User credentials storage (sensitive data - separate from public profiles)
 * NOTE: In a real app, this would NEVER be stored in localStorage
 * This is only for demo purposes
 */
export const saveUserCredentials = (credentials: UserCredentials[]): void => {
  saveToStorage(STORAGE_KEYS.AUTH_CREDENTIALS, credentials);
};

export const loadUserCredentials = (): UserCredentials[] => {
  return loadFromStorage<UserCredentials[]>(STORAGE_KEYS.AUTH_CREDENTIALS, []);
};

export const getUserCredentialsByEmail = (
  email: string
): UserCredentials | undefined => {
  const credentials = loadUserCredentials();
  return credentials.find((cred) => cred.email === email);
};

export const addUserCredentials = (credentials: UserCredentials): void => {
  const allCredentials = loadUserCredentials();
  allCredentials.push(credentials);
  saveUserCredentials(allCredentials);
};

export const updateUserPassword = (
  userId: string,
  newPassword: string
): void => {
  const credentials = loadUserCredentials();
  const index = credentials.findIndex((c) => c.userId === userId);
  if (index !== -1) {
    credentials[index].password = newPassword;
    saveUserCredentials(credentials);
  }
};

/**
 * User profiles storage (public data only - safe to store)
 */
export const saveUserProfiles = (profiles: UserProfile[]): void => {
  saveToStorage(STORAGE_KEYS.USERS, profiles);
};

export const loadUserProfiles = (): UserProfile[] => {
  return loadFromStorage<UserProfile[]>(STORAGE_KEYS.USERS, []);
};

// Legacy functions for backwards compatibility
export const saveUsers = (users: User[]): void => {
  // Split users into profiles and credentials
  const profiles: UserProfile[] = users.map((u) => ({
    id: u.id,
    name: u.name,
    username: u.username,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
  }));

  const credentials: UserCredentials[] = users.map((u) => ({
    userId: u.id,
    email: u.email,
    password: u.password,
  }));

  saveUserProfiles(profiles);
  saveUserCredentials(credentials);
};

export const loadUsers = (): User[] => {
  const profiles = loadUserProfiles();
  const credentials = loadUserCredentials();

  return profiles.map((profile) => {
    const cred = credentials.find((c) => c.userId === profile.id);
    return {
      ...profile,
      email: cred?.email || "",
      password: cred?.password || "",
    };
  });
};

export const getUserById = (userId: string): User | undefined => {
  const profiles = loadUserProfiles();
  const profile = profiles.find((p) => p.id === userId);
  if (!profile) return undefined;

  const credentials = loadUserCredentials();
  const cred = credentials.find((c) => c.userId === userId);

  return {
    ...profile,
    email: cred?.email || "",
    password: cred?.password || "",
  };
};

export const getUserByEmail = (email: string): User | undefined => {
  const credentials = getUserCredentialsByEmail(email);
  if (!credentials) return undefined;

  const profiles = loadUserProfiles();
  const profile = profiles.find((p) => p.id === credentials.userId);
  if (!profile) return undefined;

  return {
    ...profile,
    email: credentials.email,
    password: credentials.password,
  };
};

export const getUserByUsername = (username: string): User | undefined => {
  const profiles = loadUserProfiles();
  const profile = profiles.find((p) => p.username === username);
  if (!profile) return undefined;

  const credentials = loadUserCredentials();
  const cred = credentials.find((c) => c.userId === profile.id);

  return {
    ...profile,
    email: cred?.email || "",
    password: cred?.password || "",
  };
};

export const addUser = (user: User): void => {
  // Split into profile and credentials
  const profile: UserProfile = {
    id: user.id,
    name: user.name,
    username: user.username,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  const credentials: UserCredentials = {
    userId: user.id,
    email: user.email,
    password: user.password,
  };

  // Save separately
  const profiles = loadUserProfiles();
  profiles.push(profile);
  saveUserProfiles(profiles);

  addUserCredentials(credentials);
};

export const updateUser = (userId: string, updates: Partial<User>): void => {
  // Update profile data
  const profiles = loadUserProfiles();
  const profileIndex = profiles.findIndex((p) => p.id === userId);
  if (profileIndex !== -1) {
    profiles[profileIndex] = {
      ...profiles[profileIndex],
      name: updates.name || profiles[profileIndex].name,
      username: updates.username || profiles[profileIndex].username,
      updatedAt: new Date().toISOString(),
    };
    saveUserProfiles(profiles);
  }

  // Update credentials if password is being changed
  if (updates.password) {
    updateUserPassword(userId, updates.password);
  }
};

/**
 * Snippets storage functions
 */
export const saveSnippets = (snippets: Snippet[]): void => {
  saveToStorage(STORAGE_KEYS.SNIPPETS, snippets);
};

export const loadSnippets = (): Snippet[] => {
  return loadFromStorage<Snippet[]>(STORAGE_KEYS.SNIPPETS, []);
};

export const getSnippetById = (snippetId: string): Snippet | undefined => {
  const snippets = loadSnippets();
  return snippets.find((snippet) => snippet.id === snippetId);
};

export const addSnippet = (snippet: Snippet): void => {
  const snippets = loadSnippets();
  snippets.push(snippet);
  saveSnippets(snippets);
};

export const updateSnippet = (
  snippetId: string,
  updates: Partial<Snippet>
): void => {
  const snippets = loadSnippets();
  const index = snippets.findIndex((s) => s.id === snippetId);
  if (index !== -1) {
    snippets[index] = {
      ...snippets[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveSnippets(snippets);
  }
};

export const deleteSnippet = (snippetId: string): void => {
  const snippets = loadSnippets();
  const filtered = snippets.filter((s) => s.id !== snippetId);
  saveSnippets(filtered);
};

/**
 * Tags storage functions
 */
export const saveTags = (tags: Tag[]): void => {
  saveToStorage(STORAGE_KEYS.TAGS, tags);
};

export const loadTags = (): Tag[] => {
  return loadFromStorage<Tag[]>(STORAGE_KEYS.TAGS, []);
};

export const getTagById = (tagId: string): Tag | undefined => {
  const tags = loadTags();
  return tags.find((tag) => tag.id === tagId);
};

export const getTagBySlug = (slug: string): Tag | undefined => {
  const tags = loadTags();
  return tags.find((tag) => tag.slug === slug);
};

export const getTagsByType = (type: "language" | "topic"): Tag[] => {
  const tags = loadTags();
  return tags.filter((tag) => tag.type === type);
};

export const addTag = (tag: Tag): void => {
  const tags = loadTags();
  tags.push(tag);
  saveTags(tags);
};

/**
 * Auth token storage
 */
export const saveAuthToken = (token: string): void => {
  saveToStorage(STORAGE_KEYS.AUTH_TOKEN, token);
};

export const loadAuthToken = (): string | null => {
  return loadFromStorage<string | null>(STORAGE_KEYS.AUTH_TOKEN, null);
};

export const removeAuthToken = (): void => {
  removeFromStorage(STORAGE_KEYS.AUTH_TOKEN);
};
