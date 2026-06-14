"use client";

import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";

export function Philosophy() {
  return (
    <section className="border-t border-ink/10 py-32 md:py-48">
      <Container>

        {/* PHILOSOPHY label — horizontal, above the paragraph block */}
        <FadeIn>
          <span
            className="block mb-8 md:mb-10 font-sans font-medium uppercase text-burgundy tracking-widest"
            style={{ fontSize: "20px", lineHeight: 1 }}
          >
            Philosophy
          </span>
        </FadeIn>

        <div className="grid grid-cols-12 gap-6 items-start">

          {/* P1 — main large quote */}
          <div className="col-span-12 md:col-span-7">
            <FadeIn>
              <p className="font-serif leading-[1.3] text-ink" style={{ fontSize: "clamp(34px, 3.4vw, 46px)" }}>
                We design not for the moment of arrival, but for the years of living
                that follow. Every material, proportion, and detail is chosen with
                intention, knowing that true beauty silently reveals itself through
                experience, over time.
              </p>
            </FadeIn>
          </div>

          {/* P2 — adjacent right, 1 empty col gap before it, top-aligned with P1 */}
          <div className="col-span-12 md:col-span-4 md:col-start-9 md:pt-3">
            <FadeIn delay={0.2}>
              <p className="leading-relaxed text-ink/60" style={{ fontSize: "19px" }}>
                A practice based in Delhi NCR, working across residential, hospitality
                and commercial spaces across India with roots that reach back to 2012.
                Today, that Design Firm continues as Atelier Shreenu.
              </p>
            </FadeIn>
          </div>

        </div>

        {/* Rule from P1 left edge to P2 right edge */}
        <div className="mt-12 h-px bg-burgundy" />

      </Container>
    </section>
  );
}
