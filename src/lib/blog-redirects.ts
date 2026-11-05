import redirects from "./blog-redirects.json";

export type BlogRedirect = { from: string; to: string };

export const blogRedirects: BlogRedirect[] = redirects;

const redirectedFromSlugs = new Set(blogRedirects.map((r) => r.from));

export function isRedirectedSlug(slug: string | undefined | null): boolean {
  if (!slug) return false;
  return redirectedFromSlugs.has(slug);
}

export function filterRedirectedSlugs<T extends { slug?: string }>(items: T[]): T[] {
  return items.filter((item) => !isRedirectedSlug(item.slug));
}
