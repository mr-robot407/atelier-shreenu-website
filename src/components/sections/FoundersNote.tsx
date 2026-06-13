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
          {/* Photo — maroon border, full width on mobile, 5 cols on desktop */}
          <FadeIn delay={0.1} className="col-span-12 md:col-span-5">
            <div
              className="relative aspect-[4/5] overflow-hidden md:aspect-[3/4]"
              style={{ border: "3px solid #7D2027" }}
            >
              <Image
                src="/images/team/A+D.jpg"
                alt="Shreenu and Ranjeet Mukherjee, founders of Atelier Shreenu"
                fill
                draggable={false}
                className="object-cover grayscale-[15%] transition-all duration-700 hover:grayscale-0 select-none"
                sizes="(max-width: 768px) 100vw, 42vw"
              />
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
                  Founded from a decade of thoughtful practice and acclaimed work, Atelier Shreenu builds on the legacy of The Vrindavan Project, established in 2012. Led by interior designer Shreenu Mukherjee and architect Ranjeet Mukherjee, the original practice earned recognition for sensitive heritage restorations, refined hospitality interiors, luxurious farmhouses, and elegant residential projects.
                </p>
              </FadeIn>

              <FadeIn delay={0.25}>
                <p>
                  Atelier Shreenu is the next chapter: a more advanced, future-ready studio formed to meet a rising demand for commercial engagements and residential design spanning contemporary aesthetics to classical sensibilities. Combining Shreenu's signature eye for refined detailing in materiality with Ranjeet's strategic architectural leadership, the studio brings together a skilled, multidisciplinary team that balances technology, practicality, and lasting beauty.
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
