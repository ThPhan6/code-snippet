import Link from "next/link";
import { getLanguageUrl } from "@/lib/utils/helpers";
import {
  SiJavascript,
  SiTypescript,
  SiPython,
  SiCplusplus,
  SiGo,
  SiRust,
  SiPhp,
  SiRuby,
  SiSwift,
  SiKotlin,
  SiDotnet,
} from "react-icons/si";

interface LanguageBadgeProps {
  language: string;
  showIcon?: boolean;
  clickable?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const languageColors: Record<string, string> = {
  JavaScript: "bg-yellow-100 text-yellow-800 border-yellow-200",
  TypeScript: "bg-blue-100 text-blue-800 border-blue-200",
  Python: "bg-green-100 text-green-800 border-green-200",
  Java: "bg-red-100 text-red-800 border-red-200",
  "C++": "bg-pink-100 text-pink-800 border-pink-200",
  Go: "bg-cyan-100 text-cyan-800 border-cyan-200",
  Rust: "bg-orange-100 text-orange-800 border-orange-200",
  PHP: "bg-purple-100 text-purple-800 border-purple-200",
  Ruby: "bg-red-100 text-red-800 border-red-200",
  Swift: "bg-orange-100 text-orange-800 border-orange-200",
  Kotlin: "bg-purple-100 text-purple-800 border-purple-200",
  "C#": "bg-purple-100 text-purple-800 border-purple-200",
  default: "bg-gray-100 text-gray-800 border-gray-200",
};

const languageIcons: Record<string, React.ComponentType<{ size?: number }>> = {
  JavaScript: SiJavascript,
  TypeScript: SiTypescript,
  Python: SiPython,
  "C++": SiCplusplus,
  Go: SiGo,
  Rust: SiRust,
  PHP: SiPhp,
  Ruby: SiRuby,
  Swift: SiSwift,
  Kotlin: SiKotlin,
  "C#": SiDotnet,
};

export default function LanguageBadge({
  language,
  showIcon = true,
  clickable = false,
  size = "md",
  className = "",
}: LanguageBadgeProps) {
  const colorClass = languageColors[language] || languageColors.default;
  const Icon = languageIcons[language];

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2",
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  const content = (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium transition-all ${colorClass} ${
        sizeClasses[size]
      } ${clickable ? "hover:scale-105 cursor-pointer" : ""} ${className}`}
    >
      {showIcon && Icon && <Icon size={iconSizes[size]} />}
      {language}
    </span>
  );

  if (clickable) {
    return <Link href={getLanguageUrl(language)}>{content}</Link>;
  }

  return content;
}
