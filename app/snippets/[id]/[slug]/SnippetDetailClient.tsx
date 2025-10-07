"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import {
  FiArrowLeft,
  FiEdit,
  FiTrash2,
  FiUser,
  FiCalendar,
  FiClock,
} from "react-icons/fi";
import { getCurrentUser } from "@/lib/auth/auth-service";
import { deleteSnippet } from "@/lib/snippets/snippet-service";
import { Snippet, User } from "@/lib/data/types";
import {
  formatDate,
  formatRelativeTime,
  getSnippetShareUrl,
  getProfileUrl,
  getFullUrl,
  getComplexityColor,
} from "@/lib/utils/helpers";
import ShareButton from "@/components/ui/ShareButton";
import LanguageBadge from "@/components/ui/LanguageBadge";

interface SnippetDetailClientProps {
  snippet: Snippet;
  author?: User | null;
}

export default function SnippetDetailClient({
  snippet,
  author,
}: SnippetDetailClientProps) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<Omit<User, "password"> | null>(
    null
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Load current user
  useState(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
  });

  const isOwner = currentUser?.id === snippet.authorId;
  const shareUrl = getSnippetShareUrl(snippet.id, snippet.title);
  const fullShareUrl = getFullUrl(shareUrl);
  const profileUrl = author ? getProfileUrl(author.username) : "#";

  const handleDelete = async () => {
    try {
      await deleteSnippet(snippet.id);
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to delete snippet:", error);
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(fullShareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy URL:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FiArrowLeft className="w-5 h-5 mr-2" />
                Back to Dashboard
              </Link>
            </div>

            {isOwner && (
              <div className="flex items-center space-x-2">
                <Link
                  href={`/snippets/${snippet.id}/edit`}
                  className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <FiEdit className="w-4 h-4 mr-1" />
                  Edit
                </Link>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                >
                  <FiTrash2 className="w-4 h-4 mr-1" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {/* Snippet Header */}
          <div className="p-6 border-b">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {snippet.title}
                </h1>
                {snippet.description && (
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {snippet.description}
                  </p>
                )}
              </div>
              <div className="ml-4">
                <ShareButton
                  url={fullShareUrl}
                  title={snippet.title}
                  onCopy={handleCopyUrl}
                />
              </div>
            </div>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center">
                <FiUser className="w-4 h-4 mr-1" />
                <Link
                  href={profileUrl}
                  className="hover:text-gray-700 transition-colors"
                >
                  {author ? `@${author.username}` : "Unknown Author"}
                </Link>
              </div>
              <div className="flex items-center">
                <FiCalendar className="w-4 h-4 mr-1" />
                {formatDate(snippet.createdAt)}
              </div>
              <div className="flex items-center">
                <FiClock className="w-4 h-4 mr-1" />
                {formatRelativeTime(snippet.createdAt)}
              </div>
              <LanguageBadge language={snippet.language} />
              {snippet.timeComplexity && (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getComplexityColor(
                    snippet.timeComplexity
                  )}`}
                >
                  {snippet.timeComplexity}
                </span>
              )}
            </div>
          </div>

          {/* Code Block */}
          <div className="p-6">
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                <span className="text-sm text-gray-300 font-medium">
                  {snippet.language}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(snippet.code);
                  }}
                  className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                  Copy Code
                </button>
              </div>
              <pre className="p-4 overflow-x-auto text-sm text-gray-100">
                <code>{snippet.code}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Delete Snippet?
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete &quot;{snippet.title}&quot;? This
              action cannot be undone.
            </p>
            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-md transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
