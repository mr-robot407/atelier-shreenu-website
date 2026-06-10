"use client";

import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionLabel, SectionHeading } from "@/components/ui/SectionHeading";
import { projects } from "@/content/projects";

export function SelectedWork() {
  return (
    <section id="work" className="border-t border-ink/10 py-24 md:py-36">
      <Container>
        <div className="mb-16 flex flex-col gap-6 md:mb-24 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel className="mb-6 block">Selected Work</SectionLabel>
            <SectionHeading>
              Projects rooted
              <br />
              <span className="italic">in place.</span>
            </SectionHeading>
          </div>
          <a
            href="#contact"
            className="text-micro border-b border-ink/40 pb-1 hover:border-ink"
          >
            Enquire about a project
          </a>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-20 md:grid-cols-2 md:gap-y-32">
          {projects.map((p, i) => (
            <FadeIn
              key={p.slug}
              delay={(i % 2) * 0.12}
              className={i % 2 === 1 ? "md:mt-24" : ""}
            >
              <div className="group">
                <div className="relative aspect-[4/5] overflow-hidden bg-ivory">
                  <Image
                    src={p.image}
                    alt={`${p.title} — ${p.location}`}
                    fill
                    className="object-cover transition-transform duration-[1200ms] ease-soft-out group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="mt-6 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-2xl md:text-3xl">{p.title}</h3>
                    <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink/65">
                      {p.description}
                    </p>
                  </div>
                  <div className="text-micro shrink-0 text-ink/55">
                    {p.location.toUpperCase()} — {p.year}
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
