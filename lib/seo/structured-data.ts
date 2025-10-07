import { Snippet, User } from "../data/types";
import { ENV, getAbsoluteUrl } from "../config/env";

export interface StructuredDataConfig {
  type: "WebSite" | "Article" | "Person" | "CollectionPage";
  name: string;
  description: string;
  url: string;
  image?: string;
  author?: string;
  datePublished?: string;
  dateModified?: string;
  keywords?: string[];
}

export function generateStructuredData(config: StructuredDataConfig) {
  const baseData = {
    "@context": "https://schema.org",
    "@type": config.type,
    name: config.name,
    description: config.description,
    url: getAbsoluteUrl(config.url),
    ...(config.image && {
      image: getAbsoluteUrl(config.image),
    }),
    ...(config.author && {
      author: { "@type": "Person", name: config.author },
    }),
    ...(config.datePublished && { datePublished: config.datePublished }),
    ...(config.dateModified && { dateModified: config.dateModified }),
    ...(config.keywords && { keywords: config.keywords.join(", ") }),
  };

  return baseData;
}

export function generateSnippetStructuredData(snippet: Snippet, author?: User) {
  const authorName = author ? author.name : "Unknown Author";
  const authorUsername = author ? author.username : "unknown";

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: snippet.title,
    description: snippet.description || `Code snippet in ${snippet.language}`,
    url: getAbsoluteUrl(
      `/snippets/${snippet.id}/${snippet.title
        .toLowerCase()
        .replace(/\s+/g, "-")}`
    ),
    datePublished: snippet.createdAt,
    dateModified: snippet.updatedAt,
    author: {
      "@type": "Person",
      name: authorName,
      url: getAbsoluteUrl(`/profile/${authorUsername}`),
    },
    publisher: {
      "@type": "Organization",
      name: "Code Snippets Platform",
      url: ENV.APP_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": getAbsoluteUrl(
        `/snippets/${snippet.id}/${snippet.title
          .toLowerCase()
          .replace(/\s+/g, "-")}`
      ),
    },
    articleSection: snippet.language,
    keywords: [
      snippet.language,
      "code snippet",
      "programming",
      snippet.title,
      ...(snippet.tags || []),
    ],
    programmingLanguage: snippet.language,
    codeRepository: {
      "@type": "SoftwareSourceCode",
      programmingLanguage: snippet.language,
      codeSampleType: "code snippet",
    },
  };
}

export function generatePersonStructuredData(
  user: User,
  stats: {
    totalSnippets: number;
    languageCount: number;
    languages: string[];
  }
) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: user.name,
    alternateName: user.username,
    url: getAbsoluteUrl(`/profile/${user.username}`),
    description: `Developer with ${stats.totalSnippets} code snippets in ${stats.languageCount} programming languages`,
    knowsAbout: stats.languages,
    memberOf: {
      "@type": "Organization",
      name: "Code Snippets Platform",
    },
  };
}

export function generateWebsiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Code Snippets Platform",
    description:
      "Share and discover code snippets with the developer community",
    url: ENV.APP_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: getAbsoluteUrl("/search?q={search_term_string}"),
      },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "Code Snippets Platform",
      url: ENV.APP_URL,
    },
  };
}

export function generateCollectionPageStructuredData(
  language: string,
  snippetCount: number
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${language} Code Snippets`,
    description: `Browse ${snippetCount} ${language} code snippets shared by developers`,
    url: getAbsoluteUrl(`/languages/${language.toLowerCase()}`),
    mainEntity: {
      "@type": "ItemList",
      name: `${language} Code Snippets`,
      numberOfItems: snippetCount,
      itemListElement: {
        "@type": "ListItem",
        position: 1,
        name: `${language} Programming Examples`,
      },
    },
    about: {
      "@type": "Thing",
      name: language,
      description: `${language} programming language`,
    },
  };
}
