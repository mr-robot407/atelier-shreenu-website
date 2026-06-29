"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import CoverImageUploader from "@/components/admin/CoverImageUploader";
import PostPreview from "@/components/admin/PostPreview";
import type { Post } from "@/lib/dynamodb";

const Editor = dynamic(() => import("@/components/admin/Editor"), {
  ssr: false,
  loading: () => (
    <div className="border border-stone-200 rounded-lg h-64 animate-pulse bg-stone-50" />
  ),
});

export default function EditPostPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const createdAt = searchParams.get("createdAt") ?? "";

  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/shreenu-editor/posts");
      if (!res.ok) return;
      const posts: Post[] = await res.json();
      const found = posts.find((p) => p.postId === params.id);
      if (!found) return;
      setPost(found);
      setTitle(found.title);
      setSlug(found.slug);
      setExcerpt(found.excerpt);
      setContent(found.content);
      setCoverImage(found.coverImage ?? "");
      setCategory(found.tags?.[0] ?? "");
      setStatus(found.status);
    }
    load();
  }, [params.id]);

  async function handleSave(statusToSave: "draft" | "published") {
    if (!post) return;
    setSaving(true);
    setError("");

    const res = await fetch(`/api/shreenu-editor/posts/${post.postId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        createdAt: post.createdAt,
        title,
        slug,
        excerpt,
        content,
        coverImage,
        tags: category ? [category] : [],
        status: statusToSave,
        publishedAt:
          statusToSave === "published"
            ? post.publishedAt ?? new Date().toISOString()
            : undefined,
      }),
    });

    setSaving(false);
    if (!res.ok) { setError("Failed to save"); return; }
    router.push("/shreenu-editor/posts");
  }

  if (!post) {
    return <p className="text-stone-400 text-sm">Loading…</p>;
  }

  return (
    <>
      {preview && (
        <PostPreview
          title={title}
          excerpt={excerpt}
          content={content}
          coverImage={coverImage}
          publishedAt={post?.publishedAt}
          onClose={() => setPreview(false)}
        />
      )}
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-serif text-stone-900">Edit post</h1>
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
        <div>
          <input
            type="text"
            placeholder="Post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full text-2xl font-serif text-stone-900 placeholder:text-stone-300 border-0 border-b border-stone-200 pb-2 focus:outline-none focus:border-stone-400 bg-transparent"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-stone-400 mb-1 uppercase tracking-wider">Slug</label>
            <input
              type="text"
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
        <div>
          <CoverImageUploader value={coverImage} onChange={setCoverImage} />
        </div>

        <div>
          <label className="block text-xs text-stone-400 mb-1 uppercase tracking-wider">
            Excerpt
          </label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            className="w-full border border-stone-200 rounded px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-stone-400"
          />
        </div>

        <div>
          <label className="block text-xs text-stone-400 mb-2 uppercase tracking-wider">
            Content
          </label>
          <Editor content={content} onChange={setContent} />
        </div>
      </div>
    </div>
    </>
  );
}
