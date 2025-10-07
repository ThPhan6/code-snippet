/**
 * Basic Algorithm Complexity Analyzer
 * Analyzes code patterns to estimate time complexity
 */

export interface ComplexityAnalysis {
  estimatedComplexity: string;
  confidence: number; // 0-1
  reasoning: string[];
  patterns: string[];
}

export const analyzeComplexity = (
  code: string,
  language: string
): ComplexityAnalysis => {
  const patterns = detectPatterns(code, language);
  const complexity = estimateComplexity(patterns);

  return {
    estimatedComplexity: complexity.complexity,
    confidence: complexity.confidence,
    reasoning: complexity.reasoning,
    patterns: patterns.map((p) => p.name),
  };
};

interface Pattern {
  name: string;
  type: "loop" | "recursion" | "data-structure" | "algorithm";
  complexity: string;
  confidence: number;
}

function detectPatterns(code: string, language: string): Pattern[] {
  const patterns: Pattern[] = [];
  const codeLines = code.split("\n");

  // Remove comments and empty lines
  const cleanLines = codeLines
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("//") && !line.startsWith("#"))
    .join("\n");

  // Loop patterns - improved detection
  const loopMatches = cleanLines.match(/for\s*\(|while\s*\(/g) || [];
  const loopCount = loopMatches.length;

  // Count nested levels by analyzing indentation and structure
  let maxNestingLevel = 0;
  const lines = cleanLines.split("\n");
  let currentNesting = 0;

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.match(/for\s*\(|while\s*\(/)) {
      currentNesting++;
      maxNestingLevel = Math.max(maxNestingLevel, currentNesting);
    }
    if (trimmedLine.includes("}")) {
      currentNesting = Math.max(0, currentNesting - 1);
    }
  }

  if (loopCount === 0) {
    // No loops detected
  } else if (maxNestingLevel >= 4) {
    patterns.push({
      name: `${maxNestingLevel}-Level Nested Loops`,
      type: "loop",
      complexity: `O(n^${maxNestingLevel})`,
      confidence: 0.95,
    });
  } else if (maxNestingLevel === 3) {
    patterns.push({
      name: "Triple Nested Loops",
      type: "loop",
      complexity: "O(n³)",
      confidence: 0.95,
    });
  } else if (maxNestingLevel === 2) {
    patterns.push({
      name: "Nested Loops",
      type: "loop",
      complexity: "O(n²)",
      confidence: 0.9,
    });
  } else if (loopCount === 1) {
    patterns.push({
      name: "Single Loop",
      type: "loop",
      complexity: "O(n)",
      confidence: 0.8,
    });
  } else if (loopCount > 1) {
    patterns.push({
      name: "Multiple Loops",
      type: "loop",
      complexity: "O(n²)",
      confidence: 0.8,
    });
  }

  // Recursion patterns
  if (cleanLines.includes("function") && cleanLines.includes("return")) {
    const functionCalls = (cleanLines.match(/function\s+\w+/g) || []).length;
    if (functionCalls > 0) {
      patterns.push({
        name: "Recursive Function",
        type: "recursion",
        complexity: "O(n)",
        confidence: 0.6,
      });
    }
  }

  // Data structure patterns
  if (cleanLines.includes("sort(") || cleanLines.includes(".sort()")) {
    patterns.push({
      name: "Sorting",
      type: "algorithm",
      complexity: "O(n log n)",
      confidence: 0.9,
    });
  }

  if (cleanLines.includes("binary") || cleanLines.includes("Binary")) {
    patterns.push({
      name: "Binary Search",
      type: "algorithm",
      complexity: "O(log n)",
      confidence: 0.8,
    });
  }

  if (cleanLines.includes("map(") || cleanLines.includes(".map(")) {
    patterns.push({
      name: "Array Map",
      type: "loop",
      complexity: "O(n)",
      confidence: 0.8,
    });
  }

  if (cleanLines.includes("filter(") || cleanLines.includes(".filter(")) {
    patterns.push({
      name: "Array Filter",
      type: "loop",
      complexity: "O(n)",
      confidence: 0.8,
    });
  }

  if (cleanLines.includes("reduce(") || cleanLines.includes(".reduce(")) {
    patterns.push({
      name: "Array Reduce",
      type: "loop",
      complexity: "O(n)",
      confidence: 0.8,
    });
  }

  // Hash table patterns
  if (
    cleanLines.includes("Map") ||
    cleanLines.includes("Set") ||
    cleanLines.includes("HashMap")
  ) {
    patterns.push({
      name: "Hash Table",
      type: "data-structure",
      complexity: "O(1)",
      confidence: 0.7,
    });
  }

  // Tree patterns
  if (
    cleanLines.includes("tree") ||
    cleanLines.includes("Tree") ||
    cleanLines.includes("node")
  ) {
    patterns.push({
      name: "Tree Traversal",
      type: "algorithm",
      complexity: "O(n)",
      confidence: 0.6,
    });
  }

  return patterns;
}

// Helper function to get the power of a complexity notation
function getComplexityPower(complexity: string): number {
  if (complexity === "O(1)") return 0;
  if (complexity === "O(log n)") return 0.5;
  if (complexity === "O(n)") return 1;
  if (complexity === "O(n log n)") return 1.5;

  // Handle O(n^k) patterns
  const match = complexity.match(/^O\(n\^?(\d+)\)$/);
  if (match) {
    return parseInt(match[1]);
  }

  // Handle O(n²) and O(n³) with special characters
  if (complexity === "O(n²)") return 2;
  if (complexity === "O(n³)") return 3;

  return 0; // Unknown complexity
}

function estimateComplexity(patterns: Pattern[]): {
  complexity: string;
  confidence: number;
  reasoning: string[];
} {
  if (patterns.length === 0) {
    return {
      complexity: "O(1)",
      confidence: 0.3,
      reasoning: ["No complex patterns detected"],
    };
  }

  // Sort patterns by confidence
  const sortedPatterns = patterns.sort((a, b) => b.confidence - a.confidence);
  const reasoning: string[] = [];

  // Find the most complex pattern
  let maxComplexity = "O(1)";
  let maxConfidence = 0;

  for (const pattern of sortedPatterns) {
    reasoning.push(`Detected ${pattern.name} (${pattern.complexity})`);

    // Simple complexity comparison with proper hierarchy
    const currentComplexity = pattern.complexity;
    const currentPower = getComplexityPower(currentComplexity);
    const maxPower = getComplexityPower(maxComplexity);

    if (currentPower > maxPower) {
      maxComplexity = currentComplexity;
      maxConfidence = pattern.confidence;
    }
  }

  return {
    complexity: maxComplexity,
    confidence: maxConfidence,
    reasoning,
  };
}

// Helper function to get complexity color
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

// Helper function to get complexity description
export const getComplexityDescription = (complexity: string): string => {
  // Handle dynamic O(n^k) patterns
  if (complexity.match(/^O\(n\^?\d+\)$/)) {
    const match = complexity.match(/^O\(n\^?(\d+)\)$/);
    if (match) {
      const power = parseInt(match[1]);
      if (power === 1) return "Linear time - good performance";
      if (power === 2) return "Quadratic time - consider optimization";
      if (power === 3) return "Cubic time - needs optimization";
      if (power >= 4)
        return `O(n^${power}) time - requires significant optimization`;
    }
  }

  // Handle specific cases
  switch (complexity) {
    case "O(1)":
      return "Constant time - excellent performance";
    case "O(log n)":
      return "Logarithmic time - very good performance";
    case "O(n)":
      return "Linear time - good performance";
    case "O(n log n)":
      return "Linearithmic time - acceptable performance";
    case "O(n²)":
    case "O(n^2)":
      return "Quadratic time - consider optimization";
    case "O(n³)":
    case "O(n^3)":
      return "Cubic time - needs optimization";
    default:
      return "Unknown complexity";
  }
};
