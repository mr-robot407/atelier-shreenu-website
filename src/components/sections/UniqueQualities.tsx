"use client";

import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { qualities } from "@/content/qualities";
import {
  Compass,
  Award,
  Layers,
  Users,
  MapPin,
} from "lucide-react";

const iconMap = {
  compass: Compass,
  award: Award,
  layers: Layers,
  users: Users,
  "map-pin": MapPin,
};

export function UniqueQualities() {
  return (
    <section
      className="border-t border-charcoal/10 py-24 md:py-44"
      style={{ backgroundColor: "#F5F1E8" }}
    >
      <Container>

        {/* ── Section heading — centered ── */}
        <FadeIn className="text-center mb-12 md:mb-16">
          <span className="font-sans text-micro tracking-widest text-burgundy uppercase mb-5 block">
            Why this practice
          </span>
          <h2 className="font-serif text-[34px] md:text-[52px] leading-tight text-charcoal">
            The convictions behind
            <br />
            <span className="italic">the practice.</span>
          </h2>
        </FadeIn>

        {/* ── Logo seal — centered centerpiece ── */}
        <FadeIn delay={0.18} className="flex flex-col items-center mb-16 md:mb-28">

          {/* Ornamental diamond */}
          <div className="w-1.5 h-1.5 rotate-45 bg-burgundy/40 mb-8" />

          {/* Logo flanked by thin rules */}
          <div className="flex items-center w-full max-w-[480px] gap-8">
            <div className="flex-1 h-px bg-charcoal/18" style={{ backgroundColor: "rgba(28,28,28,0.18)" }} />
            <div className="relative w-36 h-36 md:w-48 md:h-48 flex-shrink-0">
              <Image
                src="/Shreenu logo maroon.jpeg"
                alt="Atelier Shreenu monogram"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 144px, 192px"
              />
            </div>
            <div className="flex-1 h-px" style={{ backgroundColor: "rgba(28,28,28,0.18)" }} />
          </div>

          {/* Caption */}
          <p className="font-sans text-micro tracking-widest text-charcoal/40 text-center uppercase mt-6">
            Est. 2012 &ensp;·&ensp; Gurugram, India
          </p>
        </FadeIn>

        {/* ── Qualities grid ── */}
        <div className="grid grid-cols-1 gap-px bg-charcoal/15 md:grid-cols-2 lg:grid-cols-3">
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

          {/* 6th cell — studio pull quote */}
          <FadeIn delay={0.28 + qualities.length * 0.06}>
            <div
              className="flex flex-col justify-center h-full min-h-[280px] p-8 md:p-10"
              style={{ backgroundColor: "#F5F1E8" }}
            >
              <div className="h-px w-8 bg-burgundy mb-7" />
              <blockquote className="font-serif text-[22px] md:text-[24px] italic leading-snug text-charcoal/65">
                &ldquo;We design not for the moment of arrival, but for the decade of living within.&rdquo;
              </blockquote>
              <cite className="mt-5 block font-sans text-micro not-italic tracking-widest text-charcoal/38 uppercase"
                style={{ color: "rgba(28,28,28,0.38)" }}>
                — Ranjeet &amp; Shreenu Mukherjee
              </cite>
            </div>
          </FadeIn>
        </div>

      </Container>
    </section>
  );
}
