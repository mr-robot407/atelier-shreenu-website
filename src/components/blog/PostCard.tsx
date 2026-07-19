import Link from "next/link";
import Image from "next/image";
import type { Post } from "@/lib/dynamodb";

const CATEGORY_LABELS: Record<string, string> = {
  design: "Design",
  lifestyle: "Lifestyle",
  insights: "Insights",
};

export default function PostCard({ post }: { post: Post }) {
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const category = (post.tags?.[0] ?? "") as string;

  return (
    <Link
      href={`/blog/${post.slug}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-parchment focus:outline-none focus-visible:ring-2 focus-visible:ring-burgundy"
    >
      <div
        className="relative w-full overflow-hidden bg-bone"
        style={{ aspectRatio: "3/2" }}
      >
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            draggable={false}
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-sans text-[11px] uppercase tracking-widest text-warm-grey">
              No image
            </span>
          </div>
        )}
      </div>

      <div className="p-6 md:p-8">
        {category && CATEGORY_LABELS[category] && (
          <p className="font-sans text-[11px] uppercase tracking-[0.12em] text-burgundy mb-3">
            {CATEGORY_LABELS[category]}
          </p>
        )}
        <h2 className="font-serif text-[24px] leading-tight text-charcoal group-hover:text-burgundy transition-colors duration-200 mb-3">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="font-sans text-sm leading-relaxed text-charcoal/60 line-clamp-3">
            {post.excerpt}
          </p>
        )}
        {date && (
          <p className="font-sans text-[11px] text-charcoal/40 mt-4 tracking-wide">
            {date}
          </p>
        )}
      </div>
    </Link>
  );
}
