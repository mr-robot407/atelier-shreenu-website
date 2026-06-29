"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import CoverImageUploader from "@/components/admin/CoverImageUploader";
import PostPreview from "@/components/admin/PostPreview";

const Editor = dynamic(() => import("@/components/admin/Editor"), {
  ssr: false,
  loading: () => (
    <div className="border border-stone-200 rounded-lg h-64 animate-pulse bg-stone-50" />
  ),
});

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [category, setCategory] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(false);

  function autoSlug(t: string) {
    return t
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 80);
  }

  async function handleSave(statusToSave: "draft" | "published") {
    if (!title) return;
    setSaving(true);
    setError("");

    const res = await fetch("/api/shreenu-editor/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        slug: slug || autoSlug(title),
        excerpt,
        content,
        coverImage,
        status: statusToSave,
        publishedAt:
          statusToSave === "published" ? new Date().toISOString() : undefined,
        tags: category ? [category] : [],
      }),
    });

    setSaving(false);
    if (!res.ok) { setError("Failed to save"); return; }
    router.push("/shreenu-editor/posts");
  }

  return (
    <>
      {preview && (
        <PostPreview
          title={title}
          excerpt={excerpt}
          content={content}
          coverImage={coverImage}
          onClose={() => setPreview(false)}
        />
      )}

      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-serif text-stone-900">New post</h1>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPreview(true)}
              className="text-sm px-4 py-2 rounded border border-stone-300 text-stone-600 hover:bg-stone-50 transition-colors"
            >
              Preview
            </button>
            <button
              type="button"
              disabled={saving || !title}
              onClick={() => handleSave("draft")}
              className="text-sm px-4 py-2 rounded border border-stone-300 text-stone-700 hover:bg-stone-50 transition-colors disabled:opacity-40"
            >
              {saving ? "Saving…" : "Save draft"}
            </button>
            <button
              type="button"
              disabled={saving || !title}
              onClick={() => handleSave("published")}
              className="text-sm px-5 py-2 rounded bg-burgundy text-white hover:bg-deep-wine transition-colors disabled:opacity-40"
            >
              {saving ? "Publishing…" : "Publish"}
            </button>
          </div>
        </div>

        {error && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
            {error}
          </p>
        )}

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-2xl font-serif text-stone-900 placeholder:text-stone-300 border-0 border-b border-stone-200 pb-2 focus:outline-none focus:border-stone-400 bg-transparent"
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-stone-400 mb-1 uppercase tracking-wider">Slug</label>
              <input
                type="text"
                placeholder={autoSlug(title) || "url-slug"}
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full border border-stone-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-stone-400"
              />
            </div>
            <div>
              <label className="block text-xs text-stone-400 mb-1 uppercase tracking-wider">Category <span className="normal-case text-stone-300">(optional)</span></label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-stone-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-stone-400 text-stone-700"
              >
                <option value="">— No category —</option>
                <option value="design">Design</option>
                <option value="architecture">Architecture</option>
                <option value="studio-life">Studio Life</option>
                <option value="references">References</option>
              </select>
            </div>
          </div>
          <div className="mt-[-8px]">
            <CoverImageUploader value={coverImage} onChange={setCoverImage} />
          </div>

          <div>
            <label className="block text-xs text-stone-400 mb-1 uppercase tracking-wider">Excerpt</label>
            <textarea
              placeholder="Short summary shown on the blog listing page…"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              className="w-full border border-stone-200 rounded px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-stone-400"
            />
          </div>

          <div>
            <label className="block text-xs text-stone-400 mb-2 uppercase tracking-wider">Content</label>
            <Editor content={content} onChange={setContent} />
          </div>
        </div>
      </div>
    </>
  );
}
