// Dashboard page (protected route)

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "../../lib/auth/protected-route";
import { useAuth } from "../../lib/auth/auth-context";
import { useI18n } from "../../lib/i18n/context";
import {
  getSnippetsWithAuthors,
  deleteSnippet,
} from "../../lib/snippets/snippet-service";
import { SnippetCard } from "../../components/snippets/SnippetCard";
import { LanguageSelector } from "../../components/ui/LanguageSelector";
import { Snippet, User } from "../../lib/data/types";

function DashboardContent() {
  const { user, logoutUser } = useAuth();
  const { t } = useI18n();
  const router = useRouter();
  const [snippets, setSnippets] = useState<Array<Snippet & { author: User }>>(
    []
  );
  const [filter, setFilter] = useState<"all" | "public" | "private">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadSnippets();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, filter, searchQuery, selectedLanguage]);

  const loadSnippets = () => {
    if (!user) return;

    const options: {
      authorId: string;
      publicOnly?: boolean;
      searchQuery?: string;
      language?: string;
    } = { authorId: user.id };

    if (filter === "public") {
      options.publicOnly = true;
    } else if (filter === "private") {
      // Will filter in the result
    }

    if (searchQuery) {
      options.searchQuery = searchQuery;
    }

    if (selectedLanguage) {
      options.language = selectedLanguage;
    }

    let results = getSnippetsWithAuthors(options);

    // Filter private snippets if needed
    if (filter === "private") {
      results = results.filter((s) => !s.isPublic);
    }

    setSnippets(results);
  };

  const handleEdit = (snippetId: string) => {
    router.push(`/snippets/${snippetId}/edit`);
  };

  const handleDelete = (snippetId: string) => {
    setShowDeleteModal(snippetId);
  };

  const confirmDelete = () => {
    if (showDeleteModal) {
      const result = deleteSnippet(showDeleteModal);
      if (result.success) {
        loadSnippets();
        setShowDeleteModal(null);
      }
    }
  };

  // Get unique languages from user's snippets
  const languages = Array.from(new Set(snippets.map((s) => s.language))).sort();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="py-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                {t("snippets.mySnippets")}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {t("snippets.manageSnippets")}
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
              <LanguageSelector />
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
              <button
                onClick={() => router.push("/snippets/new")}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                + {t("snippets.newSnippet")}
              </button>
              <button
                onClick={() => router.push(`/profile/${user?.username}`)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {t("snippets.viewMyProfile")}
              </button>
              <button
                onClick={logoutUser}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {t("snippets.signOut")}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-500 rounded-md flex items-center justify-center text-white text-lg">
                    📝
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {t("snippets.totalSnippets")}
                    </dt>
                    <dd className="text-3xl font-semibold text-gray-900">
                      {snippets.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-500 rounded-md flex items-center justify-center text-white text-lg">
                    💻
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {t("snippets.languages")}
                    </dt>
                    <dd className="text-3xl font-semibold text-gray-900">
                      {languages.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-purple-500 rounded-md flex items-center justify-center text-white text-lg">
                    👁️
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {t("snippets.publicSnippets")}
                    </dt>
                    <dd className="text-3xl font-semibold text-gray-900">
                      {snippets.filter((s) => s.isPublic).length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("snippets.searchSnippets")}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />

            {/* Language Filter */}
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            >
              <option value="">{t("snippets.allLanguages")}</option>
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>

            {/* Visibility Filter */}
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter("all")}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium ${
                  filter === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {t("snippets.all")}
              </button>
              <button
                onClick={() => setFilter("public")}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium ${
                  filter === "public"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {t("snippets.public")}
              </button>
              <button
                onClick={() => setFilter("private")}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium ${
                  filter === "private"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {t("snippets.private")}
              </button>
            </div>
          </div>
        </div>

        {/* Snippets List */}
        {snippets.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {t("snippets.noSnippets")}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {t("snippets.createFirstSnippet")}
            </p>
            <div className="mt-6">
              <button
                onClick={() => router.push("/snippets/new")}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                + {t("snippets.createSnippet")}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
            {snippets.map((snippet) => (
              <SnippetCard
                key={snippet.id}
                snippet={snippet}
                author={snippet.author}
                showActions={true}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {t("snippets.deleteSnippet")}
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              {t("snippets.deleteConfirmation")}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                {t("common.delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
