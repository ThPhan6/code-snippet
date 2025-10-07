"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import {
  FiArrowLeft,
  FiEdit,
  FiTrash2,
  FiUser,
  FiCalendar,
  FiClock,
} from "react-icons/fi";
import { getSnippetById } from "@/lib/snippets/snippet-service";
import { getUserById } from "@/lib/data/storage";
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
// import { useI18n } from "@/lib/i18n/context";

export default function SnippetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const snippetId = params.id as string;

  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [author, setAuthor] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<Omit<User, "password"> | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    console.log("Loading snippet with ID:", snippetId);
    // Load snippet and author
    const loadedSnippet = getSnippetById(snippetId);
    console.log("Loaded snippet:", loadedSnippet);
    if (loadedSnippet) {
      setSnippet(loadedSnippet);
      const loadedAuthor = getUserById(loadedSnippet.authorId);
      console.log("Loaded author:", loadedAuthor);
      setAuthor(loadedAuthor || null);
    }

    // Check current user
    const user = getCurrentUser();
    setCurrentUser(user);

    setLoading(false);
  }, [snippetId]);

  const handleCopyCode = async () => {
    if (!snippet) return;
    try {
      await navigator.clipboard.writeText(snippet.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  };

  const handleDelete = () => {
    if (!snippet) return;
    const result = deleteSnippet(snippet.id);
    if (result.success) {
      router.push("/dashboard");
    } else {
      alert(result.error || "Failed to delete snippet");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading snippet...</p>
        </div>
      </div>
    );
  }

  if (!snippet) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-8">Snippet not found</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <FiArrowLeft />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Check if user can edit/delete (owner or not public)
  const isOwner = currentUser?.id === snippet.authorId;
  const canView = snippet.isPublic || isOwner;

  if (!canView) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Private Snippet
          </h1>
          <p className="text-xl text-gray-600 mb-8">This snippet is private</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <FiArrowLeft />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const shareUrl = getSnippetShareUrl(snippet.id, snippet.title);
  const fullShareUrl = getFullUrl(shareUrl);

  return (
    <>
      <Head>
        <title>
          {snippet.title} by @{author?.username} - Code Snippets
        </title>
        <meta
          name="description"
          content={snippet.description.substring(0, 160)}
        />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta
          property="og:title"
          content={`${snippet.title} by @${author?.username}`}
        />
        <meta property="og:description" content={snippet.description} />
        <meta property="og:url" content={fullShareUrl} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`${snippet.title} by @${author?.username}`}
        />
        <meta name="twitter:description" content={snippet.description} />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-6">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <FiArrowLeft />
              Back
            </Link>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Title Section */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {snippet.title}
                  </h1>
                  <p className="text-gray-600 mb-4">{snippet.description}</p>

                  {/* Topic Tags */}
                  {snippet.tags && snippet.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {snippet.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <ShareButton url={shareUrl} variant="default" title="Share" />
                </div>
              </div>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <LanguageBadge language={snippet.language} clickable />
                </div>
                {author && (
                  <Link
                    href={getProfileUrl(author.username)}
                    className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                  >
                    <FiUser size={16} />
                    <span>@{author.username}</span>
                  </Link>
                )}
                <div
                  className="flex items-center gap-2"
                  title={formatDate(snippet.createdAt)}
                >
                  <FiCalendar size={16} />
                  <span>{formatDate(snippet.createdAt)}</span>
                </div>
                <div
                  className="flex items-center gap-2"
                  title={snippet.updatedAt}
                >
                  <FiClock size={16} />
                  <span>{formatRelativeTime(snippet.updatedAt)}</span>
                </div>
                {snippet.timeComplexity && (
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getComplexityColor(
                      snippet.timeComplexity
                    )} bg-opacity-20`}
                  >
                    {snippet.timeComplexity}
                  </div>
                )}
                {!snippet.isPublic && (
                  <div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                    Private
                  </div>
                )}
              </div>
            </div>

            {/* Code Section */}
            <div className="relative">
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={handleCopyCode}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    copied
                      ? "bg-green-600 text-white"
                      : "bg-gray-800 text-white hover:bg-gray-700"
                  }`}
                >
                  {copied ? "Copied!" : "Copy Code"}
                </button>
              </div>
              <pre className="p-6 bg-gray-900 text-gray-100 overflow-x-auto">
                <code className="text-sm font-mono">{snippet.code}</code>
              </pre>
            </div>

            {/* Actions (if owner) */}
            {isOwner && (
              <div className="p-6 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <p className="text-sm text-gray-600">You own this snippet</p>
                <div className="flex items-center gap-3">
                  <Link
                    href={`/snippets/${snippet.id}/edit`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FiEdit size={16} />
                    Edit
                  </Link>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <FiTrash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Delete Snippet?
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete &quot;{snippet.title}&quot;? This action
                cannot be undone.
              </p>
              <div className="flex items-center gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
