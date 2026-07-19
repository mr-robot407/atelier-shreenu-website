import { getPostBySlug } from "@/lib/dynamodb";
import { notFound } from "next/navigation";
import Image from "next/image";

export const revalidate = 60;
export const dynamicParams = true;

const CATEGORY_LABELS: Record<string, string> = {
  design: "Design",
  lifestyle: "Lifestyle",
  insights: "Insights",
};

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);
  if (!post) return {};
  return {
    title: `${post.title} — The Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);
  if (!post || post.status !== "published") notFound();

  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const category = (post.tags?.[0] ?? "") as string;

  return (
    <main className="pt-20">
      {post.coverImage && (
        <div
          className="relative w-full bg-bone"
          style={{ aspectRatio: "16/7" }}
        >
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            draggable={false}
            referrerPolicy="no-referrer"
          />
        </div>
      )}

      <div className="container-editorial py-16">
        <div className="max-w-[680px] mb-12">
          {category && CATEGORY_LABELS[category] && (
            <p className="font-sans text-[11px] uppercase tracking-[0.12em] text-burgundy mb-4">
              {CATEGORY_LABELS[category]}
            </p>
          )}
          <h1 className="font-serif text-[clamp(36px,4vw,60px)] leading-[1.1] text-charcoal mb-6">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="font-sans text-[18px] leading-relaxed text-charcoal/60 mb-6">
              {post.excerpt}
            </p>
          )}
          {date && (
            <p className="font-sans text-[11px] uppercase tracking-widest text-charcoal/30">
              {date}
            </p>
          )}
          <div className="mt-8 h-px bg-charcoal/10" />
        </div>

        <article
          className="prose prose-stone prose-lg max-w-[680px] prose-headings:font-serif prose-headings:font-normal prose-a:text-burgundy prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-12 pt-6 border-t border-charcoal/10">
          <a
            href="/blog"
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-[11px] uppercase tracking-[0.12em] text-burgundy hover:underline underline-offset-2"
          >
            ← Back to all posts
          </a>
        </div>
      </div>
    </main>
  );
}
