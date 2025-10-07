import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSnippetsWithAuthors } from "@/lib/snippets/snippet-service";
import { generateLanguageMetadata } from "@/lib/seo/metadata";
import { generateCollectionPageStructuredData } from "@/lib/seo/structured-data";
import LanguagePageClient from "./LanguagePageClient";

interface LanguagePageProps {
  params: {
    language: string;
  };
}

export async function generateMetadata({
  params,
}: LanguagePageProps): Promise<Metadata> {
  const languageSlug = params.language;

  // Convert slug back to language name (e.g., "java-script" -> "JavaScript")
  const language = languageSlug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");

  const snippets = getSnippetsWithAuthors();
  const languageSnippets = snippets.filter(
    (snippet) =>
      snippet.language.toLowerCase() === language.toLowerCase() &&
      snippet.isPublic
  );

  if (languageSnippets.length === 0) {
    return {
      title: "Language Not Found",
      description: "No code snippets found for this programming language.",
    };
  }

  return generateLanguageMetadata(language, languageSnippets.length);
}

export default function LanguagePage({ params }: LanguagePageProps) {
  const languageSlug = params.language;

  // Convert slug back to language name (e.g., "java-script" -> "JavaScript")
  const language = languageSlug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");

  const snippets = getSnippetsWithAuthors();
  const languageSnippets = snippets.filter(
    (snippet) =>
      snippet.language.toLowerCase() === language.toLowerCase() &&
      snippet.isPublic
  );

  if (languageSnippets.length === 0) {
    notFound();
  }

  const structuredData = generateCollectionPageStructuredData(
    language,
    languageSnippets.length
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <LanguagePageClient language={language} snippets={languageSnippets} />
    </>
  );
}
