"use client";

import { useState } from "react";
import { FiShare2, FiCheck, FiCopy } from "react-icons/fi";
import { copyToClipboard, getFullUrl } from "@/lib/utils/helpers";

interface ShareButtonProps {
  url: string;
  title?: string;
  variant?: "default" | "icon" | "text";
  className?: string;
  onCopy?: () => void;
}

export default function ShareButton({
  url,
  title = "Share",
  variant = "default",
  className = "",
  onCopy,
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const fullUrl = getFullUrl(url);
    const success = await copyToClipboard(fullUrl);

    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onCopy?.();
    }
  };

  // Icon-only variant
  if (variant === "icon") {
    return (
      <button
        onClick={handleShare}
        className={`p-2 rounded-lg transition-all duration-200 ${
          copied
            ? "bg-green-100 text-green-600"
            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
        } ${className}`}
        title={copied ? "Copied!" : "Copy share link"}
      >
        {copied ? <FiCheck size={18} /> : <FiCopy size={18} />}
      </button>
    );
  }

  // Text-only variant
  if (variant === "text") {
    return (
      <button
        onClick={handleShare}
        className={`text-sm font-medium transition-colors ${
          copied ? "text-green-600" : "text-blue-600 hover:text-blue-700"
        } ${className}`}
      >
        {copied ? "Copied!" : "Copy link"}
      </button>
    );
  }

  // Default button variant
  return (
    <button
      onClick={handleShare}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
        copied
          ? "bg-green-600 text-white"
          : "bg-blue-600 hover:bg-blue-700 text-white"
      } ${className}`}
    >
      {copied ? (
        <>
          <FiCheck size={18} />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <FiShare2 size={18} />
          <span>{title}</span>
        </>
      )}
    </button>
  );
}
