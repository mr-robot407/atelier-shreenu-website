"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Post } from "@/lib/dynamodb";

export default function AdminPostsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchPosts() {
    const res = await fetch("/api/shreenu-editor/posts");
    if (res.ok) setPosts(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  async function toggleStatus(post: Post) {
    const isPublishing = post.status === "draft";
    await fetch(`/api/shreenu-editor/posts/${post.postId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        createdAt: post.createdAt,
        status: isPublishing ? "published" : "draft",
        publishedAt: isPublishing ? new Date().toISOString() : undefined,
      }),
    });
    fetchPosts();
  }

  async function deletePost(post: Post) {
    if (!confirm(`Delete "${post.title}"?`)) return;
    await fetch(`/api/shreenu-editor/posts/${post.postId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ createdAt: post.createdAt }),
    });
    fetchPosts();
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-serif text-stone-900">Posts</h1>
          <p className="text-stone-400 text-sm mt-1">
            {posts.length} post{posts.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <button
          onClick={() => router.push("/shreenu-editor/posts/new")}
          className="flex items-center gap-2 bg-stone-900 text-white text-sm font-medium px-5 py-2.5 rounded-md hover:bg-stone-700 active:scale-95 transition-all"
        >
          <span className="text-lg leading-none">+</span>
          New post
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 rounded-lg bg-stone-100 animate-pulse"
            />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-24 border-2 border-dashed border-stone-200 rounded-xl">
          <p className="text-stone-400 text-sm mb-4">No posts yet</p>
          <button
            onClick={() => router.push("/shreenu-editor/posts/new")}
            className="bg-stone-900 text-white text-sm font-medium px-6 py-3 rounded-md hover:bg-stone-700 transition-colors"
          >
            + Write your first post
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 divide-y divide-stone-100 overflow-hidden">
          {posts.map((post) => (
            <div
              key={post.postId}
              className="flex items-center gap-4 px-6 py-4 hover:bg-stone-50 transition-colors"
            >
              {/* Status dot */}
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  post.status === "published"
                    ? "bg-emerald-400"
                    : "bg-amber-300"
                }`}
              />

              {/* Title + date */}
              <div className="flex-1 min-w-0">
                <p className="text-stone-900 font-medium truncate">
                  {post.title}
                </p>
                <p className="text-stone-400 text-xs mt-0.5">
                  {new Date(post.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                  {" · "}
                  <span
                    className={
                      post.status === "published"
                        ? "text-emerald-600"
                        : "text-amber-500"
                    }
                  >
                    {post.status}
                  </span>
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() =>
                    router.push(
                      `/shreenu-editor/posts/${post.postId}/edit?createdAt=${encodeURIComponent(post.createdAt)}`
                    )
                  }
                  className="px-3 py-1.5 text-xs font-medium text-stone-600 bg-stone-100 rounded hover:bg-stone-200 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => toggleStatus(post)}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                    post.status === "published"
                      ? "text-amber-700 bg-amber-50 hover:bg-amber-100"
                      : "text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                  }`}
                >
                  {post.status === "published" ? "Unpublish" : "Publish"}
                </button>
                <button
                  onClick={() => deletePost(post)}
                  className="px-3 py-1.5 text-xs font-medium text-red-500 bg-red-50 rounded hover:bg-red-100 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick link to blog */}
      <div className="mt-8 text-center">
        <a
          href="/blog/"
          target="_blank"
          className="text-xs text-stone-400 hover:text-stone-600 transition-colors underline underline-offset-2"
        >
          View live blog →
        </a>
      </div>
    </div>
  );
}
