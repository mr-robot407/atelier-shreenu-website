import { listPublishedPosts, type Post } from "@/lib/dynamodb";
import { CATEGORIES } from "@/lib/categories";
import { PostGrid } from "@/components/blog/PostGrid";
import type { Metadata } from "next";

export const revalidate = 60;

const CATEGORY_META: Record<string, { title: string; description: string; intro: string }> = {
  design: {
    title: "Design — The Blog — Atelier Shreenu",
    description:
      "Explore design thinking from Atelier Shreenu — spatial decisions, material choices, and the reasoning behind every room we shape.",
    intro:
      "Design, at its most considered, is a conversation between a space and the people who inhabit it. In this category we unpack the decisions that shape Atelier Shreenu projects: why a wall opens instead of closes, why a palette leans warm rather than cool, how natural light is coaxed rather than forced. Each post traces the logic behind a material choice, a layout shift, or a detail that took weeks to resolve. Whether you are a future client looking to understand our process, a design student curious about practice-level decision-making, or simply someone who appreciates spaces built with intention — these essays are written for you.",
  },
  insights: {
    title: "Insights — The Blog — Atelier Shreenu",
    description:
      "Industry observations, research, and professional perspectives from the principals of Atelier Shreenu on architecture and interior design in India.",
    intro:
      "Architecture does not exist in isolation — it reflects the culture, economy, and aspirations of its moment. The Insights category is where Atelier Shreenu steps back from individual projects to examine larger forces shaping the built environment in India: how clients are thinking about home in 2025, what sustainable practice actually looks like beyond greenwashing, where traditional craft and contemporary detailing can coexist, and what a decade of running a design studio has taught us about the gap between vision and execution. These are longer, more reflective pieces — the kind of writing that does not date quickly because it is rooted in principle rather than trend.",
  },
  lifestyle: {
    title: "Lifestyle — The Blog — Atelier Shreenu",
    description:
      "How Atelier Shreenu thinks about living well — travel references, objects of note, and the sensory details that inform our design practice.",
    intro:
      "Every design practice is shaped by what its principals pay attention to outside the studio. The Lifestyle category is an honest account of the references, experiences, and objects that feed the way Atelier Shreenu sees. A restaurant in Mumbai where the acoustics are as considered as the menu. A heritage haveli that proves restraint is not the same as emptiness. A particular quality of afternoon light in a hill-station room that reappears, years later, in how we position a window. These posts are not aspirational lifestyle content — they are the raw material of a design sensibility, shared in the hope that they resonate with clients who choose Atelier Shreenu because they care about the same things we do.",
  },
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { category?: string };
}): Promise<Metadata> {
  const cat = searchParams.category ?? "";
  if (cat && CATEGORY_META[cat]) {
    return {
      title: CATEGORY_META[cat].title,
      description: CATEGORY_META[cat].description,
    };
  }
  return {
    title: "The Blog — Atelier Shreenu",
    description:
      "Ideas, references, and perspectives from the studio of Atelier Shreenu.",
  };
}

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

  const categoryMeta = activeCategory ? CATEGORY_META[activeCategory] : null;

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
            back to 2012. Today, that Design Firm continues as Atelier Shreenu — a studio led
            by Ranjeet and Shreenu Mukherjee, committed to spaces that feel considered rather
            than composed, inhabited rather than staged.
          </p>
        </section>

        <div className="border-b border-charcoal/10 pb-12 mb-16">
          <p className="font-sans text-[11px] uppercase tracking-[0.14em] text-warm-grey mb-4">
            {activeCategory ? categoryLabel : "The Blog"}
          </p>
          <h1 className="font-serif text-[clamp(42px,5vw,72px)] leading-[1.1] text-charcoal max-w-3xl">
            {activeCategory
              ? `${categoryLabel} — ideas from the studio.`
              : "Ideas, references, and perspectives from the studio."}
          </h1>
          {categoryMeta && (
            <p className="font-sans text-[15px] leading-relaxed text-charcoal/60 max-w-2xl mt-8">
              {categoryMeta.intro}
            </p>
          )}
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
