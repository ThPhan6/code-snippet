import { getSnippets } from "../snippets/snippet-service";
import { loadUsers } from "../data/storage";
import { ENV } from "../config/env";

export interface SitemapEntry {
  url: string;
  lastModified: string;
  changeFrequency:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority: number;
}

export async function generateSitemap(): Promise<SitemapEntry[]> {
  const entries: SitemapEntry[] = [];

  // Static pages
  entries.push({
    url: `${ENV.APP_URL}/`,
    lastModified: new Date().toISOString(),
    changeFrequency: "daily",
    priority: 1.0,
  });

  entries.push({
    url: `${ENV.APP_URL}/login`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly",
    priority: 0.3,
  });

  entries.push({
    url: `${ENV.APP_URL}/register`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly",
    priority: 0.3,
  });

  // Get all public snippets
  try {
    const snippets = getSnippets();
    const publicSnippets = snippets.filter((snippet) => snippet.isPublic);

    for (const snippet of publicSnippets) {
      const slug = snippet.title.toLowerCase().replace(/\s+/g, "-");
      entries.push({
        url: `${ENV.APP_URL}/snippets/${snippet.id}/${slug}`,
        lastModified: snippet.updatedAt,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }

    // Get unique languages
    const languages = [...new Set(publicSnippets.map((s) => s.language))];
    for (const language of languages) {
      entries.push({
        url: `${ENV.APP_URL}/languages/${language.toLowerCase()}`,
        lastModified: new Date().toISOString(),
        changeFrequency: "daily",
        priority: 0.7,
      });
    }

    // Get all users with public profiles
    const users = loadUsers();
    for (const user of users) {
      const userSnippets = publicSnippets.filter((s) => s.authorId === user.id);
      if (userSnippets.length > 0) {
        entries.push({
          url: `${ENV.APP_URL}/profile/${user.username}`,
          lastModified: new Date().toISOString(),
          changeFrequency: "weekly",
          priority: 0.6,
        });
      }
    }
  } catch (error) {
    console.error("Error generating sitemap:", error);
  }

  return entries;
}

export function generateSitemapXML(entries: SitemapEntry[]): string {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (entry) => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastModified}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return xml;
}
