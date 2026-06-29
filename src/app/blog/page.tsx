import { listPublishedPosts } from "@/lib/dynamodb";
import PostCard from "@/components/blog/PostCard";
import { BlogNav } from "@/components/blog/BlogNav";
import { BlogFooter } from "@/components/blog/BlogFooter";
import { CATEGORIES } from "@/lib/categories";

export const revalidate = 60;

export const metadata = {
  title: "The Blog — Atelier Shreenu",
  description:
    "Ideas, references, and perspectives from the studio of Atelier Shreenu.",
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const allPosts = await listPublishedPosts();
  const activeCategory = searchParams.category ?? "";

  const posts = activeCategory
    ? allPosts.filter((p) => p.tags?.[0] === activeCategory)
    : allPosts;

  const categoryLabel =
    CATEGORIES.find((c) => c.value === activeCategory)?.label ?? "All";

  return (
    <>
      <BlogNav />
      <main className="pt-[88px] pb-16">
        <div className="container-editorial">
          <div className="border-b border-charcoal/10 pb-12 mb-16">
            <p className="font-sans text-[11px] uppercase tracking-[0.14em] text-warm-grey mb-4">
              {activeCategory ? categoryLabel : "The Blog"}
            </p>
            <h1 className="font-serif text-[clamp(42px,5vw,72px)] leading-[1.1] text-charcoal max-w-3xl">
              Ideas, references, and perspectives from the studio.
            </h1>
          </div>

          {posts.length === 0 ? (
            <p className="font-sans text-charcoal/40 text-sm">
              No posts in {categoryLabel.toLowerCase()} yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-charcoal/10">
              {posts.map((post) => (
                <PostCard key={post.postId} post={post} />
              ))}
              {posts.length % 2 !== 0 && <div className="bg-parchment" />}
            </div>
          )}
        </div>
      </main>
      <BlogFooter />
    </>
  );
}
