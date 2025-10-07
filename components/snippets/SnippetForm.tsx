// Snippet form component for creating and editing snippets

"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SnippetInput } from "../../lib/validations/schemas";
import { ComplexityAnalyzer } from "../ui/ComplexityAnalyzer";
import { useI18n } from "../../lib/i18n/context";

interface SnippetFormData {
  title: string;
  description?: string;
  code: string;
  language: string;
  tags?: string[];
  isPublic: boolean;
  timeComplexity?: string;
}

interface SnippetFormProps {
  initialData?: Partial<SnippetFormData>;
  onSubmit: (data: SnippetInput) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

const COMMON_LANGUAGES = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C++",
  "C#",
  "Go",
  "Rust",
  "PHP",
  "Ruby",
  "Swift",
  "Kotlin",
  "SQL",
  "HTML",
  "CSS",
  "Bash",
  "Other",
];

const TOPIC_TAGS = [
  "API",
  "Database",
  "Algorithm",
  "Regex",
  "UI",
  "Authentication",
  "Validation",
  "Testing",
  "Performance",
  "Security",
  "Data Structure",
  "Sorting",
  "Search",
  "Graph",
  "Tree",
  "Array",
  "String",
  "Math",
  "Utility",
  "Helper",
];

export const SnippetForm: React.FC<SnippetFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const { t } = useI18n();
  const [selectedTags, setSelectedTags] = useState<string[]>(
    initialData?.tags || []
  );

  // Create validation schema
  const formSchema = z.object({
    title: z
      .string()
      .min(1, "Title is required")
      .min(3, "Title must be at least 3 characters")
      .max(100, "Title must be less than 100 characters"),
    description: z
      .string()
      .max(500, "Description must be less than 500 characters")
      .optional(),
    code: z.string().min(1, "Code is required").max(50000, "Code is too long"),
    language: z.string().min(1, "Programming language is required"),
    tags: z.array(z.string()).optional(),
    isPublic: z.boolean(),
    timeComplexity: z.string().optional(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SnippetFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      code: initialData?.code || "",
      language: initialData?.language || "",
      tags: initialData?.tags || [],
      isPublic:
        initialData?.isPublic !== undefined ? initialData.isPublic : true,
      timeComplexity: initialData?.timeComplexity || "",
    },
  });

  const code = watch("code");
  const language = watch("language");

  const handleFormSubmit = (data: SnippetFormData) => {
    // Convert to SnippetInput with proper defaults
    const snippetData: SnippetInput = {
      title: data.title,
      description: data.description || "",
      code: data.code,
      language: data.language,
      tags: selectedTags,
      isPublic: data.isPublic,
      timeComplexity: data.timeComplexity,
    };
    onSubmit(snippetData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Title */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title *
        </label>
        <input
          {...register("title")}
          type="text"
          id="title"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
          placeholder="E.g., Binary Search Implementation"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description (Optional)
        </label>
        <textarea
          {...register("description")}
          id="description"
          rows={3}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
          placeholder="Describe what this code does..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Language Selector */}
      <div>
        <label
          htmlFor="language"
          className="block text-sm font-medium text-gray-700"
        >
          Programming Language *
        </label>
        <select
          {...register("language")}
          id="language"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
        >
          <option value="">Select a language</option>
          {COMMON_LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
        {errors.language && (
          <p className="mt-1 text-sm text-red-600">{errors.language.message}</p>
        )}
      </div>

      {/* Code Editor */}
      <div>
        <label
          htmlFor="code"
          className="block text-sm font-medium text-gray-700"
        >
          Code *
        </label>
        <textarea
          {...register("code")}
          id="code"
          rows={15}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono text-sm text-black"
          placeholder="Paste your code here..."
          style={{ fontFamily: "monospace" }}
        />
        <p className="mt-1 text-sm text-gray-500">
          {code?.length || 0} characters
        </p>
        {errors.code && (
          <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>
        )}
      </div>

      {/* Topic Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("snippets.topicTags")}
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {TOPIC_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => {
                if (selectedTags.includes(tag)) {
                  setSelectedTags(selectedTags.filter((t) => t !== tag));
                } else {
                  setSelectedTags([...selectedTags, tag]);
                }
              }}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedTags.includes(tag)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-500">
          {t("snippets.selectRelevantTopics")}
        </p>
      </div>

      {/* Algorithm Complexity Analyzer */}
      {code && language && (
        <ComplexityAnalyzer
          code={code}
          language={language}
          onAnalysisComplete={(complexity: string) => {
            // Auto-fill time complexity if not set
            if (!watch("timeComplexity")) {
              // This would need to be handled in the form
            }
          }}
        />
      )}

      {/* Time Complexity Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("snippets.timeComplexityOptional")}
        </label>
        <input
          {...register("timeComplexity")}
          type="text"
          placeholder={t("snippets.timeComplexityPlaceholder")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        />
        <p className="mt-1 text-sm text-gray-500">
          {t("snippets.useComplexityAnalyzer")}
        </p>
      </div>

      {/* Public/Private Toggle */}
      <div className="flex items-center">
        <input
          {...register("isPublic")}
          type="checkbox"
          id="isPublic"
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-900">
          Make this snippet public (visible to everyone)
        </label>
      </div>

      {/* Submit and Cancel Buttons */}
      <div className="flex items-center justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading
            ? "Saving..."
            : initialData
            ? "Update Snippet"
            : "Create Snippet"}
        </button>
      </div>
    </form>
  );
};
