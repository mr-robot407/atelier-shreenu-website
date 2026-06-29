"use client";

type Props = {
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  publishedAt?: string;
  onClose: () => void;
};

export default function PostPreview({
  title,
  excerpt,
  content,
  coverImage,
  publishedAt,
  onClose,
}: Props) {
  const date = (publishedAt ? new Date(publishedAt) : new Date()).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex flex-col">
      {/* Preview bar */}
      <div className="bg-white border-b border-stone-200 px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-stone-700">Preview</span>
          <span className="text-xs text-stone-400 bg-stone-100 px-2 py-0.5 rounded">LHS — card view</span>
          <span className="text-xs text-stone-400 bg-stone-100 px-2 py-0.5 rounded">RHS — full post</span>
        </div>
        <button
          onClick={onClose}
          className="text-sm text-stone-500 hover:text-stone-900 transition-colors flex items-center gap-1"
        >
          ✕ Close preview
        </button>
      </div>

      {/* Split view */}
      <div className="flex flex-1 overflow-hidden">

        {/* LHS — Card highlight (how it looks in the blog grid) */}
        <div className="w-[380px] shrink-0 bg-stone-100 border-r border-stone-200 overflow-y-auto">
          <div className="p-6">
            <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-4 font-sans">
              Blog listing — card view
            </p>
            <div className="bg-parchment">
              {/* Card image */}
              <div className="relative w-full overflow-hidden bg-stone-200" style={{ aspectRatio: "3/2" }}>
                {coverImage ? (
                  <img src={coverImage} alt={title} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-sans text-[11px] uppercase tracking-widest text-stone-400">No image</span>
                  </div>
                )}
              </div>
              {/* Card body */}
              <div className="p-6">
                <h2 className="font-serif text-[24px] leading-tight text-charcoal mb-3">
                  {title || <span className="text-stone-300">Post title…</span>}
                </h2>
                {excerpt && (
                  <p className="font-sans text-sm leading-relaxed text-charcoal/60 line-clamp-3">
                    {excerpt}
                  </p>
                )}
                <p className="font-sans text-[11px] text-charcoal/40 mt-4 tracking-wide">{date}</p>
              </div>
            </div>

            {/* Grid context */}
            <div className="mt-4 opacity-30">
              <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-2 font-sans">Adjacent posts</p>
              <div className="bg-stone-200 rounded h-32" />
            </div>
          </div>
        </div>

        {/* RHS — Full post detail */}
        <div className="flex-1 bg-parchment overflow-y-auto">
          {/* Fake nav */}
          <div className="sticky top-0 bg-parchment/90 backdrop-blur-sm border-b border-charcoal/10 px-8 h-14 flex items-center justify-between">
            <div className="flex flex-col leading-none">
              <span className="font-serif text-[18px] text-charcoal">The Blog</span>
              <span className="font-sans text-[10px] uppercase tracking-widest text-warm-grey">by Atelier Shreenu</span>
            </div>
          </div>

          <div className="max-w-[680px] mx-auto px-8 py-12">
            {/* Cover image */}
            {coverImage && (
              <div className="relative w-full bg-stone-200 rounded-sm overflow-hidden mb-12" style={{ aspectRatio: "16/7" }}>
                <img src={coverImage} alt={title} className="w-full h-full object-cover" />
              </div>
            )}

            {/* Header */}
            <p className="font-sans text-[11px] uppercase tracking-widest text-charcoal/30 mb-4">{date}</p>
            <h1 className="font-serif text-[clamp(32px,4vw,52px)] leading-[1.1] text-charcoal mb-6">
              {title || <span className="text-stone-300">Post title…</span>}
            </h1>
            {excerpt && (
              <p className="font-sans text-[17px] leading-relaxed text-charcoal/60 mb-6">
                {excerpt}
              </p>
            )}
            <div className="h-px bg-charcoal/10 mb-10" />

            {/* Body */}
            {content ? (
              <article
                className="prose prose-stone prose-lg max-w-none prose-headings:font-serif prose-headings:font-normal prose-a:text-burgundy"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : (
              <p className="text-stone-300 font-sans text-sm">Post content will appear here…</p>
            )}

            <div className="mt-16 pt-8 border-t border-charcoal/10">
              <span className="font-sans text-[11px] uppercase tracking-[0.12em] text-burgundy">
                ← Back to all posts
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
