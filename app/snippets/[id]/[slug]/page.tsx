import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSnippetById } from "@/lib/snippets/snippet-service";
import { getUserById } from "@/lib/data/storage";
import { generateSnippetMetadata } from "@/lib/seo/metadata";
import { generateSnippetStructuredData } from "@/lib/seo/structured-data";
import SnippetDetailClient from "./SnippetDetailClient";

interface SnippetDetailPageProps {
  params: {
    id: string;
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: SnippetDetailPageProps): Promise<Metadata> {
  const snippet = getSnippetById(params.id);

  if (!snippet || !snippet.isPublic) {
    return {
      title: "Snippet Not Found",
      description: "The requested code snippet could not be found.",
    };
  }

  const author = getUserById(snippet.authorId);
  return generateSnippetMetadata(snippet, author);
}

export default function SnippetDetailPage({ params }: SnippetDetailPageProps) {
  const snippet = getSnippetById(params.id);

  if (!snippet || !snippet.isPublic) {
    notFound();
  }

  const author = getUserById(snippet.authorId);
  const structuredData = generateSnippetStructuredData(snippet, author);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <SnippetDetailClient snippet={snippet} author={author} />
    </>
  );
}
