"use client";

import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { projects } from "@/content/projects";

export function SelectedWork() {
  return (
    <section id="work" className="border-t border-ink/10 py-24 md:py-36">
      <Container>
        <div className="mb-16 flex flex-col gap-6 md:mb-24 md:flex-row md:items-end md:justify-between">
          <div>
            <span
              className="font-sans font-medium uppercase text-burgundy tracking-widest mb-6 block"
              style={{ fontSize: "20px" }}
            >
              Selected Work
            </span>
            <h2 className="font-serif text-[34px] leading-tight text-charcoal md:text-[52px]">
              Projects rooted
              <br />
              <span className="italic">in place.</span>
            </h2>
          </div>
          <a
            href="#contact"
            className="text-micro border-b border-ink/40 pb-1 transition-colors duration-200 hover:text-burgundy hover:border-burgundy"
          >
            Enquire about a project
          </a>
        </div>

        {/* Equal 2-col grid — no stagger so all images share the same vertical baseline */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2">
          {projects.map((p, i) => (
            <FadeIn key={p.slug} delay={i * 0.1}>
              <div className="group">
                {/* Image wrapper — consistent aspect ratio; overlay blocks Google Lens icon */}
                <div className="relative aspect-[4/5] overflow-hidden bg-stone/20">
                  <Image
                    src={p.image}
                    alt={`${p.title}, ${p.location}`}
                    fill
                    draggable={false}
                    className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03] select-none"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {/* Transparent overlay — prevents browser image-search UI from appearing */}
                  <div className="absolute inset-0 z-[1]" aria-hidden="true" />
                </div>

                <div className="mt-6">
                  <h3 className="font-serif text-2xl md:text-3xl text-charcoal">{p.title}</h3>
                  <p
                    className="mt-2 font-sans font-medium uppercase tracking-widest text-burgundy"
                    style={{ fontSize: "20px" }}
                  >
                    {p.category}
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
