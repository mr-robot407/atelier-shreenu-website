"use client";

import { useState } from "react";

export type SeoValues = {
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  noindex: boolean;
};

export const emptySeo: SeoValues = {
  seoTitle: "",
  seoDescription: "",
  canonicalUrl: "",
  noindex: false,
};

const TITLE_LIMIT = 60;
const DESCRIPTION_LIMIT = 160;
const SITE = "https://ateliershreenu.com";

function Counter({ length, limit }: { length: number; limit: number }) {
  const over = length > limit;
  return (
    <span className={`text-xs ${over ? "text-red-600" : "text-stone-400"}`}>
      {length}/{limit}
    </span>
  );
}

export default function SeoPanel({
  value,
  onChange,
  postTitle,
  excerpt,
  slug,
}: {
  value: SeoValues;
  onChange: (next: SeoValues) => void;
  postTitle: string;
  excerpt: string;
  slug: string;
}) {
  const [open, setOpen] = useState(
    Boolean(value.seoTitle || value.seoDescription || value.canonicalUrl || value.noindex)
  );
  const set = (patch: Partial<SeoValues>) => onChange({ ...value, ...patch });

  const shownTitle = value.seoTitle || (postTitle ? `${postTitle} — The Blog` : "Post title");
  const shownDescription = value.seoDescription || excerpt || "The excerpt is used when this is empty.";
  const shownUrl = value.canonicalUrl || `${SITE}/blog/${slug || "your-post"}/`;

  const input =
    "w-full border border-stone-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-stone-400";
  const label = "block text-xs text-stone-400 mb-1 uppercase tracking-wider";

  return (
    <div className="border border-stone-200 rounded-lg">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm text-stone-700"
      >
        <span>
          Search &amp; sharing (SEO)
          <span className="text-stone-400"> — optional, defaults come from the title and excerpt</span>
        </span>
        <span className="text-stone-400">{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-4 border-t border-stone-100 pt-4">
          <div className="rounded border border-stone-100 bg-stone-50 px-4 py-3">
            <p className="text-xs text-stone-400 mb-1">Google preview</p>
            <p className="text-xs text-stone-500 truncate">{shownUrl}</p>
            <p className="text-[#1a0dab] text-base leading-snug truncate">{shownTitle}</p>
            <p className="text-sm text-stone-600 line-clamp-2">{shownDescription}</p>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className={label}>Meta title</label>
              <Counter length={value.seoTitle.length} limit={TITLE_LIMIT} />
            </div>
            <input
              type="text"
              value={value.seoTitle}
              placeholder={postTitle ? `${postTitle} — The Blog` : "Defaults to the post title"}
              onChange={(e) => set({ seoTitle: e.target.value })}
              className={input}
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className={label}>Meta description</label>
              <Counter length={value.seoDescription.length} limit={DESCRIPTION_LIMIT} />
            </div>
            <textarea
              rows={2}
              value={value.seoDescription}
              placeholder="Defaults to the excerpt"
              onChange={(e) => set({ seoDescription: e.target.value })}
              className={`${input} resize-none`}
            />
          </div>

          <div>
            <label className={label}>
              Canonical URL <span className="normal-case text-stone-300">(only if this post first appeared elsewhere)</span>
            </label>
            <input
              type="url"
              value={value.canonicalUrl}
              placeholder={`${SITE}/blog/${slug || "your-post"}/`}
              onChange={(e) => set({ canonicalUrl: e.target.value })}
              className={input}
            />
          </div>

          <label className="flex items-start gap-2 text-sm text-stone-700">
            <input
              type="checkbox"
              checked={value.noindex}
              onChange={(e) => set({ noindex: e.target.checked })}
              className="mt-1"
            />
            <span>
              Hide from search engines
              <span className="block text-xs text-stone-400">
                Keeps the post on the blog but out of Google, the sitemap, the feed and llms.txt.
              </span>
            </span>
          </label>
        </div>
      )}
    </div>
  );
}
