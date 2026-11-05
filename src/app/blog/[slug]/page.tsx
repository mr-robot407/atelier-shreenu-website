import { getPostBySlug, listPublishedPosts } from "@/lib/dynamodb";
import { notFound, permanentRedirect } from "next/navigation";
import Image from "next/image";
import { ensureImageAlts } from "@/lib/utils";

export const revalidate = 60;
export const dynamicParams = true;

const CATEGORY_LABELS: Record<string, string> = {
  design: "Design",
  lifestyle: "Lifestyle",
  insights: "Insights",
};

const AUTHOR_ENTITIES = {
  ranjeet: { "@id": "https://ateliershreenu.com/#ranjeet", name: "Ranjeet Mukherjee" },
  shreenu: { "@id": "https://ateliershreenu.com/#shreenu", name: "Shreenu Mukherjee" },
};

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);
  if (!post) return {};
  const url = `https://ateliershreenu.com/blog/${post.slug}/`;
  const images = post.coverImage ? [post.coverImage] : [];
  return {
    title: `${post.title} — The Blog`,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}/` },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.excerpt,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images,
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

  const authorKey = post.author ?? "ranjeet";
  const articleSection = category && CATEGORY_LABELS[category] ? CATEGORY_LABELS[category] : undefined;
  const postUrl = `https://ateliershreenu.com/blog/${post.slug}/`;

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `${postUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://ateliershreenu.com/" },
          { "@type": "ListItem", position: 2, name: "Blog", item: "https://ateliershreenu.com/blog/" },
          { "@type": "ListItem", position: 3, name: post.title, item: postUrl },
        ],
      },
      {
        "@type": "BlogPosting",
        "@id": `${postUrl}#article`,
        mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
        headline: post.title,
        description: post.excerpt,
        ...(post.coverImage ? { image: post.coverImage } : {}),
        datePublished: post.publishedAt ?? post.createdAt,
        dateModified: post.updatedAt ?? post.publishedAt ?? post.createdAt,
        ...(articleSection ? { articleSection } : {}),
        inLanguage: "en-IN",
        author: { "@id": AUTHOR_ENTITIES[authorKey]["@id"] },
        publisher: { "@id": "https://ateliershreenu.com/#organization" },
        isPartOf: { "@id": "https://ateliershreenu.com/#website" },
      },
    ],
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
          <p className="font-sans text-[11px] uppercase tracking-widest text-charcoal/40">
            By {AUTHOR_ENTITIES[authorKey].name}
            {date ? <span className="text-charcoal/30"> · {date}</span> : null}
          </p>
          <div className="mt-8 h-px bg-charcoal/10" />
        </div>

        <article
          className="prose prose-stone prose-lg max-w-[680px] prose-headings:font-serif prose-headings:font-normal prose-a:text-burgundy prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: ensureImageAlts(post.content, post.title) }}
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
