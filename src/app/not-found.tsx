import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bone px-6 text-center">
      <div>
        <div className="text-micro text-terracotta">Error 404</div>
        <h1 className="mt-6 font-serif text-5xl md:text-7xl">
          This page is <span className="italic">lost in place.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-md text-ink/65">
          The page you are looking for does not exist. It may have been moved, renamed, or
          never built at all.
        </p>
        <Link
          href="/"
          className="text-micro mt-10 inline-flex border border-ink/60 px-7 py-3.5 transition-all hover:bg-ink hover:text-bone"
        >
          Return home
        </Link>
      </div>
    </main>
  );
}
