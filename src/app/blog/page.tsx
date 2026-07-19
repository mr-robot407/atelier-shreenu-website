import { listPublishedPosts, type Post } from "@/lib/dynamodb";
import { CATEGORIES } from "@/lib/categories";
import { PostGrid } from "@/components/blog/PostGrid";

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
  let allPosts: Post[] = [];
  try {
    allPosts = await listPublishedPosts();
  } catch (err) {
    console.error("DynamoDB error:", err);
  }
  const activeCategory = searchParams.category ?? "";

  const posts = activeCategory
    ? allPosts.filter((p) => p.tags?.[0] === activeCategory)
    : allPosts;

  const categoryLabel =
    CATEGORIES.find((c) => c.value === activeCategory)?.label ?? "All";

  return (
    <main className="pt-[88px] pb-16">
      <div className="container-editorial">
        {/* Brand intro */}
        <section className="border-b border-charcoal/10 pb-10 mb-12">
          <p className="font-sans text-[11px] uppercase tracking-[0.14em] text-warm-grey mb-4">
            About the Studio
          </p>
          <p className="font-sans text-[15px] leading-relaxed text-charcoal/70 max-w-2xl">
            An Architecture and Interior Design practice based in Delhi NCR, working across
            residential, hospitality and commercial spaces across India with roots that reach
            back to 2012. Today, that Design Firm continues as Atelier Shreenu.
          </p>
        </section>

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
          <PostGrid posts={posts} />
        )}
      </div>
    </main>
  );
}
