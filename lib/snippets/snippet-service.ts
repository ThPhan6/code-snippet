// Snippet CRUD service functions

import { Snippet, User } from "../data/types";
import { loadSnippets, saveSnippets, getUserById } from "../data/storage";
import { getCurrentUser } from "../auth/auth-service";

/**
 * Create a new snippet
 */
export const createSnippet = (
  title: string,
  description: string,
  code: string,
  language: string,
  tags: string[] = [],
  isPublic: boolean = true,
  timeComplexity?: string
): { success: boolean; snippet?: Snippet; error?: string } => {
  try {
    // Get current user
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return { success: false, error: "User must be authenticated" };
    }

    // Generate new snippet ID
    const snippets = loadSnippets();
    const newId = (snippets.length + 1).toString();

    // Create new snippet
    const newSnippet: Snippet = {
      id: newId,
      title,
      description,
      code,
      language,
      authorId: currentUser.id,
      tags,
      isPublic,
      timeComplexity,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save to storage
    snippets.push(newSnippet);
    saveSnippets(snippets);

    return { success: true, snippet: newSnippet };
  } catch (error) {
    console.error("Error creating snippet:", error);
    return { success: false, error: "Failed to create snippet" };
  }
};

/**
 * Get snippet by ID
 */
export const getSnippetById = (snippetId: string): Snippet | undefined => {
  const snippets = loadSnippets();
  return snippets.find((snippet) => snippet.id === snippetId);
};

/**
 * Get all snippets (optionally filter by author or public only)
 */
export const getSnippets = (options?: {
  authorId?: string;
  publicOnly?: boolean;
  language?: string;
  searchQuery?: string;
}): Snippet[] => {
  let snippets = loadSnippets();

  // Filter by public only
  if (options?.publicOnly) {
    snippets = snippets.filter((snippet) => snippet.isPublic);
  }

  // Filter by author
  if (options?.authorId) {
    snippets = snippets.filter(
      (snippet) => snippet.authorId === options.authorId
    );
  }

  // Filter by language
  if (options?.language) {
    snippets = snippets.filter(
      (snippet) => snippet.language === options.language
    );
  }

  // Filter by search query
  if (options?.searchQuery) {
    const query = options.searchQuery.toLowerCase();
    snippets = snippets.filter(
      (snippet) =>
        snippet.title.toLowerCase().includes(query) ||
        snippet.description.toLowerCase().includes(query) ||
        snippet.code.toLowerCase().includes(query)
    );
  }

  // Sort by most recent first
  snippets.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return snippets;
};

/**
 * Update an existing snippet
 */
export const updateSnippet = (
  snippetId: string,
  updates: Partial<Omit<Snippet, "id" | "authorId" | "createdAt">>
): { success: boolean; snippet?: Snippet; error?: string } => {
  try {
    // Get current user
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return { success: false, error: "User must be authenticated" };
    }

    // Find snippet
    const snippets = loadSnippets();
    const snippetIndex = snippets.findIndex((s) => s.id === snippetId);

    if (snippetIndex === -1) {
      return { success: false, error: "Snippet not found" };
    }

    // Check ownership
    if (snippets[snippetIndex].authorId !== currentUser.id) {
      return { success: false, error: "You can only edit your own snippets" };
    }

    // Update snippet
    const updatedSnippet: Snippet = {
      ...snippets[snippetIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    snippets[snippetIndex] = updatedSnippet;
    saveSnippets(snippets);

    return { success: true, snippet: updatedSnippet };
  } catch (error) {
    console.error("Error updating snippet:", error);
    return { success: false, error: "Failed to update snippet" };
  }
};

/**
 * Delete a snippet
 */
export const deleteSnippet = (
  snippetId: string
): { success: boolean; error?: string } => {
  try {
    // Get current user
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return { success: false, error: "User must be authenticated" };
    }

    // Find snippet
    const snippets = loadSnippets();
    const snippetIndex = snippets.findIndex((s) => s.id === snippetId);

    if (snippetIndex === -1) {
      return { success: false, error: "Snippet not found" };
    }

    // Check ownership
    if (snippets[snippetIndex].authorId !== currentUser.id) {
      return { success: false, error: "You can only delete your own snippets" };
    }

    // Delete snippet
    snippets.splice(snippetIndex, 1);
    saveSnippets(snippets);

    return { success: true };
  } catch (error) {
    console.error("Error deleting snippet:", error);
    return { success: false, error: "Failed to delete snippet" };
  }
};

/**
 * Get snippets with author information
 */
export const getSnippetsWithAuthors = (options?: {
  authorId?: string;
  publicOnly?: boolean;
  language?: string;
  searchQuery?: string;
}): Array<Snippet & { author: User }> => {
  const snippets = getSnippets(options);

  return snippets
    .map((snippet) => {
      const author = getUserById(snippet.authorId);
      if (!author) return null;

      // Remove password from author object
      const { password, ...authorWithoutPassword } = author;

      return {
        ...snippet,
        author: authorWithoutPassword as User,
      };
    })
    .filter((item): item is Snippet & { author: User } => item !== null);
};

/**
 * Get user's snippets count
 */
export const getUserSnippetsCount = (userId: string): number => {
  const snippets = loadSnippets();
  return snippets.filter((snippet) => snippet.authorId === userId).length;
};

/**
 * Get unique languages used by a user
 */
export const getUserLanguages = (userId: string): string[] => {
  const snippets = getSnippets({ authorId: userId });
  const languages = new Set(snippets.map((s) => s.language));
  return Array.from(languages);
};

/**
 * Get all unique languages with snippet counts
 */
export const getAllLanguages = (): Array<{
  language: string;
  count: number;
}> => {
  const snippets = loadSnippets().filter((s) => s.isPublic);
  const languageCounts = new Map<string, number>();

  snippets.forEach((snippet) => {
    const current = languageCounts.get(snippet.language) || 0;
    languageCounts.set(snippet.language, current + 1);
  });

  return Array.from(languageCounts.entries())
    .map(([language, count]) => ({ language, count }))
    .sort((a, b) => b.count - a.count);
};

/**
 * Get user public profile data
 */
export const getUserPublicProfile = (username: string) => {
  // Only run on client side
  if (typeof window === "undefined") return null;

  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find((u: User) => u.username === username);
  if (!user) return null;

  const publicSnippets = getSnippets({
    authorId: user.id,
    publicOnly: true,
  });

  const languages = new Set(publicSnippets.map((s) => s.language));

  return {
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      createdAt: user.createdAt,
    },
    snippets: publicSnippets,
    stats: {
      totalSnippets: publicSnippets.length,
      languages: Array.from(languages),
      languageCount: languages.size,
    },
  };
};
