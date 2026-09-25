import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Backfill alt="" on any <img> tag missing an alt attribute so screen readers
// skip it cleanly instead of announcing the raw src URL. A per-image fallback
// (e.g. the post title) can be passed in; otherwise defaults to empty
// (decorative), which is the safe WCAG choice when we don't know the content.
export function ensureImageAlts(html: string, fallback = ""): string {
  return html.replace(/<img\b([^>]*)>/gi, (match, attrs) => {
    if (/\balt\s*=/i.test(attrs)) return match;
    const safe = fallback.replace(/"/g, "&quot;");
    return `<img${attrs} alt="${safe}">`;
  });
}
