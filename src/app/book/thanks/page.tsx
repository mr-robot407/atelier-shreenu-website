"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { InstagramIcon } from "@/components/ui/SocialIcons";

const INSTAGRAM_URL = "https://www.instagram.com/ateliershreenu/";
const INSTAGRAM_HANDLE = "@ateliershreenu";

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Kolkata",
  });
}

const KIND_LABEL: Record<string, string> = {
  discovery_call: "Discovery Call",
  project_discussion: "Project Discussion",
  site_walkthrough: "Site & Vision Walkthrough",
};

export default function ThanksPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-warm-ivory" />}>
      <ThanksPageInner />
    </Suspense>
  );
}

function ThanksPageInner() {
  const params = useSearchParams();
  const kind = params.get("kind") ?? "discovery_call";
  const slot = params.get("slot") ?? "";
  const label = KIND_LABEL[kind] ?? "Appointment";

  return (
    <main className="min-h-dvh bg-warm-ivory font-sans text-charcoal">
      <div className="mx-auto flex min-h-dvh max-w-2xl flex-col justify-center px-6 py-16 md:py-24">
        {/* Confirmation header */}
        <section className="text-center animate-fade-in">
          <p className="font-sans text-micro uppercase tracking-widest text-burgundy">
            Confirmed
          </p>

          <h1 className="mt-6 font-serif text-4xl leading-[1.1] tracking-tight md:text-6xl">
            Your {label}
            <br />
            <span className="italic text-burgundy">is confirmed.</span>
          </h1>

          {slot && (
            <div className="mx-auto mt-10 max-w-md border border-charcoal/15 bg-parchment/40 px-6 py-5">
              <p className="font-sans text-micro uppercase tracking-widest text-warm-grey">
                Scheduled For
              </p>
              <p className="mt-2 font-serif text-xl leading-snug md:text-2xl">
                {formatDate(slot)}
              </p>
              <p className="mt-1 font-sans text-micro uppercase tracking-widest text-warm-grey">
                Indian Standard Time
              </p>
            </div>
          )}

          <p className="mx-auto mt-8 max-w-lg text-[15px] leading-relaxed text-warm-grey">
            A confirmation email with the calendar invite is on its way. The
            studio looks forward to the conversation.
          </p>
        </section>

        {/* Instagram invitation — the focal moment */}
        <section className="mt-20 text-center md:mt-24">
          <p className="font-sans text-micro uppercase tracking-widest text-warm-grey">
            While you wait
          </p>
          <h2 className="mt-4 font-serif text-2xl leading-tight md:text-3xl">
            Step inside the studio&rsquo;s world.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-warm-grey">
            Selected projects, material studies, and process notes &mdash;
            shared first on Instagram.
          </p>

          {/* Big bold Instagram button */}
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-10 flex w-full cursor-pointer items-center justify-center gap-4 border-2 border-charcoal bg-charcoal px-6 py-6 text-warm-ivory transition-all duration-300 hover:border-burgundy hover:bg-burgundy hover:shadow-[0_20px_40px_-15px_rgba(125,32,39,0.45)] focus:outline-none focus:ring-2 focus:ring-burgundy focus:ring-offset-4 focus:ring-offset-warm-ivory motion-safe:hover:-translate-y-1 md:gap-6 md:px-8 md:py-8"
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
              <span className="mt-1 font-sans text-micro uppercase tracking-widest text-warm-ivory/70">
                {INSTAGRAM_HANDLE}
              </span>
            </span>
          </a>

          <Link
            href="/"
            className="mt-10 inline-flex min-h-[44px] items-center font-sans text-micro uppercase tracking-widest text-warm-grey transition-colors duration-200 hover:text-charcoal"
          >
            Return to the studio
          </Link>
        </section>
      </div>
    </main>
  );
}
