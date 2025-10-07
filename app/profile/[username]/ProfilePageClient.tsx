"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FiArrowLeft,
  FiGrid,
  FiList,
  FiCalendar,
  FiCode,
} from "react-icons/fi";
import { Snippet } from "@/lib/data/types";
import {
  formatDate,
  formatRelativeTime,
  getSnippetShareUrl,
  getProfileUrl,
  getFullUrl,
  createSlug,
} from "@/lib/utils/helpers";
import LanguageBadge from "@/components/ui/LanguageBadge";
import ShareButton from "@/components/ui/ShareButton";

interface UserProfile {
  user: {
    id: string;
    name: string;
    username: string;
    createdAt: string;
  };
  snippets: Snippet[];
  stats: {
    totalSnippets: number;
    languageCount: number;
    languages: string[];
    mostUsedLanguage: string;
    joinDate: string;
  };
}

interface ProfilePageClientProps {
  profile: UserProfile;
}

export default function ProfilePageClient({ profile }: ProfilePageClientProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");

  const sortedSnippets = [...profile.snippets].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
  });

  const handleShareProfile = async () => {
    const url = getFullUrl(getProfileUrl(profile.user.username));
    try {
      await navigator.clipboard.writeText(url);
      // You could add a toast notification here
    } catch (error) {
      console.error("Failed to copy URL:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FiArrowLeft className="w-5 h-5 mr-2" />
                Back to Dashboard
              </Link>
            </div>
            <ShareButton
              url={getFullUrl(getProfileUrl(profile.user.username))}
              title={`@${profile.user.username} - ${profile.user.name}`}
              onCopy={handleShareProfile}
            />
          </div>

          {/* Profile Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {profile.user.name}
              </h1>
              <p className="text-xl text-gray-600 mb-4">
                @{profile.user.username}
              </p>
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <FiCalendar className="w-4 h-4 mr-2" />
                  Joined {formatDate(profile.user.createdAt)}
                </div>
                <div className="flex items-center">
                  <FiCode className="w-4 h-4 mr-2" />
                  {profile.stats.totalSnippets} snippets
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900">
                {profile.stats.totalSnippets}
              </div>
              <div className="text-sm text-gray-600">Total Snippets</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900">
                {profile.stats.languageCount}
              </div>
              <div className="text-sm text-gray-600">Languages</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900">
                {profile.stats.mostUsedLanguage}
              </div>
              <div className="text-sm text-gray-600">Most Used</div>
            </div>
          </div>

          {/* Languages */}
          {profile.stats.languages.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Languages Used
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.stats.languages.map((language) => (
                  <LanguageBadge key={language} language={language} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "newest" | "oldest")
                }
                className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">View:</span>
            <div className="flex items-center border border-gray-300 rounded-md">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${
                  viewMode === "grid"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <FiGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${
                  viewMode === "list"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <FiList className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Snippets */}
      <div className="max-w-6xl mx-auto px-4 pb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Public Snippets ({profile.snippets.length})
          </h2>
        </div>

        {sortedSnippets.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <div className="text-gray-400 mb-4">
              <FiCode className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No public snippets yet
            </h3>
            <p className="text-gray-600">
              This user hasn&apos;t shared any public code snippets.
            </p>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {sortedSnippets.map((snippet) => (
              <div
                key={snippet.id}
                className={`bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow ${
                  viewMode === "list" ? "p-6" : "p-6"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <Link
                      href={`/snippets/${snippet.id}/${createSlug(
                        snippet.title
                      )}`}
                      className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2"
                    >
                      {snippet.title}
                    </Link>
                    {snippet.description && (
                      <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                        {snippet.description}
                      </p>
                    )}
                  </div>
                  <ShareButton
                    url={getSnippetShareUrl(snippet.id, snippet.title)}
                    title={snippet.title}
                  />
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-3">
                    <span>{formatRelativeTime(snippet.createdAt)}</span>
                  </div>
                  <LanguageBadge language={snippet.language} />
                </div>

                {viewMode === "list" && (
                  <div className="mt-4 bg-gray-50 rounded-md p-3">
                    <pre className="text-sm text-gray-800 overflow-x-auto">
                      <code>
                        {snippet.code.substring(0, 200)}
                        {snippet.code.length > 200 ? "..." : ""}
                      </code>
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
