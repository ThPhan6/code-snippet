"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { FiArrowLeft, FiGrid, FiList } from "react-icons/fi";
import { getSnippetsWithAuthors } from "@/lib/snippets/snippet-service";
import { Snippet, User } from "@/lib/data/types";
import {
  formatRelativeTime,
  getSnippetShareUrl,
  createSlug,
} from "@/lib/utils/helpers";
import LanguageBadge from "@/components/ui/LanguageBadge";
import ShareButton from "@/components/ui/ShareButton";

type SnippetWithAuthor = Snippet & { author: User };

export default function LanguagePage() {
  const params = useParams();
  const languageSlug = params.language as string;

  // Convert slug back to language name (e.g., "java-script" -> "JavaScript")
  const language = languageSlug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");

  const [snippets, setSnippets] = useState<SnippetWithAuthor[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load snippets for this language
    const loadedSnippets = getSnippetsWithAuthors({
      publicOnly: true,
      language: language,
    });

    // Sort snippets
    const sortedSnippets = [...loadedSnippets].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

    setSnippets(sortedSnippets);
    setLoading(false);
  }, [language, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading snippets...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>
          {language} Code Snippets - Browse {snippets.length} {language}{" "}
          Examples
        </title>
        <meta
          name="description"
          content={`Browse ${snippets.length} ${language} code snippets shared by developers. Learn, share, and discover ${language} programming examples.`}
        />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${language} Code Snippets`} />
        <meta
          property="og:description"
          content={`Browse ${snippets.length} ${language} code snippets`}
        />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={`${language} Code Snippets`} />
        <meta
          name="twitter:description"
          content={`Browse ${snippets.length} ${language} examples`}
        />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
            >
              <FiArrowLeft />
              Back
            </Link>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold text-gray-900">
                    {language}
                  </h1>
                  <LanguageBadge language={language} size="lg" />
                </div>
                <p className="text-lg text-gray-600">
                  {snippets.length}{" "}
                  {snippets.length === 1 ? "snippet" : "snippets"} available
                </p>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4">
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as "newest" | "oldest")
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>

                {/* View Mode */}
                <div className="flex items-center gap-1 bg-white border border-gray-300 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded ${
                      viewMode === "grid"
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    title="Grid view"
                  >
                    <FiGrid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded ${
                      viewMode === "list"
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    title="List view"
                  >
                    <FiList size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Snippets */}
          {snippets.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600 mb-4">
                No public {language} snippets yet
              </p>
              <p className="text-gray-500">
                Be the first to share a {language} snippet!
              </p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {snippets.map((snippet) => (
                <SnippetCard key={snippet.id} snippet={snippet} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {snippets.map((snippet) => (
                <SnippetListItem key={snippet.id} snippet={snippet} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Grid Card Component
function SnippetCard({ snippet }: { snippet: SnippetWithAuthor }) {
  const shareUrl = getSnippetShareUrl(snippet.id, snippet.title);

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="p-6">
        <Link
          href={`/snippets/${snippet.id}/${createSlug(snippet.title)}`}
          className="block group"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
            {snippet.title}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {snippet.description}
          </p>
        </Link>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <Link
            href={`/profile/${snippet.author.username}`}
            className="hover:text-blue-600 transition-colors"
          >
            @{snippet.author.username}
          </Link>
          <span>{formatRelativeTime(snippet.createdAt)}</span>
        </div>

        <div className="flex items-center justify-between">
          <Link
            href={`/snippets/${snippet.id}/${createSlug(snippet.title)}`}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View Code →
          </Link>
          <ShareButton url={shareUrl} variant="icon" />
        </div>
      </div>
    </div>
  );
}

// List Item Component
function SnippetListItem({ snippet }: { snippet: SnippetWithAuthor }) {
  const shareUrl = getSnippetShareUrl(snippet.id, snippet.title);

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <Link
              href={`/snippets/${snippet.id}/${createSlug(snippet.title)}`}
              className="block group"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {snippet.title}
              </h3>
              <p className="text-gray-600 mb-3">{snippet.description}</p>
            </Link>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <Link
                href={`/profile/${snippet.author.username}`}
                className="hover:text-blue-600 transition-colors"
              >
                @{snippet.author.username}
              </Link>
              <span>•</span>
              <span>{formatRelativeTime(snippet.createdAt)}</span>
              {snippet.timeComplexity && (
                <>
                  <span>•</span>
                  <span className="text-purple-600 font-medium">
                    {snippet.timeComplexity}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/snippets/${snippet.id}/${createSlug(snippet.title)}`}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              View Code
            </Link>
            <ShareButton url={shareUrl} variant="icon" />
          </div>
        </div>
      </div>
    </div>
  );
}
