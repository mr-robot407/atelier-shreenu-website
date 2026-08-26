import { getPostBySlug, listPublishedPosts } from "@/lib/dynamodb";
import { notFound, permanentRedirect } from "next/navigation";
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
    alternates: { canonical: `/blog/${post.slug}/` },
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

  if (params.slug !== post.slug) {
    permanentRedirect(`/blog/${post.slug}/`);
  }

  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const category = (post.tags?.[0] ?? "") as string;

  const allPosts = await listPublishedPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === post.slug);
  const nextPost =
    currentIndex >= 0 && currentIndex < allPosts.length - 1
      ? allPosts[currentIndex + 1]
      : null;

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    ...(post.coverImage ? { image: post.coverImage } : {}),
    datePublished: post.publishedAt ?? post.createdAt,
    dateModified: post.publishedAt ?? post.createdAt,
    author: {
      "@type": "Organization",
      name: "Atelier Shreenu",
      url: "https://ateliershreenu.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Atelier Shreenu",
      url: "https://ateliershreenu.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://ateliershreenu.com/blog/${post.slug}/`,
    },
  };

  return (
    <main className="pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />
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

        <div className="mt-12 pt-6 border-t border-charcoal/10 flex items-center justify-between gap-4">
          <a
            href="/blog/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-[11px] uppercase tracking-[0.12em] text-burgundy hover:underline underline-offset-2"
          >
            ← Back to all posts
          </a>
          {nextPost && (
            <a
              href={`/blog/${nextPost.slug}/`}
              className="font-sans text-[11px] uppercase tracking-[0.12em] text-burgundy hover:underline underline-offset-2 text-right"
              title={nextPost.title}
            >
              Next post →
            </a>
          )}
        </div>
      </div>
    </main>
  );
}
