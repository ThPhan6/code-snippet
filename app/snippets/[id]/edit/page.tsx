// Edit snippet page

"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { SnippetForm } from "../../../../components/snippets/SnippetForm";
import {
  getSnippetById,
  updateSnippet,
} from "../../../../lib/snippets/snippet-service";
import { SnippetInput } from "../../../../lib/validations/schemas";
import { ProtectedRoute } from "../../../../lib/auth/protected-route";
import { useAuth } from "../../../../lib/auth/auth-context";
import { Snippet } from "../../../../lib/data/types";

function EditSnippetContent() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const snippetId = params.id as string;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load snippet data
    const loadSnippet = () => {
      const snippetData = getSnippetById(snippetId);

      if (!snippetData) {
        setError("Snippet not found");
        setLoading(false);
        return;
      }

      // Check if user owns this snippet
      if (user && snippetData.authorId !== user.id) {
        setError("You don't have permission to edit this snippet");
        setLoading(false);
        return;
      }

      setSnippet(snippetData);
      setLoading(false);
    };

    if (user) {
      loadSnippet();
    }
  }, [snippetId, user]);

  const handleSubmit = async (data: SnippetInput) => {
    try {
      setIsLoading(true);
      setError(null);

      const result = updateSnippet(snippetId, {
        title: data.title,
        description: data.description,
        code: data.code,
        language: data.language,
        tags: data.tags,
        isPublic: data.isPublic,
        timeComplexity: data.timeComplexity,
      });

      if (result.success) {
        // Show success message and redirect to dashboard
        alert("✅ Snippet updated successfully!");
        router.push("/dashboard");
      } else {
        setError(result.error || "Failed to update snippet");
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && !snippet) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
          <button
            onClick={() => router.push("/dashboard")}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Snippet</h1>
          <p className="mt-2 text-sm text-gray-600">Update your code snippet</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {snippet && (
          <div className="bg-white shadow rounded-lg p-6">
            <SnippetForm
              initialData={{
                title: snippet.title,
                description: snippet.description,
                code: snippet.code,
                language: snippet.language,
                tags: snippet.tags,
                isPublic: snippet.isPublic,
                timeComplexity: snippet.timeComplexity,
              }}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function EditSnippetPage() {
  return (
    <ProtectedRoute>
      <EditSnippetContent />
    </ProtectedRoute>
  );
}
