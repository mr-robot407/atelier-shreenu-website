import Link from "next/link";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { site } from "@/content/site";

export const metadata = {
  title: "Thank You",
  robots: { index: false },
};

export default function ThankYouPage() {
  return (
    <>
      <Nav />
      <main className="flex min-h-[90vh] flex-col items-center justify-center bg-ink px-6 text-center text-bone">
        <div className="max-w-lg">
          <p className="mb-6 font-sans text-xs uppercase tracking-[0.2em] text-terracotta">
            Received
          </p>

          <h1 className="font-serif text-[52px] leading-[1.05] md:text-[72px]">
            Thank you for
            <br />
            <span className="italic text-sandstone">your submission.</span>
          </h1>

          <p className="mt-8 text-[15px] leading-relaxed text-bone/60">
            We read every message personally and will be in touch with you soon.
          </p>

          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="inline-flex min-h-[44px] items-center border border-bone/60 px-8 text-xs uppercase tracking-widest transition-colors duration-200 hover:border-burgundy hover:bg-burgundy hover:text-bone"
            >
              Back to Studio
            </Link>
            <Link
              href="/blog/"
              className="inline-flex min-h-[44px] items-center border border-bone/30 px-8 text-xs uppercase tracking-widest text-bone/70 transition-colors duration-200 hover:border-bone hover:text-bone"
            >
              Visit the Blog
            </Link>
          </div>

          <a
            href={site.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center gap-2 text-xs tracking-widest text-bone/40 transition-colors duration-200 hover:text-bone/70"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
            @ateliershreenu
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}
