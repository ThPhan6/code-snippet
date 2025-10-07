import { Metadata } from "next";
import { Snippet, User } from "../data/types";
import { ENV, getAbsoluteUrl } from "../config/env";

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article" | "profile";
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    image,
    url,
    type = "website",
    author,
    publishedTime,
    modifiedTime,
  } = config;

  const fullUrl = url ? getAbsoluteUrl(url) : ENV.APP_URL;
  const fullImage = image
    ? getAbsoluteUrl(image)
    : getAbsoluteUrl("/og-image.png");

  return {
    title,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    authors: author ? [{ name: author }] : undefined,
    openGraph: {
      type,
      locale: "en_US",
      url: fullUrl,
      title,
      description,
      siteName: "Code Snippets Platform",
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [fullImage],
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export function generateSnippetMetadata(
  snippet: Snippet,
  author?: User
): Metadata {
  const authorName = author ? `@${author.username}` : "Unknown Author";
  const description = snippet.description
    ? snippet.description.substring(0, 160)
    : `Code snippet in ${snippet.language} by ${authorName}`;

  return generateMetadata({
    title: `${snippet.title} by ${authorName}`,
    description,
    keywords: [
      snippet.language.toLowerCase(),
      "code snippet",
      "programming",
      snippet.title.toLowerCase(),
      ...(snippet.tags || []),
    ],
    url: `/snippets/${snippet.id}/${snippet.title
      .toLowerCase()
      .replace(/\s+/g, "-")}`,
    type: "article",
    author: authorName,
    publishedTime: snippet.createdAt,
    modifiedTime: snippet.updatedAt,
  });
}

export function generateLanguageMetadata(
  language: string,
  snippetCount: number
): Metadata {
  const title = `${language} Code Snippets`;
  const description = `Browse ${snippetCount} ${language} code snippets shared by developers. Learn, share, and discover ${language} programming examples.`;

  return generateMetadata({
    title,
    description,
    keywords: [
      language.toLowerCase(),
      "code snippets",
      "programming",
      "examples",
      "tutorials",
    ],
    url: `/languages/${language.toLowerCase()}`,
    type: "website",
  });
}

export function generateProfileMetadata(
  user: User,
  stats: {
    totalSnippets: number;
    languageCount: number;
    languages: string[];
  }
): Metadata {
  const title = `@${user.username} - ${user.name} | Code Snippets Profile`;
  const languagesText = stats.languages.join(", ");
  const description = `View ${user.name}'s code snippets. ${stats.totalSnippets} snippets in ${stats.languageCount} languages: ${languagesText}`;

  return generateMetadata({
    title,
    description,
    keywords: [
      user.username,
      user.name,
      "code snippets",
      "programming",
      ...stats.languages.map((lang) => lang.toLowerCase()),
    ],
    url: `/profile/${user.username}`,
    type: "profile",
    author: `@${user.username}`,
  });
}

export function generateDashboardMetadata(): Metadata {
  return generateMetadata({
    title: "Dashboard - My Code Snippets",
    description:
      "Manage your code snippets, create new ones, and organize your programming examples.",
    keywords: ["dashboard", "my snippets", "code management", "programming"],
    url: "/dashboard",
    type: "website",
  });
}

export function generateHomeMetadata(): Metadata {
  return generateMetadata({
    title: "Code Snippets Platform - Share & Discover Code",
    description:
      "Share and discover code snippets with the developer community. Browse programming examples, learn from developers, and showcase your code.",
    keywords: [
      "code snippets",
      "programming",
      "developer tools",
      "code examples",
      "programming languages",
      "software development",
    ],
    url: "/",
    type: "website",
  });
}
