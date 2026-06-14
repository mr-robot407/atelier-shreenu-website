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
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {press.map((p) => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={p.name}
                className="group flex min-h-[100px] cursor-pointer items-center justify-center rounded-sm px-6 py-6 bg-warm-ivory
                  shadow-[0_1px_4px_rgba(28,20,14,0.08),0_0_0_0.5px_rgba(28,20,14,0.06)]
                  transition-all duration-300
                  hover:shadow-[0_6px_20px_rgba(28,20,14,0.13),0_1px_4px_rgba(28,20,14,0.08)]
                  active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.08)] active:scale-[0.98]
                  focus:outline-none"
              >
                {p.logo ? (
                  p.square ? (
                    <div className="flex items-center justify-center rounded-[2px] border border-ink/[0.11] p-2.5 transition-all duration-300 group-hover:border-ink/[0.18]">
                      <img
                        src={p.logo}
                        alt={p.name}
                        draggable={false}
                        className="h-12 w-12 object-contain grayscale opacity-70 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100"
                      />
                    </div>
                  ) : (
                    <img
                      src={p.logo}
                      alt={p.name}
                      draggable={false}
                      className="max-h-10 max-w-full w-auto object-contain grayscale opacity-70 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100"
                    />
                  )
                ) : (
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
