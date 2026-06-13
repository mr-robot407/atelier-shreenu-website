"use client";

import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { press } from "@/content/press";

export function Press() {
  return (
    <section id="press" className="border-t border-ink/10 py-20 md:py-28">
      <Container>
        <FadeIn>
          {/* PRESS HIGHLIGHTS — maroon, 20px, all-caps (matches PHILOSOPHY size) */}
          <h2
            className="font-sans font-medium uppercase tracking-widest text-burgundy mb-6"
            style={{ fontSize: "20px" }}
          >
            Press Highlights
          </h2>

          <p className="font-sans text-[13px] italic text-warm-grey mb-12">
            Selected Media Article about our practice, formerly known as The Vrindavan Project
          </p>

          {/* Logo grid: 2 cols mobile → 4 cols desktop */}
          {/* When logo images are provided, replace the name span with an <img> tag */}
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {press.map((p) => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={p.name}
                className="group flex min-h-[80px] cursor-pointer items-center justify-center border border-ink/10 px-4 py-5 transition-all duration-300 hover:border-burgundy/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2"
              >
                {p.logo ? (
                  // When logo asset is available: grayscale by default, full color on hover
                  <img
                    src={p.logo}
                    alt={p.name}
                    draggable={false}
                    className="max-h-8 w-auto object-contain grayscale transition-all duration-300 group-hover:grayscale-0"
                  />
                ) : (
                  // Fallback text until logo assets are provided by client
                  <span className="font-serif text-sm italic text-ink/50 text-center transition-colors duration-300 group-hover:text-burgundy">
                    {p.name}
                  </span>
                )}
              </a>
            ))}
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
