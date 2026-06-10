"use client";

import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { press } from "@/content/press";

export function Press() {
  return (
    <section id="press" className="border-t border-ink/10 py-20 md:py-28">
      <Container>
        <FadeIn>
          <div className="mb-10 flex items-center gap-4">
            <span className="text-micro text-ink/55">Featured in</span>
            <div className="h-px flex-1 bg-ink/15" />
          </div>

          <div className="flex flex-wrap items-center gap-x-10 gap-y-6 md:gap-x-16">
            {press.map((p) => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] cursor-pointer items-center font-serif text-xl italic text-ink/70 transition-colors hover:text-ink focus:outline-none focus-visible:ring-1 focus-visible:ring-ink/50 md:text-2xl"
              >
                {p.name}
              </a>
            ))}
          </div>

          <p className="mt-8 font-sans text-[13px] italic text-warm-grey">
            Selected press from our practice, previously known as The Vrindavan Project.
          </p>
        </FadeIn>
      </Container>
    </section>
  );
}
