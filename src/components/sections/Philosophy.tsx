"use client";

import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";

export function Philosophy() {
  return (
    <section className="border-t border-ink/10 py-32 md:py-48">
      <Container>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-1">
            <span className="text-micro text-ink/50 [writing-mode:vertical-rl]">
              Philosophy
            </span>
          </div>

          <div className="col-span-12 md:col-span-8">
            <FadeIn>
              <p className="font-serif text-[32px] leading-[1.3] text-ink md:text-[44px]">
                We design not for the moment of arrival, but for the decade of{" "}
                <span className="italic text-terracotta">living within.</span>{" "}
                Every material, proportion, and silence is chosen with the
                understanding that beauty deepens with time.
              </p>
              <div className="mt-12 h-px w-16 bg-terracotta" />
            </FadeIn>
          </div>

          <div className="col-span-12 md:col-span-3">
            <FadeIn delay={0.2}>
              <p className="text-sm leading-relaxed text-ink/60">
                A practice based in Gurugram, working across residential, hospitality and
                heritage spaces across India — with roots that reach back to 2012. Today,
                that practice continues as Atelier Shreenu —{" "}
                <span className="italic text-ink/75">The Cultivated Practice.</span>
              </p>
            </FadeIn>
          </div>
        </div>
      </Container>
    </section>
  );
}
