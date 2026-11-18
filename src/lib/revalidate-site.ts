import { revalidatePath } from "next/cache";

/**
 * Refresh every page that lists or describes blog posts, so a save in the
 * editor shows up on the live site (and for search engines and AI crawlers)
 * straight away instead of waiting for the next deploy or cache expiry.
 */
export function revalidateBlogSurfaces() {
  const paths: Array<[string, "page" | "layout" | undefined]> = [
    ["/", undefined],
    ["/blog", undefined],
    ["/blog/[slug]", "page"], // every post page, covers renamed slugs too
    ["/sitemap.xml", undefined],
    ["/feed.xml", undefined],
    ["/llms.txt", undefined],
  ];
  for (const [path, type] of paths) {
    try {
      revalidatePath(path, type);
    } catch (err) {
      console.error(`revalidate failed for ${path}`, err);
    }
  }
}
