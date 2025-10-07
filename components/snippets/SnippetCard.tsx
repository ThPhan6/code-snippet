// Snippet card component for displaying snippet previews

"use client";

import React from "react";
import Link from "next/link";
import { Snippet, User } from "../../lib/data/types";
import { formatDistanceToNow } from "date-fns";
import {
  getSnippetShareUrl,
  createSlug,
  getComplexityColor,
} from "../../lib/utils/helpers";
import ShareButton from "../ui/ShareButton";
// import { useI18n } from "../../lib/i18n/context";

interface SnippetCardProps {
  snippet: Snippet;
  author?: User;
  showActions?: boolean;
  onEdit?: (snippetId: string) => void;
  onDelete?: (snippetId: string) => void;
}

export const SnippetCard: React.FC<SnippetCardProps> = ({
  snippet,
  author,
  showActions = false,
  onEdit,
  onDelete,
}) => {
  const timeAgo = formatDistanceToNow(new Date(snippet.createdAt), {
    addSuffix: true,
  });
  const shareUrl = getSnippetShareUrl(snippet.id, snippet.title);

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 p-6">
      {/* Header with Title and Language */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <Link
            href={`/snippets/${snippet.id}/${createSlug(snippet.title)}`}
            className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
          >
            {snippet.title}
          </Link>
        </div>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-gray-100 text-gray-800">
          {snippet.language}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {snippet.description}
      </p>

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

      {/* Time Complexity */}
      {snippet.timeComplexity && (
        <div className="mb-3">
          <span className="text-xs text-gray-500">Time Complexity: </span>
          <span
            className={`text-xs font-mono font-semibold ${getComplexityColor(
              snippet.timeComplexity
            )}`}
          >
            {snippet.timeComplexity}
          </span>
        </div>
      )}

      {/* Code Preview */}
      <div className="bg-gray-50 rounded border border-gray-200 p-3 mb-4 overflow-hidden">
        <pre className="text-xs text-gray-800 font-mono overflow-x-auto">
          <code className="line-clamp-3">{snippet.code}</code>
        </pre>
      </div>

      {/* Footer with Author and Actions */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center space-x-4">
          {author && <span className="text-gray-600">@{author.username}</span>}
          <span>{timeAgo}</span>
          {!snippet.isPublic && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
              Private
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Link
            href={`/snippets/${snippet.id}/${createSlug(snippet.title)}`}
            className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-600 hover:border-blue-700 rounded-lg transition-colors"
          >
            View
          </Link>
          {showActions && (
            <>
              {onEdit && (
                <button
                  onClick={() => onEdit(snippet.id)}
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 hover:border-gray-400 rounded-lg transition-colors"
                >
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(snippet.id)}
                  className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 border border-red-600 hover:border-red-700 rounded-lg transition-colors"
                >
                  Delete
                </button>
              )}
            </>
          )}
        </div>
        {snippet.isPublic && <ShareButton url={shareUrl} variant="icon" />}
      </div>
    </div>
  );
};
