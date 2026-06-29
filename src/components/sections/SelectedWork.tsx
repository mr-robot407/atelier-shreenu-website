"use client";

import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { projects } from "@/content/projects";

export function SelectedWork() {
  return (
    <section id="work" className="border-t border-ink/10 pt-16 pb-24 md:py-36">
      <Container>
        <div className="mb-16 flex flex-col gap-6 md:mb-24 md:flex-row md:items-end md:justify-between">
          <div>
            <span
              className="font-sans font-medium uppercase text-burgundy tracking-widest mb-6 block"
              style={{ fontSize: "20px" }}
            >
              Selected Work
            </span>
            <h2 className="font-serif leading-tight text-charcoal md:text-[52px]" style={{ fontSize: "clamp(30px, 8vw, 34px)" }}>
              Projects rooted
              <br />
              <span className="italic">in place.</span>
            </h2>
          </div>
          <a
            href="#contact"
            style={{ touchAction: "manipulation" }}
            className="inline-flex items-center min-h-[44px] px-5 text-micro border border-burgundy text-burgundy transition-colors duration-200 hover:bg-burgundy hover:text-warm-ivory"
          >
            Enquire about a project
          </a>
        </div>

        {/* Projects — each row: name + two images side by side */}
        <div className="flex flex-col gap-16 md:gap-28">
          {projects.map((p, i) => (
            <FadeIn key={p.slug} delay={i * 0.08}>
              <div>
                {/* Architecture + Interior side by side */}
                <div className="group grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-8">

                  {/* Architecture */}
                  <div>
                    <div className="relative aspect-[4/5] overflow-hidden bg-stone/20">
                      <Image
                        src={p.architectureImage}
                        alt={`${p.title} — Architecture`}
                        fill
                        draggable={false}
                        className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.02] select-none"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 z-[1]" aria-hidden="true" />
                    </div>
                    <div className="mt-3 flex items-baseline justify-between">
                      <h3 className="font-serif text-xl text-charcoal">{p.title}</h3>
                      <span className="text-micro text-ink/50">EXTERIOR</span>
                    </div>
                  </div>

                  {/* Interior */}
                  <div>
                    <div className="relative aspect-[4/5] overflow-hidden bg-stone/20">
                      <Image
                        src={p.interiorImage}
                        alt={`${p.title} — Interior`}
                        fill
                        draggable={false}
                        className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.02] select-none"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 z-[1]" aria-hidden="true" />
                    </div>
                    <div className="mt-3 flex justify-end">
                      <span className="text-micro text-ink/50">Interior</span>
                    </div>
                  </div>

                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
