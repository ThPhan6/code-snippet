// Create new snippet page

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { SnippetForm } from "../../../components/snippets/SnippetForm";
import { createSnippet } from "../../../lib/snippets/snippet-service";
import { SnippetInput } from "../../../lib/validations/schemas";
import { ProtectedRoute } from "../../../lib/auth/protected-route";

function CreateSnippetContent() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: SnippetInput) => {
    try {
      setIsLoading(true);
      setError(null);

      const result = createSnippet(
        data.title,
        data.description,
        data.code,
        data.language,
        data.tags,
        data.isPublic,
        data.timeComplexity
      );

      if (result.success && result.snippet) {
        // Show success message and redirect to dashboard
        alert("✅ Snippet created successfully!");
        router.push("/dashboard");
      } else {
        setError(result.error || "Failed to create snippet");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Create New Snippet
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Share your code with the developer community
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-6">
          <SnippetForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}

export default function CreateSnippetPage() {
  return (
    <ProtectedRoute>
      <CreateSnippetContent />
    </ProtectedRoute>
  );
}
