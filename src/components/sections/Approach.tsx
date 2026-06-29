"use client";

import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionLabel, SectionHeading } from "@/components/ui/SectionHeading";
import { approach } from "@/content/approach";

export function Approach() {
  return (
    <section id="approach" className="border-t border-ink/10 bg-ivory/60 py-16 md:py-36">
      <Container>
        <FadeIn className="mb-10 md:mb-28">
          <SectionLabel className="mb-6 block">The Approach</SectionLabel>
          <SectionHeading>
            A process as
            <br />
            <span className="italic">deliberate</span> as the work itself.
          </SectionHeading>
        </FadeIn>

        <div className="divide-y divide-ink/15 border-y border-ink/15">
          {approach.map((step, i) => (
            <FadeIn key={step.number} delay={i * 0.05}>
              <div className="grid grid-cols-12 gap-4 py-8 md:gap-6 md:py-14">
                <div className="col-span-12 md:col-span-2">
                  <div className="font-serif text-4xl text-ink/30 md:text-6xl">
                    {step.number}
                  </div>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <h3 className="font-serif md:text-4xl" style={{ fontSize: "clamp(22px, 6vw, 30px)" }}>{step.title}</h3>
                  <div className="text-micro mt-3 text-terracotta">
                    Step {parseInt(step.number, 10)} of {approach.length}
                  </div>
                </div>
                <div className="col-span-12 md:col-span-6">
                  <p className="text-base leading-relaxed text-ink/75">
                    {step.description}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
