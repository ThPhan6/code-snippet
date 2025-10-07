import { generateSitemap, generateSitemapXML } from "@/lib/seo/sitemap";

export async function GET() {
  try {
    const entries = await generateSitemap();
    const xml = generateSitemapXML(entries);

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return new Response("Error generating sitemap", { status: 500 });
  }
}
