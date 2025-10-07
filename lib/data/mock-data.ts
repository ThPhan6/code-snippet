// Mock data for development and initial seeding

import { User, Snippet, Tag } from "./types";

export const mockUsers: User[] = [
  {
    id: "1",
    email: "demo@example.com",
    name: "Demo User",
    username: "demo",
    password: "demo123", // In real app, this would be hashed
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    email: "john@example.com",
    name: "John Doe",
    username: "johndoe",
    password: "password123",
    createdAt: "2024-01-15T00:00:00.000Z",
    updatedAt: "2024-01-15T00:00:00.000Z",
  },
  {
    id: "3",
    email: "sarah@example.com",
    name: "Sarah Smith",
    username: "sarahsmith",
    password: "password123",
    createdAt: "2024-02-01T00:00:00.000Z",
    updatedAt: "2024-02-01T00:00:00.000Z",
  },
];

export const mockTags: Tag[] = [
  // Programming Languages
  {
    id: "1",
    name: "JavaScript",
    slug: "javascript",
    type: "language",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    name: "TypeScript",
    slug: "typescript",
    type: "language",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "3",
    name: "Python",
    slug: "python",
    type: "language",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "4",
    name: "Java",
    slug: "java",
    type: "language",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "5",
    name: "C++",
    slug: "cpp",
    type: "language",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "6",
    name: "Go",
    slug: "go",
    type: "language",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "7",
    name: "Rust",
    slug: "rust",
    type: "language",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "8",
    name: "PHP",
    slug: "php",
    type: "language",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "9",
    name: "Ruby",
    slug: "ruby",
    type: "language",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "10",
    name: "Swift",
    slug: "swift",
    type: "language",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },

  // Topics
  {
    id: "11",
    name: "Algorithm",
    slug: "algorithm",
    type: "topic",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "12",
    name: "Data Structure",
    slug: "data-structure",
    type: "topic",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "13",
    name: "Sorting",
    slug: "sorting",
    type: "topic",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "14",
    name: "Searching",
    slug: "searching",
    type: "topic",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "15",
    name: "API",
    slug: "api",
    type: "topic",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "16",
    name: "React",
    slug: "react",
    type: "topic",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "17",
    name: "Database",
    slug: "database",
    type: "topic",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "18",
    name: "Authentication",
    slug: "authentication",
    type: "topic",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "19",
    name: "Utility",
    slug: "utility",
    type: "topic",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "20",
    name: "Performance",
    slug: "performance",
    type: "topic",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
];

export const mockSnippets: Snippet[] = [
  {
    id: "1",
    title: "Quick Sort Algorithm",
    description:
      "Efficient sorting algorithm using divide and conquer approach",
    code: `function quickSort(arr) {
  if (arr.length <= 1) return arr;
  
  const pivot = arr[arr.length - 1];
  const left = [];
  const right = [];
  
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }
  
  return [...quickSort(left), pivot, ...quickSort(right)];
}

// Example usage
const numbers = [64, 34, 25, 12, 22, 11, 90];
console.log(quickSort(numbers)); // [11, 12, 22, 25, 34, 64, 90]`,
    language: "javascript",
    authorId: "1",
    isPublic: true,
    timeComplexity: "O(n log n)",
    tags: ["1", "11", "13"], // JavaScript, Algorithm, Sorting
    createdAt: "2024-03-01T10:00:00.000Z",
    updatedAt: "2024-03-01T10:00:00.000Z",
  },
  {
    id: "2",
    title: "Binary Search Implementation",
    description: "Efficient search algorithm for sorted arrays",
    code: `def binary_search(arr, target):
    """
    Binary search implementation in Python
    Time complexity: O(log n)
    """
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1

# Example usage
numbers = [1, 3, 5, 7, 9, 11, 13, 15]
result = binary_search(numbers, 7)
print(f"Found at index: {result}")  # Found at index: 3`,
    language: "python",
    authorId: "2",
    isPublic: true,
    timeComplexity: "O(log n)",
    tags: ["3", "11", "14"], // Python, Algorithm, Searching
    createdAt: "2024-03-05T14:30:00.000Z",
    updatedAt: "2024-03-05T14:30:00.000Z",
  },
  {
    id: "3",
    title: "React Custom Hook - useFetch",
    description:
      "Custom React hook for data fetching with loading and error states",
    code: `import { useState, useEffect } from 'react';

export const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

// Usage example
function UserProfile({ userId }) {
  const { data, loading, error } = useFetch(\`/api/users/\${userId}\`);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <div>{data.name}</div>;
}`,
    language: "typescript",
    authorId: "1",
    isPublic: true,
    tags: ["2", "16", "15"], // TypeScript, React, API
    createdAt: "2024-03-10T09:15:00.000Z",
    updatedAt: "2024-03-10T09:15:00.000Z",
  },
  {
    id: "4",
    title: "Debounce Function",
    description:
      "Utility function to limit the rate at which a function is executed",
    code: `function debounce(func, delay) {
  let timeoutId;
  
  return function (...args) {
    clearTimeout(timeoutId);
    
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// Usage example
const handleSearch = debounce((searchTerm) => {
  console.log('Searching for:', searchTerm);
  // Perform search API call
}, 300);

// This will only execute once after 300ms of no calls
handleSearch('hello');
handleSearch('hello world');
handleSearch('hello world!'); // Only this will execute`,
    language: "javascript",
    authorId: "3",
    isPublic: true,
    timeComplexity: "O(1)",
    tags: ["1", "19", "20"], // JavaScript, Utility, Performance
    createdAt: "2024-03-12T16:45:00.000Z",
    updatedAt: "2024-03-12T16:45:00.000Z",
  },
  {
    id: "5",
    title: "JWT Token Verification",
    description: "Simple JWT token verification middleware for authentication",
    code: `import jwt from 'jsonwebtoken';

export const verifyToken = (token: string): boolean => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return !!decoded;
  } catch (error) {
    return false;
  }
};

export const getTokenPayload = (token: string) => {
  try {
    return jwt.decode(token);
  } catch {
    return null;
  }
};

// Middleware example
export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  if (!verifyToken(token)) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  
  next();
};`,
    language: "typescript",
    authorId: "2",
    isPublic: true,
    tags: ["2", "18", "15"], // TypeScript, Authentication, API
    createdAt: "2024-03-15T11:20:00.000Z",
    updatedAt: "2024-03-15T11:20:00.000Z",
  },
];

/**
 * Initialize localStorage with mock data if empty
 */
export const initializeMockData = (): void => {
  if (typeof window === "undefined") return;

  // Check if data already exists
  const existingUsers = localStorage.getItem("users");
  const existingSnippets = localStorage.getItem("snippets");
  const existingTags = localStorage.getItem("tags");

  // Only initialize if data doesn't exist
  if (!existingUsers) {
    // Split users into profiles (safe) and credentials (sensitive)
    const profiles = mockUsers.map((u) => ({
      id: u.id,
      name: u.name,
      username: u.username,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    }));

    const credentials = mockUsers.map((u) => ({
      userId: u.id,
      email: u.email,
      password: u.password,
    }));

    // Store separately for security
    localStorage.setItem("users", JSON.stringify(profiles));
    localStorage.setItem("authCredentials", JSON.stringify(credentials));
  }
  if (!existingSnippets) {
    localStorage.setItem("snippets", JSON.stringify(mockSnippets));
  }
  if (!existingTags) {
    localStorage.setItem("tags", JSON.stringify(mockTags));
  }
};
