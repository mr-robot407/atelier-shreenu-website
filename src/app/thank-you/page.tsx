import Link from "next/link";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { InstagramIcon } from "@/components/ui/SocialIcons";
import { site } from "@/content/site";

const INSTAGRAM_HANDLE = "@ateliershreenu";

export const metadata = {
  title: "Thank You",
  robots: { index: false },
};

export default function ThankYouPage() {
  return (
    <>
      <Nav />
      <main className="flex min-h-dvh flex-col items-center justify-center bg-ink px-6 py-16 text-center text-bone md:py-24">
        <div className="w-full max-w-lg">
          <p className="font-sans text-xs uppercase tracking-[0.2em] text-terracotta">
            Received
          </p>

          <h1 className="mt-6 font-serif text-[44px] leading-[1.05] md:text-[72px]">
            Thank you for
            <br />
            <span className="italic text-sandstone">your submission.</span>
          </h1>

          <p className="mt-8 text-[15px] leading-relaxed text-bone/60">
            We read every message personally and will be in touch with you soon.
          </p>

          {/* Instagram invitation — focal point */}
          <div className="mt-20 md:mt-24">
            <p className="font-sans text-xs uppercase tracking-[0.2em] text-bone/50">
              While you wait
            </p>
            <h2 className="mt-4 font-serif text-2xl leading-tight text-bone md:text-3xl">
              Step inside the studio&rsquo;s world.
            </h2>
            <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-bone/60">
              Selected projects, material studies, and process notes &mdash;
              shared first on Instagram.
            </p>

            <a
              href={site.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-10 flex w-full cursor-pointer items-center justify-center gap-4 border-2 border-burgundy bg-burgundy px-6 py-6 text-bone transition-all duration-300 hover:border-bone hover:bg-deep-wine hover:shadow-[0_20px_40px_-15px_rgba(125,32,39,0.6)] focus:outline-none focus:ring-2 focus:ring-bone focus:ring-offset-4 focus:ring-offset-ink motion-safe:hover:-translate-y-1 md:gap-6 md:px-8 md:py-8"
              aria-label={`Follow Atelier Shreenu on Instagram at ${INSTAGRAM_HANDLE}`}
            >
              <InstagramIcon
                className="h-8 w-8 shrink-0 transition-transform duration-300 motion-safe:group-hover:scale-110 md:h-10 md:w-10"
                strokeWidth={1.75}
              />
              <span className="flex flex-col items-start text-left">
                <span className="font-serif text-2xl leading-tight tracking-tight md:text-3xl">
                  Follow the Atelier
                </span>
                <span className="mt-1 font-sans text-[11px] uppercase tracking-[0.2em] text-bone/70">
                  {INSTAGRAM_HANDLE}
                </span>
              </span>
            </a>
          </div>

          {/* Secondary navigation */}
          <div className="mt-10 flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-8">
            <Link
              href="/"
              className="inline-flex min-h-[44px] items-center font-sans text-xs uppercase tracking-widest text-bone/60 transition-colors duration-200 hover:text-bone"
            >
              Back to Studio
            </Link>
            <Link
              href="/blog/"
              className="inline-flex min-h-[44px] items-center font-sans text-xs uppercase tracking-widest text-bone/60 transition-colors duration-200 hover:text-bone"
            >
              Visit the Blog
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
