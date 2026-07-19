"use client";

import { useState } from "react";
import PostCard from "@/components/blog/PostCard";
import type { Post } from "@/lib/dynamodb";

const PAGE_SIZE = 4;

export function PostGrid({ posts }: { posts: Post[] }) {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const shown = posts.slice(0, visible);
  const hasMore = visible < posts.length;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-charcoal/10">
        {shown.map((post) => (
          <PostCard key={post.postId} post={post} />
        ))}
        {shown.length % 2 !== 0 && <div className="bg-parchment" />}
      </div>

      {hasMore && (
        <div className="mt-14 flex justify-center">
          <button
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            style={{ touchAction: "manipulation" }}
            className="font-sans text-[11px] uppercase tracking-[0.12em] border border-charcoal/30 text-charcoal/60 px-10 py-3.5 transition-all duration-200 hover:border-burgundy hover:text-burgundy focus:outline-none focus-visible:ring-2 focus-visible:ring-burgundy"
          >
            Load More
          </button>
        </div>
      )}
    </>
  );
}
