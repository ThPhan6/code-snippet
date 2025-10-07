"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import {
  FiArrowLeft,
  FiGrid,
  FiList,
  FiCalendar,
  FiCode,
} from "react-icons/fi";
import { getUserPublicProfile } from "@/lib/snippets/snippet-service";
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
    languages: string[];
    languageCount: number;
  };
}

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Loading profile for username:", username);
    const loadedProfile = getUserPublicProfile(username);
    console.log("Loaded profile:", loadedProfile);
    setProfile(loadedProfile);
    setLoading(false);
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-8">User not found</p>
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

  const filteredSnippets =
    selectedLanguage === "all"
      ? profile.snippets
      : profile.snippets.filter((s) => s.language === selectedLanguage);

  const profileUrl = getProfileUrl(profile.user.username);
  const fullProfileUrl = getFullUrl(profileUrl);
  const languagesText = profile.stats.languages.join(", ");

  return (
    <>
      <Head>
        <title>
          @{profile.user.username} - {profile.user.name} | Code Snippets Profile
        </title>
        <meta
          name="description"
          content={`View ${profile.user.name}'s code snippets. ${profile.stats.totalSnippets} snippets in ${profile.stats.languageCount} languages: ${languagesText}`}
        />

        {/* Open Graph */}
        <meta property="og:type" content="profile" />
        <meta
          property="og:title"
          content={`@${profile.user.username} - ${profile.user.name}`}
        />
        <meta
          property="og:description"
          content={`${profile.stats.totalSnippets} snippets in ${profile.stats.languageCount} languages`}
        />
        <meta property="og:url" content={fullProfileUrl} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={`@${profile.user.username}`} />
        <meta
          name="twitter:description"
          content={`${profile.stats.totalSnippets} code snippets`}
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

            {/* Profile Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div className="flex items-start gap-6">
                  {/* Avatar */}
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
                    {profile.user.name.charAt(0).toUpperCase()}
                  </div>

                  {/* User Info */}
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">
                      {profile.user.name}
                    </h1>
                    <p className="text-xl text-gray-600 mb-4">
                      @{profile.user.username}
                    </p>

                    <div className="flex items-center gap-2 text-gray-600 mb-6">
                      <FiCalendar size={16} />
                      <span>Joined {formatDate(profile.user.createdAt)}</span>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <FiCode size={18} className="text-blue-600" />
                        <span className="font-semibold text-gray-900">
                          {profile.stats.totalSnippets}
                        </span>
                        <span className="text-gray-600">
                          {profile.stats.totalSnippets === 1
                            ? "snippet"
                            : "snippets"}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900">
                          {profile.stats.languageCount}
                        </span>
                        <span className="text-gray-600">
                          {" "}
                          {profile.stats.languageCount === 1
                            ? "language"
                            : "languages"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Share Button */}
                <div>
                  <ShareButton url={profileUrl} title="Share Profile" />
                </div>
              </div>

              {/* Languages Used */}
              {profile.stats.languages.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Languages
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.stats.languages.map((lang) => (
                      <LanguageBadge key={lang} language={lang} clickable />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Snippets Section */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Public Snippets ({filteredSnippets.length})
              </h2>

              {/* Controls */}
              <div className="flex items-center gap-4">
                {/* Language Filter */}
                {profile.stats.languages.length > 0 && (
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Languages</option>
                    {profile.stats.languages.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                )}

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

            {/* Snippets Grid/List */}
            {filteredSnippets.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
                <p className="text-xl text-gray-600">
                  {selectedLanguage === "all"
                    ? "No public snippets yet"
                    : `No ${selectedLanguage} snippets yet`}
                </p>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSnippets.map((snippet) => (
                  <SnippetCard key={snippet.id} snippet={snippet} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredSnippets.map((snippet) => (
                  <SnippetListItem key={snippet.id} snippet={snippet} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// Grid Card Component
function SnippetCard({ snippet }: { snippet: Snippet }) {
  const shareUrl = getSnippetShareUrl(snippet.id, snippet.title);

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between gap-2 mb-3">
          <LanguageBadge language={snippet.language} size="sm" clickable />
          <ShareButton url={shareUrl} variant="icon" />
        </div>

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

        {/* Topic Tags */}
        {snippet.tags && snippet.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {snippet.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            {formatRelativeTime(snippet.createdAt)}
          </span>
          {snippet.timeComplexity && (
            <span className="text-purple-600 font-medium text-xs">
              {snippet.timeComplexity}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// List Item Component
function SnippetListItem({ snippet }: { snippet: Snippet }) {
  const shareUrl = getSnippetShareUrl(snippet.id, snippet.title);

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <LanguageBadge language={snippet.language} size="sm" clickable />
              {snippet.timeComplexity && (
                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                  {snippet.timeComplexity}
                </span>
              )}
            </div>

            <Link
              href={`/snippets/${snippet.id}/${createSlug(snippet.title)}`}
              className="block group"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {snippet.title}
              </h3>
              <p className="text-gray-600 mb-3">{snippet.description}</p>
            </Link>

            {/* Topic Tags */}
            {snippet.tags && snippet.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {snippet.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <span className="text-sm text-gray-500">
              {formatRelativeTime(snippet.createdAt)}
            </span>
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
