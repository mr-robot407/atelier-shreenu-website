import { listPublishedPosts } from "@/lib/dynamodb";
import { filterRedirectedSlugs } from "@/lib/blog-redirects";

export const revalidate = 3600;

const SITE_URL = "https://ateliershreenu.com";
const FEED_ID = `${SITE_URL}/feed.xml`;

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

const AUTHOR_NAMES = {
  ranjeet: "Ranjeet Mukherjee",
  shreenu: "Shreenu Mukherjee",
};

export async function GET() {
  let posts = await listPublishedPosts().catch(() => []);
  posts = filterRedirectedSlugs(posts);

  const updated =
    posts[0]?.updatedAt ??
    posts[0]?.publishedAt ??
    posts[0]?.createdAt ??
    new Date().toISOString();

  const entries = posts
    .map((post) => {
      const url = `${SITE_URL}/blog/${post.slug}/`;
      const published = post.publishedAt ?? post.createdAt;
      const modified = post.updatedAt ?? published;
      const authorName = AUTHOR_NAMES[post.author ?? "ranjeet"];
      const category = post.tags?.[0] ?? "";
      return `  <entry>
    <title>${escapeXml(post.title)}</title>
    <link href="${url}" />
    <id>${url}</id>
    <published>${published}</published>
    <updated>${modified}</updated>
    <author><name>${escapeXml(authorName)}</name></author>${category ? `
    <category term="${escapeXml(category)}" />` : ""}
    <summary>${escapeXml(post.excerpt ?? "")}</summary>
  </entry>`;
    })
    .join("\n");

  const atom = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="en-IN">
  <title>The Atelier Shreenu Blog</title>
  <subtitle>Ideas, references, and perspectives from the studio.</subtitle>
  <link href="${SITE_URL}/blog/" />
  <link rel="self" type="application/atom+xml" href="${FEED_ID}" />
  <id>${FEED_ID}</id>
  <updated>${updated}</updated>
  <author><name>Atelier Shreenu</name><email>info@ateliershreenu.com</email></author>
  <rights>© ${new Date().getFullYear()} Atelier Shreenu</rights>
${entries}
</feed>
`;

  return new Response(atom, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
