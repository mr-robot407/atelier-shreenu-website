"use client";

import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";

export function Philosophy() {
  return (
    <section className="border-t border-ink/10 py-32 md:py-48">
      <Container>
        <div className="grid grid-cols-12 gap-6 items-start">
          {/* PHILOSOPHY — size 20, maroon, all-caps, top-aligned with first line of paragraph */}
          <div className="col-span-12 md:col-span-1 flex md:pt-1">
            <span
              className="font-sans font-medium uppercase text-burgundy tracking-widest [writing-mode:vertical-rl] md:[writing-mode:vertical-rl] self-start"
              style={{ fontSize: "20px", lineHeight: 1 }}
            >
              Philosophy
            </span>
          </div>

          <div className="col-span-12 md:col-span-8">
            <FadeIn>
              <p className="font-serif leading-[1.3] text-ink" style={{ fontSize: "clamp(35px, 3.5vw, 47px)" }}>
                We design not for the moment of arrival, but for the years of living that follow. Every material, proportion, and detail is chosen with intention, knowing that true beauty silently reveals itself through experience, over time.
              </p>
              <div className="mt-12 h-px w-16 bg-burgundy" />
            </FadeIn>
          </div>

          <div className="col-span-12 md:col-span-3">
            <FadeIn delay={0.2}>
              <p className="leading-relaxed text-ink/60" style={{ fontSize: "17px" }}>
                A practice based in Delhi NCR, working across residential, hospitality and commercial spaces across India with roots that reach back to 2012. Today, that Design Firm continues as Atelier Shreenu.
              </p>
            </FadeIn>
          </div>
        </div>
      </Container>
    </section>
  );
}
