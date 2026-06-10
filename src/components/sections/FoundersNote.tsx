"use client";

import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionLabel } from "@/components/ui/SectionHeading";

export function FoundersNote() {
  return (
    <section id="studio" className="border-t border-ink/10 py-24 md:py-36">
      <Container>
        <FadeIn>
          <SectionLabel className="mb-6 block">The Studio</SectionLabel>
        </FadeIn>

        <div className="mt-12 grid grid-cols-12 gap-8 md:mt-16 md:gap-12">
          {/* Photo - full width on mobile, spans 5 cols on desktop */}
          <FadeIn delay={0.1} className="col-span-12 md:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden md:aspect-[3/4]">
              <Image
                src="/images/team/A+D.jpg"
                alt="Shreenu and Ranjeet Mukherjee — Founders of Atelier Shreenu"
                fill
                className="object-cover grayscale-[15%] transition-all duration-700 hover:grayscale-0"
                sizes="(max-width: 768px) 100vw, 42vw"
              />
              {/* Subtle vignette */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/5 to-transparent" />
            </div>
          </FadeIn>

          {/* Text content */}
          <div className="col-span-12 md:col-span-7">
            <FadeIn delay={0.15}>
              <h2 className="font-serif text-[40px] leading-tight md:text-[56px]">
                Shreenu &amp;<br />
                <span className="italic">Ranjeet</span> Mukherjee.
              </h2>
            </FadeIn>

            <div className="mt-8 space-y-6 text-base leading-relaxed text-ink/75 md:mt-10 md:text-[17px]">
              <FadeIn delay={0.2}>
                <p>
                  Shreenu is an interior designer trained at L.S. Raheja School of
                  Architecture, Mumbai. She spent seven years working in Bombay before
                  co-founding the practice in 2012. She leads operations and interior
                  design, bringing material sensitivity and considered detail to every
                  interior.
                </p>
              </FadeIn>

              <FadeIn delay={0.25}>
                <p>
                  Ranjeet attended The Doon School before graduating from the Faculty of
                  Architecture, CEPT University, Ahmedabad. He is the business head and
                  architecture lead of the practice, bringing rigour and spatial clarity
                  to every project.
                </p>
              </FadeIn>

              <FadeIn delay={0.3}>
                <p className="text-ink/65">
                  In 2012, they embarked upon a journey to explore ecologically appropriate
                  design and construction techniques. Their practice is one that grows
                  organically and adapts to each task with considered intent.
                </p>
              </FadeIn>

              <FadeIn delay={0.35}>
                <p className="text-ink/80">
                  Today, that practice continues as Atelier Shreenu —{" "}
                  <span className="italic">The Cultivated Practice.</span>
                </p>
              </FadeIn>

              <FadeIn delay={0.4}>
                <div className="text-micro mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-ink/10 pt-8 text-ink/55">
                  <span>Council of Architecture · CA/2009/44099</span>
                  <span>Indian Institute of Architects · F26195</span>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}