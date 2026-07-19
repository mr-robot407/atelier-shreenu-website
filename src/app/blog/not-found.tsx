import Link from "next/link";

export default function BlogNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-parchment px-6 pt-[88px] text-center">
      <div>
        <p className="font-sans text-[11px] uppercase tracking-[0.14em] text-warm-grey">
          Error 404
        </p>
        <h1 className="mt-6 font-serif text-5xl md:text-7xl text-charcoal">
          This page is <span className="italic">lost in place.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-md font-sans text-sm text-charcoal/60">
          The post you are looking for does not exist. It may have been moved,
          renamed, or unpublished.
        </p>
        <Link
          href="/blog"
          className="font-sans text-[11px] uppercase tracking-[0.12em] mt-10 inline-flex border border-burgundy text-burgundy px-7 py-3.5 transition-all hover:bg-burgundy hover:text-warm-ivory"
        >
          Back to the Blog
        </Link>
      </div>
    </main>
  );
}
