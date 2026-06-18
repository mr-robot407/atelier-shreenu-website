"use client";

import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { qualities } from "@/content/qualities";
import { Compass, Award, Layers, Users } from "lucide-react";

const iconMap = {
  compass: Compass,
  award: Award,
  layers: Layers,
  users: Users,
};

export function UniqueQualities() {
  return (
    <section
      className="border-t border-charcoal/10 py-24 md:py-44"
      style={{ backgroundColor: "#F5F1E8" }}
    >
      <Container>

        {/* Section heading — grey (warm-grey) at size 20, same size as PHILOSOPHY */}
        <FadeIn className="text-center mb-12 md:mb-16">
          <h2
            className="font-sans font-medium uppercase tracking-widest"
            style={{ fontSize: "20px", color: "#8C8579" }}
          >
            Convictions behind the Studio
          </h2>
        </FadeIn>

        {/* Logo seal — centred centerpiece */}
        <FadeIn delay={0.18} className="flex flex-col items-center mb-16 md:mb-28">
          {/* Logo flanked by thin rules */}
          <div className="flex items-center w-full max-w-[480px] gap-8">
            <div className="flex-1 h-px" style={{ backgroundColor: "rgba(28,28,28,0.18)" }} />
            <div className="relative w-36 h-36 md:w-48 md:h-48 flex-shrink-0">
              <img
                src="/Shreenu logo maroon.jpeg"
                alt="Atelier Shreenu monogram"
                draggable={false}
                className="object-contain w-full h-full select-none"
              />
            </div>
            <div className="flex-1 h-px" style={{ backgroundColor: "rgba(28,28,28,0.18)" }} />
          </div>

        </FadeIn>

        {/* Four convictions grid */}
        <div className="grid grid-cols-1 gap-px bg-charcoal/15 md:grid-cols-2">
          {qualities.map((q, i) => {
            const Icon = iconMap[q.icon as keyof typeof iconMap];
            return (
              <FadeIn key={q.title} delay={0.28 + i * 0.06}>
                <div className="h-full p-8 md:p-10" style={{ backgroundColor: "#F5F1E8" }}>
                  <div className="mb-6 flex items-center gap-4" aria-hidden="true">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-burgundy/10">
                      {Icon && <Icon className="h-5 w-5 text-burgundy" strokeWidth={1.5} />}
                    </div>
                    <div className="h-px flex-1 bg-charcoal/20" />
                  </div>
                  <h3 className="font-serif text-[26px] leading-tight text-charcoal">{q.title}</h3>
                  <p className="mt-5 text-sm leading-relaxed text-charcoal/75">{q.description}</p>
                </div>
              </FadeIn>
            );
          })}
        </div>

      </Container>
    </section>
  );
}
